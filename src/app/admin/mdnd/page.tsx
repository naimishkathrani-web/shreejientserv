'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

interface MDNDCase {
    id: string
    date: string
    rider_id: string
    order_id: string
    penalty_amount: number
    status: string
    proof_url: string | null
    frozen_amount: number
    is_weekly_bonus_loss: boolean
    created_at: string
    riders?: {
        first_name: string
        last_name: string
        mobile: string
    }
}

export default function MDNDPage() {
    const [cases, setCases] = useState<MDNDCase[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all')
    const supabase = createClient()

    useEffect(() => {
        fetchCases()
    }, [filter])

    const fetchCases = async () => {
        try {
            let query = supabase
                .from('mdnd_cases')
                .select('*, riders(first_name, last_name, mobile)')
                .order('created_at', { ascending: false })

            if (filter !== 'all') {
                query = query.eq('status', filter)
            }

            const { data, error } = await query

            if (error) throw error
            setCases(data || [])
        } catch (error) {
            console.error('Error fetching MDND cases:', error)
        } finally {
            setLoading(false)
        }
    }

    const updateCaseStatus = async (id: string, newStatus: string) => {
        try {
            const { error } = await supabase
                .from('mdnd_cases')
                .update({ status: newStatus })
                .eq('id', id)

            if (error) throw error
            fetchCases()
        } catch (error) {
            console.error('Error updating case:', error)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        )
    }

    const stats = {
        total: cases.length,
        pending: cases.filter(c => c.status === 'pending').length,
        approved: cases.filter(c => c.status === 'approved').length,
        disputed: cases.filter(c => c.status === 'disputed').length,
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white border-b shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href="/admin/dashboard" className="text-gray-600 hover:text-gray-900">
                                ← Back
                            </Link>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">MDND Case Management</h1>
                                <p className="text-sm text-gray-500 mt-1">Material Damage, No Delivery cases</p>
                            </div>
                        </div>
                        <Link
                            href="/admin/mdnd/import"
                            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                        >
                            <span>📥</span> Import Cases
                        </Link>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <p className="text-sm font-medium text-gray-500">Total Cases</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <p className="text-sm font-medium text-gray-500">Pending Review</p>
                        <p className="text-3xl font-bold text-yellow-600 mt-1">{stats.pending}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <p className="text-sm font-medium text-gray-500">Approved</p>
                        <p className="text-3xl font-bold text-green-600 mt-1">{stats.approved}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <p className="text-sm font-medium text-gray-500">Disputed</p>
                        <p className="text-3xl font-bold text-red-600 mt-1">{stats.disputed}</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                    <div className="flex gap-2">
                        {['all', 'pending', 'approved', 'disputed', 'resolved'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === status
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rider</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Penalty</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frozen</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proof</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {cases.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                                        No MDND cases found
                                    </td>
                                </tr>
                            ) : (
                                cases.map((mdndCase) => (
                                    <tr key={mdndCase.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {new Date(mdndCase.date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {mdndCase.riders?.first_name} {mdndCase.riders?.last_name}
                                            </div>
                                            <div className="text-xs text-gray-500">{mdndCase.riders?.mobile}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{mdndCase.order_id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                                            ₹{mdndCase.penalty_amount}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-orange-600">
                                            ₹{mdndCase.frozen_amount}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${mdndCase.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                    mdndCase.status === 'disputed' ? 'bg-red-100 text-red-800' :
                                                        mdndCase.status === 'resolved' ? 'bg-blue-100 text-blue-800' :
                                                            'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {mdndCase.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {mdndCase.proof_url ? (
                                                <a href={mdndCase.proof_url} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-900">
                                                    View Proof
                                                </a>
                                            ) : (
                                                <span className="text-gray-400">No proof</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {mdndCase.status === 'pending' && (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => updateCaseStatus(mdndCase.id, 'approved')}
                                                        className="text-green-600 hover:text-green-900 font-medium"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => updateCaseStatus(mdndCase.id, 'disputed')}
                                                        className="text-red-600 hover:text-red-900 font-medium"
                                                    >
                                                        Dispute
                                                    </button>
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
