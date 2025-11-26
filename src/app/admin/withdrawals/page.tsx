'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminWithdrawalsPage() {
    const [loading, setLoading] = useState(true)
    const [requests, setRequests] = useState<any[]>([])
    const [processingId, setProcessingId] = useState<string | null>(null)
    const [actionData, setActionData] = useState({ txnId: '', notes: '' })
    const [filter, setFilter] = useState('pending')

    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        loadRequests()
    }, [filter])

    const loadRequests = async () => {
        setLoading(true)
        try {
            let query = supabase
                .from('withdrawal_requests')
                .select(`
          *,
          riders (
            first_name,
            last_name,
            mobile,
            wallet_balance,
            bank_account_number,
            bank_ifsc
          )
        `)
                .order('requested_at', { ascending: false })

            if (filter !== 'all') {
                query = query.eq('status', filter)
            }

            const { data, error } = await query
            if (error) throw error
            setRequests(data || [])
        } catch (error) {
            console.error('Error loading requests:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleAction = async (id: string, action: 'approve' | 'reject') => {
        if (action === 'approve' && !actionData.txnId) {
            alert('Please enter Transaction ID for approval')
            return
        }
        if (action === 'reject' && !actionData.notes) {
            alert('Please enter reason for rejection')
            return
        }

        setProcessingId(id)
        try {
            const { data: { user } } = await supabase.auth.getUser()

            const updateData: any = {
                status: action === 'approve' ? 'completed' : 'rejected',
                processed_at: new Date().toISOString(),
                processed_by: user?.id,
                notes: actionData.notes
            }

            if (action === 'approve') {
                updateData.transaction_id = actionData.txnId
            } else {
                updateData.rejection_reason = actionData.notes
            }

            // 1. Update withdrawal request
            const { error: updateError } = await supabase
                .from('withdrawal_requests')
                .update(updateData)
                .eq('id', id)

            if (updateError) throw updateError

            // 2. If approved, deduct from rider wallet and log transaction
            if (action === 'approve') {
                const request = requests.find(r => r.id === id)

                // Deduct from wallet
                const { error: walletError } = await supabase.rpc('deduct_wallet_balance', {
                    p_rider_id: request.rider_id,
                    p_amount: request.amount
                })

                // Log transaction
                await supabase.from('financial_transactions').insert({
                    rider_id: request.rider_id,
                    transaction_type: 'withdrawal',
                    amount: -request.amount,
                    balance_before: request.riders.wallet_balance,
                    balance_after: request.riders.wallet_balance - request.amount,
                    description: `Withdrawal processed: ${actionData.txnId}`,
                    reference_id: id,
                    reference_type: 'withdrawal',
                    created_by: user?.id
                })
            }

            // Refresh list
            await loadRequests()
            setActionData({ txnId: '', notes: '' })
            setProcessingId(null)
        } catch (error: any) {
            alert('Error processing request: ' + error.message)
            setProcessingId(null)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Withdrawal Requests</h1>
                    <div className="flex gap-2">
                        {['pending', 'processing', 'completed', 'rejected', 'all'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${filter === f ? 'bg-purple-600 text-white' : 'bg-white text-gray-700 border border-gray-300'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rider</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bank Details</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr><td colSpan={5} className="px-6 py-8 text-center">Loading...</td></tr>
                            ) : requests.length === 0 ? (
                                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No requests found</td></tr>
                            ) : (
                                requests.map((req) => (
                                    <tr key={req.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">{req.riders?.first_name} {req.riders?.last_name}</div>
                                            <div className="text-sm text-gray-500">{req.riders?.mobile}</div>
                                            <div className="text-xs text-gray-400">Bal: ₹{req.riders?.wallet_balance}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold text-gray-900">₹{req.amount}</div>
                                            <div className="text-xs text-gray-500">{new Date(req.requested_at).toLocaleDateString()}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">{req.riders?.bank_account_number || 'N/A'}</div>
                                            <div className="text-xs text-gray-500">{req.riders?.bank_ifsc || 'N/A'}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${req.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                    req.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        req.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                {req.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {req.status === 'pending' || req.status === 'processing' ? (
                                                <div className="space-y-2">
                                                    <input
                                                        type="text"
                                                        placeholder="Transaction ID"
                                                        className="block w-full text-xs border-gray-300 rounded"
                                                        onChange={(e) => setActionData({ ...actionData, txnId: e.target.value })}
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="Notes / Rejection Reason"
                                                        className="block w-full text-xs border-gray-300 rounded"
                                                        onChange={(e) => setActionData({ ...actionData, notes: e.target.value })}
                                                    />
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleAction(req.id, 'approve')}
                                                            disabled={processingId === req.id}
                                                            className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handleAction(req.id, 'reject')}
                                                            disabled={processingId === req.id}
                                                            className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700"
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-sm text-gray-500">
                                                    {req.status === 'completed' ? `Txn: ${req.transaction_id}` : `Reason: ${req.rejection_reason}`}
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
