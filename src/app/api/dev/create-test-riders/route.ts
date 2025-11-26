import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

// This endpoint creates test riders using Supabase Admin API
// Only works in development mode
export async function POST(request: NextRequest) {
    // Only allow in development
    if (process.env.NODE_ENV !== 'development') {
        return NextResponse.json({ error: 'Only available in development' }, { status: 403 })
    }

    try {
        // Hardcoded service role key for development
        const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InludWlpdGdzbXVkZ3hhb2x2aGhqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzkyNjMzOSwiZXhwIjoyMDc5NTAyMzM5fQ.6AujsS61AlHE548_AuK_I-2r40j8T2fP8W2bmcgT-80'

        // Create Supabase admin client
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            serviceRoleKey,
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false
                }
            }
        )

        const riders = [
            { mobile: '9900000001', firstName: 'Rajesh', lastName: 'Sharma', pidgeId: 'TEST001', city: 'Mumbai', hub: 'Andheri', wallet: 15000 },
            { mobile: '9900000002', firstName: 'Amit', lastName: 'Patel', pidgeId: 'TEST002', city: 'Mumbai', hub: 'Bandra', wallet: 8500 },
            { mobile: '9900000003', firstName: 'Vikram', lastName: 'Singh', pidgeId: 'TEST003', city: 'Mumbai', hub: 'Powai', wallet: 3200 },
            { mobile: '9900000004', firstName: 'Suresh', lastName: 'Gupta', pidgeId: 'TEST004', city: 'Mumbai', hub: 'Goregaon', wallet: 6500 },
            { mobile: '9900000005', firstName: 'Priya', lastName: 'Desai', pidgeId: 'TEST005', city: 'Mumbai', hub: 'Malad', wallet: 1200 }
        ]

        const results = []

        for (const rider of riders) {
            const email = `${rider.mobile}@rider.shreejientserv.in`

            // Delete existing user if exists
            const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
            const existingUser = existingUsers?.users.find((u: any) => u.email === email)
            if (existingUser) {
                await supabaseAdmin.auth.admin.deleteUser(existingUser.id)
            }

            // Create auth user with admin API
            const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
                email,
                password: 'rider123',
                email_confirm: true,
                user_metadata: {
                    role: 'rider'
                }
            })

            if (authError) {
                results.push({ mobile: rider.mobile, error: authError.message })
                continue
            }

            // Get scheme ID
            const { data: scheme } = await supabaseAdmin
                .from('schemes')
                .select('id')
                .eq('name', 'Regular Scheme')
                .single()

            // Delete existing rider record if exists
            await supabaseAdmin
                .from('riders')
                .delete()
                .eq('mobile', rider.mobile)

            // Create rider record
            const { error: riderError } = await supabaseAdmin
                .from('riders')
                .insert({
                    user_id: authData.user.id,
                    first_name: rider.firstName,
                    last_name: rider.lastName,
                    mobile: rider.mobile,
                    email,
                    pidge_rider_id: rider.pidgeId,
                    city: rider.city,
                    hub: rider.hub,
                    current_scheme_id: scheme?.id,
                    status: 'active',
                    wallet_balance: rider.wallet,
                    frozen_balance: rider.mobile === '9900000004' ? 350 : 0
                })

            if (riderError) {
                results.push({ mobile: rider.mobile, error: riderError.message })
            } else {
                results.push({ mobile: rider.mobile, success: true, email })
            }
        }

        return NextResponse.json({
            message: 'Test riders created',
            results
        })

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
