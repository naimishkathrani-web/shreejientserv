export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            riders: {
                Row: Rider
                Insert: Omit<Rider, 'id' | 'created_at' | 'updated_at' | 'wallet_balance'>
                Update: Partial<Omit<Rider, 'id' | 'created_at' | 'updated_at' | 'wallet_balance'>>
            }
            agencies: {
                Row: Agency
                Insert: Omit<Agency, 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Omit<Agency, 'id' | 'created_at' | 'updated_at'>>
            }
            schemes: {
                Row: Scheme
                Insert: Omit<Scheme, 'id' | 'created_at'>
                Update: Partial<Omit<Scheme, 'id' | 'created_at'>>
            }
            referral_campaigns: {
                Row: ReferralCampaign
                Insert: Omit<ReferralCampaign, 'id' | 'created_at'>
                Update: Partial<Omit<ReferralCampaign, 'id' | 'created_at'>>
            }
            referral_earnings: {
                Row: ReferralEarning
                Insert: Omit<ReferralEarning, 'id' | 'earned_at'>
                Update: Partial<Omit<ReferralEarning, 'id' | 'earned_at'>>
            }
            daily_transactions: {
                Row: DailyTransaction
                Insert: Omit<DailyTransaction, 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Omit<DailyTransaction, 'id' | 'created_at' | 'updated_at'>>
            }
            weekly_summary: {
                Row: WeeklySummary
                Insert: Omit<WeeklySummary, 'id' | 'created_at'>
                Update: Partial<Omit<WeeklySummary, 'id' | 'created_at'>>
            }
            vendor_weekly_summary: {
                Row: VendorWeeklySummary
                Insert: Omit<VendorWeeklySummary, 'id' | 'created_at'>
                Update: Partial<Omit<VendorWeeklySummary, 'id' | 'created_at'>>
            }
            payouts: {
                Row: Payout
                Insert: Omit<Payout, 'id' | 'created_at'>
                Update: Partial<Omit<Payout, 'id' | 'created_at'>>
            }
            mdnd_cases: {
                Row: MDNDCase
                Insert: Omit<MDNDCase, 'id' | 'created_at'>
                Update: Partial<Omit<MDNDCase, 'id' | 'created_at'>>
            }
            expenses: {
                Row: Expense
                Insert: Omit<Expense, 'id' | 'created_at'>
                Update: Partial<Omit<Expense, 'id' | 'created_at'>>
            }
            support_tickets: {
                Row: SupportTicket
                Insert: Omit<SupportTicket, 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Omit<SupportTicket, 'id' | 'created_at' | 'updated_at'>>
            }
            audit_logs: {
                Row: AuditLog
                Insert: Omit<AuditLog, 'id' | 'created_at'>
                Update: Partial<Omit<AuditLog, 'id' | 'created_at'>>
            }
        }
    }
}

export interface Rider {
    id: string
    user_id: string | null
    mobile: string
    email?: string | null
    first_name: string
    last_name: string
    date_of_birth?: string | null
    parent_name?: string | null
    parent_mobile?: string | null
    aadhar_number?: string | null
    pan_number?: string | null
    license_number?: string | null
    permanent_address?: string | null
    current_address?: string | null
    work_location?: string | null
    vehicle_type?: string | null
    vehicle_number?: string | null
    pidge_rider_id?: string | null
    bank_account_number?: string | null
    bank_ifsc?: string | null
    bank_name?: string | null
    account_holder_name?: string | null
    wallet_balance: number
    status: 'pending' | 'active' | 'inactive' | 'suspended'
    onboarding_date?: string | null
    last_active_date?: string | null
    created_at: string
    updated_at: string
    created_by?: string | null
    // Phase 2 Updates
    agency_id?: string | null
    current_scheme_id?: string | null
    referred_by_rider_id?: string | null
    city?: string | null
    hub?: string | null
    frozen_balance: number
}

export interface Agency {
    id: string
    user_id: string
    name: string
    contact_person?: string | null
    mobile: string
    email?: string | null
    bank_account_number?: string | null
    bank_ifsc?: string | null
    bank_name?: string | null
    status: 'active' | 'inactive'
    created_at: string
    updated_at: string
}

export interface Scheme {
    id: string
    name: string
    description?: string | null
    vendor_fee_type: 'percentage' | 'fixed'
    vendor_fee_value: number
    rider_payout_config: Json
    is_active: boolean
    created_at: string
}

export interface ReferralCampaign {
    id: string
    title: string
    description?: string | null
    target_audience: 'all' | 'agency_only' | 'rider_only'
    rule_config: Json
    start_date: string
    end_date?: string | null
    is_published: boolean
    created_at: string
}

export interface ReferralEarning {
    id: string
    campaign_id?: string | null
    agency_id?: string | null
    rider_id?: string | null
    referred_rider_id?: string | null
    amount: number
    status: 'pending' | 'paid' | 'cancelled'
    earned_at: string
    paid_at?: string | null
}

