'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function TransactionHistoryPage() {
    const [loading, setLoading] = useState(true)
    const [transactions, setTransactions] = useState<any[]>([])
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [summary, setSummary] = useState({ earnings: 0, withdrawals: 0, net: 0 })

    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        // Default to last 30 days
        const end = new Date()
        const start = new Date()
        start.setDate(start.getDate() - 30)

        setEndDate(end.toISOString().split('T')[0])
        setStartDate(start.toISOString().split('T')[0])
    }, [])

    useEffect(() => {
        if (startDate && endDate) {
            loadTransactions()
        }
    }, [startDate, endDate])

    const loadTransactions = async () => {
        setLoading(true)
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push('/rider/login')
                return
            }

            // Get rider ID
            const { data: rider } = await supabase
                .from('riders')
                .select('id')
                .eq('user_id', user.id)
                .single()

            if (rider) {
                // Fetch financial transactions
                const { data, error } = await supabase
                    .from('financial_transactions')
                    .select('*')
                    .eq('rider_id', rider.id)
                    .gte('created_at', `${startDate}T00:00:00`)
                    .lte('created_at', `${endDate}T23:59:59`)
                    .order('created_at', { ascending: false })

                if (error) throw error
                setTransactions(data || [])

                // Calculate summary
                const earnings = data?.filter(t => t.amount > 0).reduce((sum, t) => sum + Number(t.amount), 0) || 0
                const withdrawals = data?.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0) || 0
                setSummary({
                    earnings,
                    withdrawals,
                    net: earnings - withdrawals
                })
            }
        } catch (error) {
            console.error('Error loading transactions:', error)
        } finally {
            setLoading(false)
        }
    }

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'earning': return 'text-green-600'
            case 'withdrawal': return 'text-red-600'
            case 'penalty': return 'text-red-600'
            case 'bonus': return 'text-green-600'
            default: return 'text-gray-600'
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <Link href="/rider/dashboard" className="text-purple-600 hover:text-purple-700">← Back to Dashboard</Link>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">Transaction History</h1>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                        <div className="flex items-end">
                            <button
                                onClick={() => window.print()}
                                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center justify-center gap-2"
                            >
                                <span>🖨️</span> Print Report
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg mb-6">
                        <div className="text-center">
                            <p className="text-sm text-gray-500">Total Earnings</p>
                            <p className="text-xl font-bold text-green-600">+₹{summary.earnings}</p>
                        </div>
                        <div className="text-center border-l border-gray-200">
                            <p className="text-sm text-gray-500">Total Withdrawals</p>
                            <p className="text-xl font-bold text-red-600">-₹{summary.withdrawals}</p>
                        </div>
                        <div className="text-center border-l border-gray-200">
                            <p className="text-sm text-gray-500">Net Flow</p>
                            <p className={`text-xl font-bold ${summary.net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {summary.net >= 0 ? '+' : ''}₹{summary.net}
                            </p>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Balance</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {loading ? (
                                    <tr><td colSpan={5} className="px-6 py-8 text-center">Loading...</td></tr>
                                ) : transactions.length === 0 ? (
                                    <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No transactions found for selected period</td></tr>
                                ) : (
                                    transactions.map((t) => (
                                        <tr key={t.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(t.created_at).toLocaleDateString()}
                                                <div className="text-xs text-gray-400">{new Date(t.created_at).toLocaleTimeString()}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`text-sm font-medium capitalize ${getTypeColor(t.transaction_type)}`}>
                                                    {t.transaction_type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                {t.description}
                                            </td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold text-right ${t.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                {t.amount >= 0 ? '+' : ''}₹{t.amount}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                                                ₹{t.balance_after}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
