/**
 * Client-side OTP functions
 * Calls API routes instead of using Twilio directly
 */

/**
 * Send OTP via SMS
 */
export async function sendOTP(mobile: string): Promise<{ success: boolean; error?: string }> {
    try {
        const response = await fetch('/api/otp/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mobile })
        })

        const data = await response.json()
        return data
    } catch (error: any) {
        console.error('OTP send error:', error)
        return { success: false, error: error.message }
    }
}

/**
 * Verify OTP
 */
export async function verifyOTP(mobile: string, code: string): Promise<{ success: boolean; error?: string }> {
    try {
        const response = await fetch('/api/otp/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mobile, code })
        })

        const data = await response.json()
        return data
    } catch (error: any) {
        console.error('OTP verify error:', error)
        return { success: false, error: error.message }
    }
}
