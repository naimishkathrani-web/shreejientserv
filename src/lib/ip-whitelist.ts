import { createClient } from '@/lib/supabase/server'

/**
 * Allowed IP addresses for admin access
 * Add your office IP here
 */
const ALLOWED_ADMIN_IPS = [
    '127.0.0.1', // Localhost
    '::1', // IPv6 localhost
    // Add your office IP: '123.45.67.89'
]

/**
 * Check if IP is whitelisted for admin access
 */
export function isIPWhitelisted(ip: string): boolean {
    // In development, allow all IPs
    if (process.env.NODE_ENV === 'development') {
        return true
    }

    return ALLOWED_ADMIN_IPS.includes(ip)
}

/**
 * Get client IP from request
 */
export function getClientIP(request: Request): string {
    const forwarded = request.headers.get('x-forwarded-for')
    const realIP = request.headers.get('x-real-ip')

    if (forwarded) {
        return forwarded.split(',')[0].trim()
    }

    if (realIP) {
        return realIP
    }

    return '127.0.0.1'
}

/**
 * Middleware to check IP whitelist for admin routes
 */
export async function checkAdminIPAccess(request: Request): Promise<boolean> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return false

    const userRole = user.user_metadata?.role

    // Only check IP for admin users
    if (userRole === 'admin') {
        const clientIP = getClientIP(request)
        return isIPWhitelisted(clientIP)
    }

    return true // Non-admin users don't need IP check
}
