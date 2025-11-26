import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const PIDGE_EMAIL = process.env.PIDGE_EMAIL || 'naimish@shreejientserv.in'
const PIDGE_PASSWORD = process.env.PIDGE_PASSWORD || 'Shreeji@2024'

interface PidgeTrip {
    rider_id: string
    date: string
    completed_trips: number
    accepted_trips: number
    rider_allocated_count: number
}

async function loginPidge(): Promise<string | null> {
    try {
        const response = await fetch('https://app.appsmith.com/api/v1/consolidated/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: PIDGE_EMAIL,
                password: PIDGE_PASSWORD
            })
        })

        const data = await response.json()
        return data.data?.token || null
    } catch (error) {
        console.error('Pidge login error:', error)
        return null
    }
}

async function fetchTodayTrips(token: string): Promise<PidgeTrip[]> {
    try {
        const today = new Date().toISOString().split('T')[0]

        const response = await fetch(
            `https://app.appsmith.com/api/v1/consolidated/pages/floating_fleet_ch/queries/trip_allocation_data_query?startDate=${today}&endDate=${today}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        )

        const data = await response.json()
        return data.data?.body || []
    } catch (error) {
        console.error('Fetch trips error:', error)
        return []
    }
}

export async function GET(request: Request) {
    try {
        // Verify cron secret for security
        const authHeader = request.headers.get('authorization')
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        console.log('🔄 Starting Pidge data sync...')

        // Login to Pidge
        const token = await loginPidge()
        if (!token) {
            return NextResponse.json({ error: 'Pidge login failed' }, { status: 500 })
        }

        // Fetch today's trips
        const trips = await fetchTodayTrips(token)
        console.log(`📊 Fetched ${trips.length} trip records`)

        if (trips.length === 0) {
            return NextResponse.json({
                success: true,
                message: 'No trips found for today',
                synced: 0
            })
        }

        // Get Supabase client
        const supabase = createClient()

        // Get all riders to map pidge_rider_id to rider.id
        const { data: riders } = await supabase
            .from('riders')
            .select('id, pidge_rider_id')

        const riderMap = new Map(
            riders?.map(r => [r.pidge_rider_id, r.id]) || []
        )

        let synced = 0
        let updated = 0
        let errors = 0
        const today = new Date().toISOString().split('T')[0]

        // Process each trip with UPSERT
        for (const trip of trips) {
            const riderId = riderMap.get(trip.rider_id)
            if (!riderId) {
                errors++
                continue
            }

            // Check if record exists for today
            const { data: existing } = await supabase
                .from('daily_transactions')
                .select('pidge_orders, final_payout')
                .eq('rider_id', riderId)
                .eq('date', today)
                .single()

            const newOrders = trip.completed_trips || 0
            const estimatedEarning = newOrders * 35 // Rough estimate: ₹35 per order

            if (existing) {
                // UPSERT: Only update if orders increased
                const orderDelta = newOrders - (existing.pidge_orders || 0)
                if (orderDelta > 0) {
                    const earningDelta = orderDelta * 35

                    // Update daily transaction
                    await supabase
                        .from('daily_transactions')
                        .update({
                            pidge_orders: newOrders,
                            pidge_daily_earning: (existing.final_payout || 0) + earningDelta,
                            final_payout: (existing.final_payout || 0) + earningDelta,
                            updated_at: new Date().toISOString()
                        })
                        .eq('rider_id', riderId)
                        .eq('date', today)

                    // Increment wallet balance
                    await supabase.rpc('increment_wallet', {
                        p_rider_id: riderId,
                        p_amount: earningDelta
                    })

                    updated++
                }
            } else {
                // Insert new record
                await supabase
                    .from('daily_transactions')
                    .insert({
                        rider_id: riderId,
                        date: today,
                        pidge_orders: newOrders,
                        pidge_distance_km: 0,
                        pidge_daily_earning: estimatedEarning,
                        pidge_daily_incentive: 0,
                        pidge_total: estimatedEarning,
                        slab_amount: estimatedEarning,
                        final_payout: estimatedEarning
                    })

                // Add to wallet
                await supabase.rpc('increment_wallet', {
                    p_rider_id: riderId,
                    p_amount: estimatedEarning
                })

                synced++
            }
        }

        console.log(`✅ Sync complete: ${synced} new, ${updated} updated, ${errors} errors`)

        return NextResponse.json({
            success: true,
            synced,
            updated,
            errors,
            total: trips.length,
            timestamp: new Date().toISOString()
        })

    } catch (error: any) {
        console.error('Sync error:', error)
        return NextResponse.json({
            error: error.message
        }, { status: 500 })
    }
}
