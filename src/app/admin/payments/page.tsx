'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { logAuditAction } from '@/lib/audit'

export default function PaymentsPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [payouts, setPayouts] = useState<any[]>([])

    useEffect(() => {
        loadPayments()
    }, [])

    async function loadPayments() {
        const supabase = createClient()

        const { data } = await supabase
            .from('payouts')
            .select(`
        *,
        riders (
          first_name,
          last_name,
          mobile,
          bank_account_no,
          ifsc_code
        )
      `)
            .order('created_at', { ascending: false })

        if (data) setPayouts(data)
        setLoading(false)
    }

    async function handleMarkPaid(payoutId: string) {
        const supabase = createClient()

        const { error } = await supabase
            .from('payouts')
            .update({
                bank_transfer_status: 'completed',
                processed_at: new Date().toISOString()
            })
            .eq('id', payoutId)

        if (!error) {
            await logAuditAction({
                action: 'payout_processed',
                resourceType: 'payout',
                resourceId: payoutId
            })
            loadPayments()
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
                    <Link href="/admin/dashboard" className="text-gray-600 hover:text-gray-900">
                        ← Back
                    </Link>
                    <h1 className="text-xl font-bold text-gray-900">Payment Management</h1>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-6">
                <div className="bg-white rounded-xl shadow overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-900">Withdrawal Requests</h2>
                        <button
                            onClick={() => loadPayments()}
                            className="text-purple-600 text-sm font-medium hover:text-purple-700"
                        >
                            Refresh
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rider</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bank Details</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {payouts.map((payout) => (
                                    <tr key={payout.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(payout.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {payout.riders?.first_name} {payout.riders?.last_name}
                                            </div>
                                            <div className="text-xs text-gray-500">{payout.riders?.mobile}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                            ₹{payout.amount}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div className="flex flex-col">
                                                <span>Acc: {payout.riders?.bank_account_no ? '••••' + payout.riders.bank_account_no.slice(-4) : '-'}</span>
                                                <span className="text-xs">IFSC: {payout.riders?.ifsc_code || '-'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${payout.bank_transfer_status === 'completed' ? 'bg-green-100 text-green-800' :
                                                    payout.bank_transfer_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'
                                                }`}>
                                                {payout.bank_transfer_status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {payout.bank_transfer_status === 'pending' && (
                                                <button
                                                    onClick={() => handleMarkPaid(payout.id)}
                                                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-xs font-medium transition-colors"
                                                >
                                                    Mark Paid
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {payouts.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                            No payment requests found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
