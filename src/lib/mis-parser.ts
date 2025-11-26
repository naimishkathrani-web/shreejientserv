import * as XLSX from 'xlsx'
import { createClient } from '@/lib/supabase/client'

export interface MISRecord {
    rider_id: string
    date: string
    orders: number
    distance: number
    login_hours: number
    pidge_earning: number
    pidge_incentive: number
}

export async function parseMISFile(file: File): Promise<{ success: boolean; count: number; errors: string[] }> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.onload = async (e) => {
            try {
                const data = new Uint8Array(e.target?.result as ArrayBuffer)
                const workbook = XLSX.read(data, { type: 'array' })
                const sheetName = workbook.SheetNames[0]
                const sheet = workbook.Sheets[sheetName]
                const jsonData = XLSX.utils.sheet_to_json(sheet)

                const supabase = createClient()
                const errors: string[] = []
                let successCount = 0

                // Get active slab rules
                const { data: slabRules } = await supabase
                    .from('slab_rules')
                    .select('*')
                    .order('min_orders', { ascending: true })

                for (const row of jsonData as any[]) {
                    try {
                        // Map fields (adjust keys based on actual Excel headers)
                        const pidgeId = row['Rider ID'] || row['RiderId'] || row['ID']
                        if (!pidgeId) continue

                        // Find rider
                        const { data: rider } = await supabase
                            .from('riders')
                            .select('id')
                            .eq('pidge_rider_id', pidgeId)
                            .single()

                        if (!rider) {
                            errors.push(`Rider not found: ${pidgeId}`)
                            continue
                        }

                        const orders = Number(row['Orders'] || row['Completed Orders'] || 0)
                        const distance = Number(row['Distance'] || row['Total Distance'] || 0)
                        const pidgeEarning = Number(row['Earning'] || row['Total Earning'] || 0)
                        const pidgeIncentive = Number(row['Incentive'] || 0)
                        const date = row['Date'] ? new Date(row['Date']).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]

                        // Calculate Slab Amount
                        let slabAmount = 0
                        if (slabRules) {
                            for (const rule of slabRules) {
                                if (orders >= rule.min_orders && orders <= rule.max_orders) {
                                    slabAmount = rule.amount
                                    break
                                }
                            }
                        }

                        // Final Payout Logic: Max(Pidge Total, Slab Amount)
                        const pidgeTotal = pidgeEarning + pidgeIncentive
                        const finalPayout = Math.max(pidgeTotal, slabAmount)

                        // Insert/Update Daily Transaction
                        const { error } = await supabase
                            .from('daily_transactions')
                            .upsert({
                                rider_id: rider.id,
                                date,
                                pidge_orders: orders,
                                pidge_distance_km: distance,
                                pidge_daily_earning: pidgeEarning,
                                pidge_daily_incentive: pidgeIncentive,
                                pidge_total: pidgeTotal,
                                slab_amount: slabAmount,
                                final_payout: finalPayout,
                                status: 'calculated'
                            }, { onConflict: 'rider_id, date' })

                        if (error) {
                            errors.push(`Failed to save for ${pidgeId}: ${error.message}`)
                        } else {
                            // Update Wallet Balance
                            // Note: This should ideally be done in a separate "Process Payout" step
                            // But for MVP, we can auto-credit or just calculate
                            successCount++
                        }

                    } catch (err: any) {
                        errors.push(`Error processing row: ${err.message}`)
                    }
                }

                resolve({ success: true, count: successCount, errors })

            } catch (error: any) {
                resolve({ success: false, count: 0, errors: [error.message] })
            }
        }

        reader.onerror = (error) => reject(error)
        reader.readAsArrayBuffer(file)
    })
}
