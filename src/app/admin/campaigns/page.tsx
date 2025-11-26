'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

interface Campaign {
    id: string
    title: string
    description: string | null
    target_audience: string
    rule_config: any
    start_date: string
    end_date: string | null
    is_published: boolean
    created_at: string
}

export default function CampaignsPage() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        fetchCampaigns()
    }, [])

    const fetchCampaigns = async () => {
        try {
            const { data, error } = await supabase
                .from('referral_campaigns')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            setCampaigns(data || [])
        } catch (error) {
            console.error('Error fetching campaigns:', error)
        } finally {
            setLoading(false)
        }
    }

    const togglePublish = async (id: string, currentStatus: boolean) => {
        try {
            const { error } = await supabase
                .from('referral_campaigns')
                .update({ is_published: !currentStatus })
                .eq('id', id)

            if (error) throw error
            fetchCampaigns()
        } catch (error) {
            console.error('Error updating campaign:', error)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        )
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
                                <h1 className="text-2xl font-bold text-gray-900">Referral Campaigns</h1>
                                <p className="text-sm text-gray-500 mt-1">Create and manage referral bonus campaigns</p>
                            </div>
                        </div>
                        <Link
                            href="/admin/campaigns/new"
                            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                        >
                            <span>➕</span> Create Campaign
                        </Link>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <p className="text-sm font-medium text-gray-500">Total Campaigns</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">{campaigns.length}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <p className="text-sm font-medium text-gray-500">Published</p>
                        <p className="text-3xl font-bold text-green-600 mt-1">
                            {campaigns.filter(c => c.is_published).length}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <p className="text-sm font-medium text-gray-500">Draft</p>
                        <p className="text-3xl font-bold text-yellow-600 mt-1">
                            {campaigns.filter(c => !c.is_published).length}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <p className="text-sm font-medium text-gray-500">Active Now</p>
                        <p className="text-3xl font-bold text-blue-600 mt-1">
                            {campaigns.filter(c => {
                                const now = new Date()
                                const start = new Date(c.start_date)
                                const end = c.end_date ? new Date(c.end_date) : null
                                return c.is_published && start <= now && (!end || end >= now)
                            }).length}
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    {campaigns.map((campaign) => {
                        const now = new Date()
                        const start = new Date(campaign.start_date)
                        const end = campaign.end_date ? new Date(campaign.end_date) : null
                        const isActive = campaign.is_published && start <= now && (!end || end >= now)

                        return (
                            <div key={campaign.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-bold text-gray-900">{campaign.title}</h3>
                                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${isActive ? 'bg-green-100 text-green-800' :
                                                    campaign.is_published ? 'bg-blue-100 text-blue-800' :
                                                        'bg-gray-100 text-gray-800'
                                                }`}>
                                                {isActive ? 'ACTIVE' : campaign.is_published ? 'PUBLISHED' : 'DRAFT'}
                                            </span>
                                            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800 capitalize">
                                                {campaign.target_audience.replace('_', ' ')}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-3">{campaign.description || 'No description'}</p>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                            <div>
                                                <span className="text-gray-500">Start Date:</span>
                                                <p className="font-medium text-gray-900">{new Date(campaign.start_date).toLocaleDateString()}</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">End Date:</span>
                                                <p className="font-medium text-gray-900">{end ? end.toLocaleDateString() : 'No end date'}</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Bonus Type:</span>
                                                <p className="font-medium text-gray-900 capitalize">{campaign.rule_config?.type || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Amount:</span>
                                                <p className="font-medium text-gray-900">₹{campaign.rule_config?.amount || 0}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-3 pt-4 border-t border-gray-100">
                                    <Link
                                        href={`/admin/campaigns/${campaign.id}`}
                                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                                    >
                                        Edit Details
                                    </Link>
                                    <button
                                        onClick={() => togglePublish(campaign.id, campaign.is_published)}
                                        className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${campaign.is_published
                                                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                                            }`}
                                    >
                                        {campaign.is_published ? 'Unpublish' : 'Publish'}
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {campaigns.length === 0 && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                        <div className="text-6xl mb-4">📢</div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Campaigns Yet</h3>
                        <p className="text-gray-500 mb-6">Create your first referral campaign to incentivize growth</p>
                        <Link
                            href="/admin/campaigns/new"
                            className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                        >
                            Create First Campaign
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}
