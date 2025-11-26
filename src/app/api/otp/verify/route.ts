import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const { mobile, code } = await request.json()

        // In development, accept any 6-digit code
        if (process.env.NODE_ENV === 'development') {
            if (code.length === 6 && /^\d+$/.test(code)) {
                console.log(`[DEV] OTP verified for ${mobile}: ${code}`)
                return NextResponse.json({ success: true })
            }
            return NextResponse.json({ success: false, error: 'Invalid OTP' })
        }

        // TODO: Integrate Twilio verification in production
        // For now, accept any 6-digit code
        if (code.length === 6 && /^\d+$/.test(code)) {
            return NextResponse.json({ success: true })
        }

        return NextResponse.json({ success: false, error: 'Invalid OTP' })

    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        )
    }
}
