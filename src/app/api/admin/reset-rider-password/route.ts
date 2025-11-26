import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseUrl = 'https://ynuiitgsmudgxaolvhhj.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InludWlpdGdzbXVkZ3hhb2x2aGhqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzkyNjMzOSwiZXhwIjoyMDc5NTAyMzM5fQ.6AujsS61AlHE548_AuK_I-2r40j8T2fP8W2bmcgT-80'


export async function POST(request: Request) {
    try {
        const supabase = createClient(supabaseUrl, supabaseServiceKey, {
            auth: { autoRefreshToken: false, persistSession: false }
        })

        const { mobile, password } = await request.json()

        if (!mobile || !password) {
            return NextResponse.json({ error: 'Mobile and password required' }, { status: 400 })
        }

        const email = `${mobile}@rider.shreejientserv.in`

        // Get rider to find user_id
        const { data: rider } = await supabase
            .from('riders')
            .select('user_id, pidge_rider_id')
            .eq('mobile', mobile)
            .single()

        if (!rider || !rider.user_id) {
            return NextResponse.json({ error: 'Rider not found' }, { status: 404 })
        }

        // Update password using admin API
        const { data: user, error } = await supabase.auth.admin.updateUserById(
            rider.user_id,
            { password: password }
        )

        if (error) {
            console.error('Password update error:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({
            success: true,
            message: `Password updated for ${mobile}`,
            email: email,
            pidge_id: rider.pidge_rider_id
        })

    } catch (error: any) {
        console.error('API error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
