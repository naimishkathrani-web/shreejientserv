import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST(request: Request) {
    try {
        const supabase = createClient(supabaseUrl, supabaseServiceKey, {
            auth: { autoRefreshToken: false, persistSession: false }
        })

        const { riders } = await request.json()
        const results = []

        for (const r of riders) {
            if (!r.mobile) {
                results.push({ mobile: r.mobile, status: 'skipped', reason: 'no mobile' })
                continue
            }

            try {
                const email = `${r.mobile}@rider.shreejientserv.in`
                const { data: authData, error: authError } = await supabase.auth.admin.createUser({
                    email,
                    password: r.mobile,
                    email_confirm: true,
                    user_metadata: { role: 'rider' }
                })

                if (authError) {
                    results.push({ mobile: r.mobile, status: 'error', reason: authError.message })
                    continue
                }

                const nameParts = (r.name || `Rider ${r.pidge_id}`).split(' ')
                const { error: riderError } = await supabase.from('riders').insert({
                    user_id: authData.user.id,
                    first_name: nameParts[0] || 'Rider',
                    last_name: nameParts.slice(1).join(' ') || r.pidge_id.toString(),
                    mobile: r.mobile,
                    pidge_rider_id: r.pidge_id,
                    pan_number: r.pan || null,
                    aadhar_number: r.aadhar || null,
                    status: 'active',
                    wallet_balance: 0
                })

                if (riderError) {
                    results.push({ mobile: r.mobile, status: 'error', reason: riderError.message })
                    continue
                }

                results.push({ mobile: r.mobile, status: 'success', name: r.name })
            } catch (error: any) {
                results.push({ mobile: r.mobile, status: 'error', reason: error.message })
            }
        }

        return NextResponse.json({ success: true, results })
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}
