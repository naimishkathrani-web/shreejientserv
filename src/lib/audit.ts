import { createClient } from '@/lib/supabase/server'

export type AuditAction =
    | 'rider_created'
    | 'rider_updated'
    | 'rider_approved'
    | 'rider_suspended'
    | 'payment_processed'
    | 'payment_slab_updated'
    | 'mis_imported'
    | 'expense_added'
    | 'ticket_resolved'
    | 'admin_login'
    | 'admin_logout'

export interface AuditLog {
    id: string
    user_id: string
    user_email: string
    user_role: string
    action: AuditAction
    resource_type: string
    resource_id: string | null
    ip_address: string
    user_agent: string
    changes: any
    created_at: string
}

/**
 * Log admin action for audit trail
 */
export async function logAuditAction(params: {
    action: AuditAction
    resourceType: string
    resourceId?: string
    changes?: any
    request?: Request
}) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) return

        const ip = params.request ? getIPFromRequest(params.request) : '127.0.0.1'
        const userAgent = params.request?.headers.get('user-agent') || 'Unknown'

        await supabase.from('audit_logs').insert({
            user_id: user.id,
            user_email: user.email || '',
            user_role: user.user_metadata?.role || 'unknown',
            action: params.action,
            resource_type: params.resourceType,
            resource_id: params.resourceId || null,
            ip_address: ip,
            user_agent: userAgent,
            changes: params.changes || {}
        })
    } catch (error) {
        console.error('Audit log error:', error)
        // Don't throw - audit logging should not break the app
    }
}

/**
 * Get recent audit logs
 */
export async function getAuditLogs(filters?: {
    userId?: string
    action?: AuditAction
    resourceType?: string
    limit?: number
}) {
    const supabase = await createClient()

    let query = supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })

    if (filters?.userId) {
        query = query.eq('user_id', filters.userId)
    }

    if (filters?.action) {
        query = query.eq('action', filters.action)
    }

    if (filters?.resourceType) {
        query = query.eq('resource_type', filters.resourceType)
    }

    if (filters?.limit) {
        query = query.limit(filters.limit)
    }

    const { data, error } = await query

    if (error) {
        console.error('Audit log fetch error:', error)
        return []
    }

    return data as AuditLog[]
}

function getIPFromRequest(request: Request): string {
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
