'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Rider, DailyTransaction } from '@/types/database'
import Link from 'next/link'

export default function RiderDashboard() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [rider, setRider] = useState<Rider | null>(null)
    const [todayEarnings, setTodayEarnings] = useState<DailyTransaction | null>(null)
    const [weekEarnings, setWeekEarnings] = useState(0)
    const [last7Days, setLast7Days] = useState<DailyTransaction[]>([])
    const [showProfile, setShowProfile] = useState(false)
    const [referralCode, setReferralCode] = useState('')
    const [showReferralModal, setShowReferralModal] = useState(false)
    const [friendMobile, setFriendMobile] = useState('')

    useEffect(() => {
        loadDashboard()
    }, [])

    async function loadDashboard() {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            router.push('/rider/login')
            return
        }

        const { data: riderData } = await supabase
            .from('riders')
            .select('*')
            .eq('user_id', user.id)
            .single()

        if (riderData) {
            setRider(riderData)
            setReferralCode(`REF${riderData.id.substring(0, 8).toUpperCase()}`)
        }

        const today = new Date().toISOString().split('T')[0]
        const { data: todayData } = await supabase
            .from('daily_transactions')
            .select('*')
            .eq('rider_id', riderData?.id)
            .eq('date', today)
            .single()

        setTodayEarnings(todayData)

        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        const { data: weekData } = await supabase
            .from('daily_transactions')
            .select('*')
            .eq('rider_id', riderData?.id)
            .gte('date', weekAgo.toISOString().split('T')[0])
            .order('date', { ascending: false })

        setLast7Days(weekData || [])
        const total = weekData?.reduce((sum, d) => sum + (d.final_payout || 0), 0) || 0
        setWeekEarnings(total)
        setLoading(false)
    }

    async function handleLogout() {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push('/rider/login')
    }

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div></div>
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-6 rounded-b-3xl shadow-lg">
                <div className="max-w-4xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-2xl font-bold">Hi, {rider?.first_name}! 👋</h1>
                            <p className="text-purple-200 text-sm mt-1">Rider ID: {rider?.pidge_rider_id || 'Pending'}</p>
                        </div>
                        <div className="relative">
                            <button onClick={() => setShowProfile(!showProfile)} className="bg-white/20 hover:bg-white/30 w-10 h-10 rounded-full flex items-center justify-center">
                                <span className="text-lg">👤</span>
                            </button>
                            {showProfile && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10">
                                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100">Logout</button>
                                </div>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={() => setShowReferralModal(true)}
                        className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 mb-4 hover:bg-white/20 transition-colors text-left"
                    >
                        <p className="text-sm font-medium">🎁 Refer a Friend</p>
                        <p className="text-xs text-purple-200 mt-1">Earn rewards when they join!</p>
                    </button>

                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-white">
                        <h2 className="text-sm font-medium text-purple-100 mb-3">Wallet Balance</h2>
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-xs text-purple-200">Available</p>
                                <p className="text-3xl font-bold">₹{((rider?.wallet_balance || 0) - (rider?.frozen_balance || 0)).toFixed(2)}</p>
                            </div>
                            <Link href="/rider/withdrawals" className="bg-white text-purple-700 px-5 py-2 rounded-lg font-semibold hover:bg-purple-50 text-sm">Withdraw</Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto p-4 space-y-6 -mt-4">
                <div className="bg-white rounded-2xl shadow-sm border p-6">
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <span className="bg-purple-100 text-purple-600 p-2 rounded-lg">📅</span>
                        Today's Earnings
                    </h2>
                    {todayEarnings ? (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-3 rounded-xl">
                                    <p className="text-xs text-gray-500 mb-1">Orders</p>
                                    <p className="text-xl font-bold">{todayEarnings.pidge_orders || 0}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-xl">
                                    <p className="text-xs text-gray-500 mb-1">Distance</p>
                                    <p className="text-xl font-bold">{todayEarnings.pidge_distance_km || 0} km</p>
                                </div>
                            </div>
                            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 border">
                                <div className="flex justify-between items-center">
                                    <span className="text-purple-900 font-medium">Total Paid</span>
                                    <span className="text-3xl font-bold text-purple-700">₹{todayEarnings.final_payout || 0}</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8 bg-gray-50 rounded-xl">
                            <p className="text-4xl mb-2">🛵</p>
                            <p className="text-gray-500 font-medium">No deliveries yet today</p>
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-2xl shadow-sm border p-6 flex justify-between items-center">
                    <div>
                        <p className="text-sm text-gray-500 mb-1">This Week's Earnings</p>
                        <p className="text-3xl font-bold">₹{weekEarnings.toFixed(2)}</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-xl"><span className="text-3xl">📈</span></div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border p-6">
                    <h3 className="font-bold mb-4">Last 7 Days Performance</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Date</th>
                                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Orders</th>
                                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Distance</th>
                                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Earnings</th>
                                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Payout</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {last7Days.length > 0 ? last7Days.map((day) => (
                                    <tr key={day.date} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm">{new Date(day.date).toLocaleDateString()}</td>
                                        <td className="px-4 py-3 text-sm text-right">{day.pidge_orders || 0}</td>
                                        <td className="px-4 py-3 text-sm text-right">{day.pidge_distance_km || 0} km</td>
                                        <td className="px-4 py-3 text-sm text-right">₹{day.pidge_daily_earning || 0}</td>
                                        <td className="px-4 py-3 text-sm text-right font-semibold text-purple-600">₹{day.final_payout || 0}</td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-500">No data for last 7 days</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <h3 className="font-bold px-1">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-4">
                    <Link href="/rider/history" className="bg-white p-4 rounded-2xl shadow-sm border hover:shadow-md flex flex-col items-center gap-2">
                        <span className="text-3xl bg-blue-50 p-3 rounded-full">📊</span>
                        <span className="font-medium text-gray-700">History</span>
                    </Link>
                    <Link href="/rider/withdrawals" className="bg-white p-4 rounded-2xl shadow-sm border hover:shadow-md flex flex-col items-center gap-2">
                        <span className="text-3xl bg-purple-50 p-3 rounded-full">💸</span>
                        <span className="font-medium text-gray-700">Withdrawals</span>
                    </Link>
                </div>
            </div>

            {showReferralModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowReferralModal(false)}>
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-xl font-bold mb-4">Refer a Friend</h3>
                        <p className="text-sm text-gray-600 mb-4">Enter your friend's mobile number to send them a referral link via WhatsApp</p>

                        <input
                            type="tel"
                            placeholder="Friend's 10-digit mobile"
                            value={friendMobile}
                            onChange={(e) => setFriendMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 text-lg"
                            maxLength={10}
                        />

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowReferralModal(false)}
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    if (friendMobile.length === 10) {
                                        const link = `${window.location.origin}/rider/register?ref=${referralCode}`
                                        const msg = `Join Shreeji Enterprise Services as a delivery rider! Register here: ${link}`
                                        window.open(`https://wa.me/91${friendMobile}?text=${encodeURIComponent(msg)}`, '_blank')
                                        setShowReferralModal(false)
                                        setFriendMobile('')
                                    }
                                }}
                                disabled={friendMobile.length !== 10}
                                className="flex-1 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold"
                            >
                                📱 Send via WhatsApp
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
