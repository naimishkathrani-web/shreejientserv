'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ReferralPage() {
    const [loading, setLoading] = useState(true)
    const [campaigns, setCampaigns] = useState<any[]>([])
    const [earnings, setEarnings] = useState<any[]>([])
    const [referredRiders, setReferredRiders] = useState<any[]>([])
    const [rider, setRider] = useState<any>(null)

    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push('/rider/login')
                return
            }

            const { data: riderData } = await supabase
                .from('riders')
                .select('id, first_name, mobile')
                .eq('user_id', user.id)
                .single()

            if (riderData) {
                setRider(riderData)

                // 1. Load Active Campaigns
                const { data: campaignsData } = await supabase
                    .from('referral_campaigns')
                    .select('*')
                    .eq('is_published', true)
                    .gte('end_date', new Date().toISOString().split('T')[0])
                    .or(`end_date.is.null`)

                setCampaigns(campaignsData || [])

                // 2. Load Earnings
                const { data: earningsData } = await supabase
                    .from('referral_earnings')
                    .select('*')
                    .eq('rider_id', riderData.id)
                    .order('earned_at', { ascending: false })

                setEarnings(earningsData || [])

                // 3. Load Referred Riders
                const { data: referredData } = await supabase
                    .from('riders')
                    .select('first_name, last_name, created_at, status')
                    .eq('referred_by_rider_id', riderData.id)
                    .order('created_at', { ascending: false })

                setReferredRiders(referredData || [])
            }
        } catch (error) {
            console.error('Error loading referral data:', error)
        } finally {
            setLoading(false)
        }
    }

    const totalEarnings = earnings.reduce((sum, e) => sum + Number(e.amount), 0)
    const referralLink = `https://shreejientserv.in/join?ref=${rider?.mobile}`

    const copyLink = () => {
        navigator.clipboard.writeText(referralLink)
        alert('Referral link copied!')
    }

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div></div>
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <Link href="/rider/dashboard" className="text-purple-600 hover:text-purple-700">← Back to Dashboard</Link>
                </div>

                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white shadow-lg mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Refer & Earn</h1>
                            <p className="text-purple-100">Invite friends and earn bonuses for every successful referral!</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 text-center min-w-[150px]">
                            <p className="text-sm text-purple-200 mb-1">Total Earned</p>
                            <p className="text-3xl font-bold">₹{totalEarnings}</p>
                        </div>
                    </div>

                    <div className="mt-8 bg-white/10 backdrop-blur-md rounded-lg p-4 flex items-center justify-between gap-4">
                        <code className="text-sm font-mono truncate flex-1">{referralLink}</code>
                        <button
                            onClick={copyLink}
                            className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-purple-50 transition-colors"
                        >
                            Copy Link
                        </button>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    {/* Active Campaigns */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Active Campaigns</h2>
                        {campaigns.length === 0 ? (
                            <p className="text-gray-500 text-sm">No active campaigns at the moment.</p>
                        ) : (
                            <div className="space-y-4">
                                {campaigns.map((c) => (
                                    <div key={c.id} className="border border-green-100 bg-green-50 rounded-lg p-4">
                                        <h3 className="font-semibold text-green-900">{c.title}</h3>
                                        <p className="text-sm text-green-700 mt-1">{c.description}</p>
                                        <div className="mt-3 flex items-center gap-2 text-sm font-medium text-green-800">
                                            <span>💰 Reward:</span>
                                            <span className="bg-white px-2 py-0.5 rounded text-green-600">
                                                ₹{c.rule_config?.amount}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Your Referrals */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Your Referrals</h2>
                        {referredRiders.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <p className="text-4xl mb-2">👥</p>
                                <p>No referrals yet</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {referredRiders.map((r, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div>
                                            <p className="font-medium text-gray-900">{r.first_name} {r.last_name}</p>
                                            <p className="text-xs text-gray-500">Joined: {new Date(r.created_at).toLocaleDateString()}</p>
                                        </div>
                                        <span className={`px-2 py-1 text-xs rounded-full ${r.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {r.status.toUpperCase()}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