export interface RiderDocument {
    id: string
    rider_id: string
    document_type: 'aadhar' | 'pan' | 'license' | 'rc' | 'insurance' | 'puc' | 'photo'
    file_url: string
    file_name?: string | null
    file_size?: number | null
    verified: boolean
    verified_by?: string | null
    verified_at?: string | null
    uploaded_at: string
}

export interface RiderContract {
    id: string
    rider_id: string
    contract_type: 'new' | 'existing'
    acceptance_date: string
    signed_location?: string | null
    status: 'pending' | 'approved' | 'rejected'
    approved_by?: string | null
    approved_at?: string | null
    rejection_reason?: string | null
    created_at: string
}

export interface PaymentSlab {
    id: string
    name: string
    description?: string | null
    active: boolean
    start_date: string
    end_date?: string | null
    created_by?: string | null
    created_at: string
}

export interface SlabRule {
    id: string
    slab_id: string
    min_orders: number
    max_orders?: number | null
    guaranteed_amount: number
    priority: number
}

export interface DailyTransaction {
    id: string
    date: string
    rider_id: string
    pidge_orders: number
    pidge_distance_km: number
    pidge_login_hours: number
    pidge_daily_earning: number
    pidge_daily_incentive: number
    pidge_total: number
    mdnd_orders: number
    mdnd_earning: number
    applied_slab_id?: string | null
    slab_amount?: number | null
    final_payout: number
    payout_source?: string | null
    wallet_credited: boolean
    wallet_credited_at?: string | null
    created_at: string
    updated_at: string
}

export interface WeeklySummary {
    id: string
    week_start: string
    week_end: string
    rider_id: string
    working_days: number
    worked_thursday: boolean
    worked_friday: boolean
    worked_saturday: boolean
    worked_sunday: boolean
    total_orders: number
    total_distance_km: number
    base_payout: number
    daily_incentive: number
    eligible_for_weekly_bonus: boolean
    weekly_bonus_amount: number
    total_penalties: number
    final_amount: number
    mis_imported: boolean
    mis_imported_at?: string | null
    created_at: string
}

export interface VendorWeeklySummary {
    id: string
    week_start: string
    week_end: string
    total_working_days: number
    total_orders: number
    base_payout: number
    daily_incentive: number
    total_amount: number
    management_fees: number
    management_fees_percentage: number
    weekly_incentive: number
    penalties: number
    pending_amount: number
    monthly_incentive: number
    vendor_referal_bonus: number
    final_payout: number
    invoice_number?: string | null
    invoice_date?: string | null
    invoice_url?: string | null
    payment_received: boolean
    payment_received_date?: string | null
    payment_amount?: number | null
    mis_imported: boolean
    mis_imported_at?: string | null
    created_at: string
}

export interface Payout {
    id: string
    rider_id: string
    transaction_type: 'credit' | 'debit' | 'withdrawal'
    amount: number
    source_type?: string | null
    source_id?: string | null
    bank_transfer_initiated: boolean
    bank_transfer_id?: string | null
    bank_transfer_status?: 'pending' | 'success' | 'failed' | null
    bank_transfer_at?: string | null
    balance_before?: number | null
    balance_after?: number | null
    notes?: string | null
    created_at: string
    riders?: Rider // Joined
}

export interface MDNDCase {
    id: string
    date: string
    rider_id: string
    order_id?: string | null
    penalty_amount: number
    status: 'pending' | 'deducted' | 'disputed' | 'resolved'
    deducted_from_wallet: boolean
    deducted_at?: string | null
    dispute_raised: boolean
    dispute_notes?: string | null
    resolution_notes?: string | null
    resolved_at?: string | null
    created_at: string
    // Phase 2 Updates
    proof_url?: string | null
    frozen_amount: number
    is_weekly_bonus_loss: boolean
}

export interface Expense {
    id: string
    date: string
    category: string
    description?: string | null
    amount: number
    vendor_name?: string | null
    invoice_number?: string | null
    invoice_url?: string | null
    payment_status: 'pending' | 'paid'
    payment_date?: string | null
    payment_mode?: string | null
    created_by?: string | null
    created_at: string
}

export interface SupportTicket {
    id: string
    rider_id: string
    subject: string
    description: string
    category?: string | null
    priority: 'low' | 'medium' | 'high' | 'urgent'
    status: 'open' | 'in_progress' | 'resolved' | 'closed'
    assigned_to?: string | null
    resolved_by?: string | null
    resolved_at?: string | null
    resolution_notes?: string | null
    created_at: string
    updated_at: string
    riders?: Rider // Joined
}

export interface AuditLog {
    id: string
    user_id: string
    action: string
    resource_type: string
    resource_id?: string | null
    details?: any
    ip_address?: string | null
    user_agent?: string | null
    created_at: string
}
