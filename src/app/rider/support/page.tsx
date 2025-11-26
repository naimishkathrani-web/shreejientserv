'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function RiderSupportPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [tickets, setTickets] = useState<any[]>([])
    const [showNewTicket, setShowNewTicket] = useState(false)
    const [subject, setSubject] = useState('')
    const [message, setMessage] = useState('')

    useEffect(() => {
        loadTickets()
    }, [])

    async function loadTickets() {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            router.push('/rider/login')
            return
        }

        const { data } = await supabase
            .from('support_tickets')
            .select('*')
            .eq('rider_id', user.user_metadata.rider_id) // Assuming we store rider_id in metadata or fetch it
        // Actually, we should fetch rider first or join. 
        // Let's just use user_id if possible, but schema uses rider_id.
        // We need to fetch rider first.

        // Fetch rider id
        const { data: rider } = await supabase
            .from('riders')
            .select('id')
            .eq('user_id', user.id)
            .single()

        if (rider) {
            const { data: ticketsData } = await supabase
                .from('support_tickets')
                .select('*')
                .eq('rider_id', rider.id)
                .order('created_at', { ascending: false })

            if (ticketsData) setTickets(ticketsData)
        }

        setLoading(false)
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)

        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) return

        const { data: rider } = await supabase
            .from('riders')
            .select('id')
            .eq('user_id', user.id)
            .single()

        if (rider) {
            const { error } = await supabase
                .from('support_tickets')
                .insert({
                    rider_id: rider.id,
                    subject,
                    description: message,
                    status: 'open',
                    priority: 'medium'
                })

            if (!error) {
                setSubject('')
                setMessage('')
                setShowNewTicket(false)
                loadTickets()
            }
        }
        setLoading(false)
    }

    if (loading && !tickets.length) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/rider/dashboard" className="text-gray-600 hover:text-gray-900">
                            ← Back
                        </Link>
                        <h1 className="text-lg font-bold text-gray-900">Support</h1>
                    </div>
                    <button
                        onClick={() => setShowNewTicket(true)}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700"
                    >
                        + New Ticket
                    </button>
                </div>
            </div>

            <div className="max-w-md mx-auto p-4 space-y-4">
                {showNewTicket && (
                    <div className="bg-white rounded-xl shadow-sm p-4 mb-4 border border-purple-100">
                        <h2 className="font-bold text-gray-900 mb-4">Create New Ticket</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                                <input
                                    type="text"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 h-32"
                                    required
                                ></textarea>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowNewTicket(false)}
                                    className="flex-1 py-2 border border-gray-300 rounded-lg text-gray-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 py-2 bg-purple-600 text-white rounded-lg font-medium"
                                >
                                    {loading ? 'Sending...' : 'Submit Ticket'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="space-y-4">
                    {tickets.map((ticket) => (
                        <div key={ticket.id} className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-gray-900">{ticket.subject}</h3>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${ticket.status === 'open' ? 'bg-green-100 text-green-800' :
                                        ticket.status === 'closed' ? 'bg-gray-100 text-gray-800' :
                                            'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {ticket.status.toUpperCase()}
                                </span>
                            </div>
                            <p className="text-gray-600 text-sm mb-3">{ticket.description}</p>
                            <div className="text-xs text-gray-400">
                                {new Date(ticket.created_at).toLocaleDateString()}
                            </div>
                        </div>
                    ))}

                    {tickets.length === 0 && !showNewTicket && (
                        <div className="text-center py-12 text-gray-500">
                            <p className="text-4xl mb-2">💬</p>
                            <p>No support tickets yet</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
