import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const { mobile } = await request.json()

        // In development, always return success
        if (process.env.NODE_ENV === 'development') {
            console.log(`[DEV] OTP sent to ${mobile}: 123456`)
            return NextResponse.json({ success: true })
        }

        // TODO: Integrate Twilio in production
        // For now, return success
        return NextResponse.json({ success: true })

    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        )
    }
}
