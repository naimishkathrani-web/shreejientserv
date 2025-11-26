'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

interface ReconciliationData {
    rider_id: string
    rider_name: string
    rider_mobile: string
    total_transactions: number
    total_pidge_amount: number
    total_slab_amount: number
    total_final_payout: number
    variance: number
}

export default function ReconciliationPage() {
    const [data, setData] = useState<ReconciliationData[]>([])
    const [loading, setLoading] = useState(true)
    const [dateRange, setDateRange] = useState({
        start: '',
        end: '',
    })
    const supabase = createClient()

    useEffect(() => {
        if (dateRange.start && dateRange.end) {
            fetchReconciliation()
        }
    }, [dateRange])

    const fetchReconciliation = async () => {
        setLoading(true)
        try {
            const { data: transactions, error } = await supabase
                .from('daily_transactions')
                .select(`
          *,
          riders(first_name, last_name, mobile)
        `)
                .gte('date', dateRange.start)
                .lte('date', dateRange.end)

            if (error) throw error

            // Group by rider
            const grouped = transactions?.reduce((acc: any, txn: any) => {
                const riderId = txn.rider_id
                if (!acc[riderId]) {
                    acc[riderId] = {
                        rider_id: riderId,
                        rider_name: `${txn.riders?.first_name} ${txn.riders?.last_name}`,
                        rider_mobile: txn.riders?.mobile,
                        total_transactions: 0,
                        total_pidge_amount: 0,
                        total_slab_amount: 0,
                        total_final_payout: 0,
                        variance: 0,
                    }
                }
                acc[riderId].total_transactions += 1
                acc[riderId].total_pidge_amount += txn.pidge_total || 0
                acc[riderId].total_slab_amount += txn.slab_amount || 0
                acc[riderId].total_final_payout += txn.final_payout || 0
                return acc
            }, {})

            const reconciliationData = Object.values(grouped || {}).map((item: any) => ({
                ...item,
                variance: item.total_final_payout - item.total_pidge_amount,
            }))

            setData(reconciliationData as ReconciliationData[])
        } catch (error) {
            console.error('Error fetching reconciliation:', error)
        } finally {
            setLoading(false)
        }
    }

    const totals = data.reduce(
        (acc, row) => ({
            pidge: acc.pidge + row.total_pidge_amount,
            slab: acc.slab + row.total_slab_amount,
            payout: acc.payout + row.total_final_payout,
            variance: acc.variance + row.variance,
        }),
        { pidge: 0, slab: 0, payout: 0, variance: 0 }
    )

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white border-b shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/dashboard" className="text-gray-600 hover:text-gray-900">
                            ← Back
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Reconciliation Report</h1>
                            <p className="text-sm text-gray-500 mt-1">Compare paid vs eligible amounts</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Date Range</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                            <input
                                type="date"
                                value={dateRange.start}
                                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                            <input
                                type="date"
                                value={dateRange.end}
                                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                    </div>
                </div>

                {dateRange.start && dateRange.end && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                <p className="text-sm font-medium text-gray-500">Total Pidge Amount</p>
                                <p className="text-3xl font-bold text-blue-600 mt-1">₹{totals.pidge.toFixed(2)}</p>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                <p className="text-sm font-medium text-gray-500">Total Slab Amount</p>
                                <p className="text-3xl font-bold text-purple-600 mt-1">₹{totals.slab.toFixed(2)}</p>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                <p className="text-sm font-medium text-gray-500">Total Final Payout</p>
                                <p className="text-3xl font-bold text-green-600 mt-1">₹{totals.payout.toFixed(2)}</p>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                <p className="text-sm font-medium text-gray-500">Total Variance</p>
                                <p className={`text-3xl font-bold mt-1 ${totals.variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    ₹{totals.variance.toFixed(2)}
                                </p>
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rider</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transactions</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pidge Total</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slab Amount</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Final Payout</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variance</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {data.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                                    No data for selected date range
                                                </td>
                                            </tr>
                                        ) : (
                                            data.map((row) => (
                                                <tr key={row.rider_id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">{row.rider_name}</div>
                                                        <div className="text-xs text-gray-500">{row.rider_mobile}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.total_transactions}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                                                        ₹{row.total_pidge_amount.toFixed(2)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-purple-600">
                                                        ₹{row.total_slab_amount.toFixed(2)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                                                        ₹{row.total_final_payout.toFixed(2)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <span className={row.variance >= 0 ? 'text-green-600' : 'text-red-600'}>
                                                            ₹{row.variance.toFixed(2)}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
