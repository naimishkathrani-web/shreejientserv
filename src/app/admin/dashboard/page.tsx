'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { logAuditAction } from '@/lib/audit'
import Link from 'next/link'

export default function AdminDashboard() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({
        totalRiders: 0,
        activeRiders: 0,
        pendingRiders: 0,
        todayOrders: 0,
        todayEarnings: 0,
        weekRevenue: 0
    })
    const [riders, setRiders] = useState<any[]>([])

    useEffect(() => {
        loadDashboard()
    }, [])

    async function loadDashboard() {
        const supabase = createClient()

        // Check admin auth
        const { data: { user } } = await supabase.auth.getUser()
        if (!user || user.user_metadata?.role !== 'admin') {
            router.push('/admin/login')
            return
        }

        // Load riders
        const { data: ridersData } = await supabase
            .from('riders')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(10)

        if (ridersData) setRiders(ridersData)

        // Load stats
        const { count: total } = await supabase.from('riders').select('*', { count: 'exact', head: true })
        const { count: active } = await supabase.from('riders').select('*', { count: 'exact', head: true }).eq('status', 'active')
        const { count: pending } = await supabase.from('riders').select('*', { count: 'exact', head: true }).eq('status', 'pending')

        // Today's stats
        const today = new Date().toISOString().split('T')[0]
        const { data: todayData } = await supabase
            .from('daily_transactions')
            .select('pidge_orders, final_payout')
            .eq('date', today)

        const todayOrders = todayData?.reduce((sum, t) => sum + (t.pidge_orders || 0), 0) || 0
        const todayEarnings = todayData?.reduce((sum, t) => sum + (t.final_payout || 0), 0) || 0

        setStats({
            totalRiders: total || 0,
            activeRiders: active || 0,
            pendingRiders: pending || 0,
            todayOrders,
            todayEarnings,
            weekRevenue: 0 // Calculate from vendor_weekly_summary
        })

        setLoading(false)
    }

    async function handleApproveRider(riderId: string) {
        const supabase = createClient()

        const { error } = await supabase
            .from('riders')
            .update({ status: 'active', onboarding_date: new Date().toISOString() })
            .eq('id', riderId)

        if (!error) {
            await logAuditAction({
                action: 'rider_approved',
                resourceType: 'rider',
                resourceId: riderId
            })
            loadDashboard()
        }
    }

    if (loading) {
        return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                            <img src="/images/logo.jpg" alt="Shreeji" className="h-10" />
                            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                        </div>
                        <button
                            onClick={async () => {
                                const supabase = createClient()
                                await supabase.auth.signOut()
                                router.push('/admin/login')
                            }}
                            className="text-gray-600 hover:text-gray-900"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-xl shadow p-6">
                        <p className="text-sm text-gray-600">Total Riders</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalRiders}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow p-6">
                        <p className="text-sm text-gray-600">Active Riders</p>
                        <p className="text-3xl font-bold text-green-600 mt-2">{stats.activeRiders}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow p-6">
                        <p className="text-sm text-gray-600">Today's Orders</p>
                        <p className="text-3xl font-bold text-purple-600 mt-2">{stats.todayOrders}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow p-6">
                        <p className="text-sm text-gray-600">Today's Earnings</p>
                        <p className="text-3xl font-bold text-blue-600 mt-2">₹{stats.todayEarnings.toFixed(0)}</p>
                    </div>
                </div>

                {/* Pending Approvals */}
                {stats.pendingRiders > 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                        <p className="text-yellow-800 font-medium">
                            ⚠️ {stats.pendingRiders} rider(s) pending approval
                        </p>
                    </div>
                )}

                {/* Quick Actions - Phase 2 */}
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        <Link href="/admin/agencies" className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow border border-gray-200">
                            <div className="flex flex-col items-center text-center gap-2">
                                <div className="bg-purple-100 p-3 rounded-lg">
                                    <span className="text-2xl">🏢</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 text-sm">Agencies</h3>
                                </div>
                            </div>
                        </Link>
                        <Link href="/admin/schemes" className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow border border-gray-200">
                            <div className="flex flex-col items-center text-center gap-2">
                                <div className="bg-blue-100 p-3 rounded-lg">
                                    <span className="text-2xl">📋</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 text-sm">Schemes</h3>
                                </div>
                            </div>
                        </Link>
                        <Link href="/admin/campaigns" className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow border border-gray-200">
                            <div className="flex flex-col items-center text-center gap-2">
                                <div className="bg-pink-100 p-3 rounded-lg">
                                    <span className="text-2xl">📢</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 text-sm">Campaigns</h3>
                                </div>
                            </div>
                        </Link>
                        <Link href="/admin/mdnd" className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow border border-gray-200">
                            <div className="flex flex-col items-center text-center gap-2">
                                <div className="bg-red-100 p-3 rounded-lg">
                                    <span className="text-2xl">⚠️</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 text-sm">MDND Cases</h3>
                                </div>
                            </div>
                        </Link>
                        <Link href="/admin/reconciliation" className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow border border-gray-200">
                            <div className="flex flex-col items-center text-center gap-2">
                                <div className="bg-yellow-100 p-3 rounded-lg">
                                    <span className="text-2xl">💰</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 text-sm">Reconciliation</h3>
                                </div>
                            </div>
                        </Link>
                        <Link href="/admin/mis-import" className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow border border-gray-200">
                            <div className="flex flex-col items-center text-center gap-2">
                                <div className="bg-green-100 p-3 rounded-lg">
                                    <span className="text-2xl">📊</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 text-sm">Import MIS</h3>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Recent Riders */}
                <div className="bg-white rounded-xl shadow">
                    <div className="p-6 border-b">
                        <h2 className="text-lg font-semibold text-gray-900">Recent Riders</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mobile</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {riders.map((rider) => (
                                    <tr key={rider.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {rider.first_name} {rider.last_name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {rider.mobile}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {rider.work_location || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${rider.status === 'active' ? 'bg-green-100 text-green-800' :
                                                rider.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-gray-100 text-gray-800'
                                                }`}>
                                                {rider.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {rider.status === 'pending' && (
                                                <button
                                                    onClick={() => handleApproveRider(rider.id)}
                                                    className="text-green-600 hover:text-green-900 font-medium"
                                                >
                                                    Approve
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    <Link href="/admin/mis-import" className="bg-white rounded-xl shadow p-6 text-center hover:shadow-lg transition-shadow block">
                        <span className="text-3xl mb-2 block">📊</span>
                        <span className="text-sm font-medium text-gray-700">MIS Import</span>
                    </Link>
                    <button className="bg-white rounded-xl shadow p-6 text-center hover:shadow-lg transition-shadow">
                        <span className="text-3xl mb-2 block">💰</span>
                        <span className="text-sm font-medium text-gray-700">Payments</span>
                    </button>
                    <button className="bg-white rounded-xl shadow p-6 text-center hover:shadow-lg transition-shadow">
                        <span className="text-3xl mb-2 block">⚙️</span>
                        <span className="text-sm font-medium text-gray-700">Settings</span>
                    </button>
                    <Link href="/admin/support" className="bg-white rounded-xl shadow p-6 text-center hover:shadow-lg transition-shadow block">
                        <span className="text-3xl mb-2 block">💬</span>
                        <span className="text-sm font-medium text-gray-700">Support</span>
                    </Link>
                </div>
            </div>
        </div>
    )
}
