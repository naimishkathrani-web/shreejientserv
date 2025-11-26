'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function AdminSupportPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [tickets, setTickets] = useState<any[]>([])
    const [filter, setFilter] = useState('all') // all, open, closed

    useEffect(() => {
        loadTickets()
    }, [])

    async function loadTickets() {
        const supabase = createClient()

        const { data } = await supabase
            .from('support_tickets')
            .select(`
        *,
        riders (
          first_name,
          last_name,
          mobile
        )
      `)
            .order('created_at', { ascending: false })

        if (data) setTickets(data)
        setLoading(false)
    }

    async function handleStatusChange(ticketId: string, newStatus: string) {
        const supabase = createClient()

        const { error } = await supabase
            .from('support_tickets')
            .update({ status: newStatus })
            .eq('id', ticketId)

        if (!error) {
            loadTickets()
        }
    }

    const filteredTickets = tickets.filter(t => {
        if (filter === 'all') return true
        return t.status === filter
    })

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
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/dashboard" className="text-gray-600 hover:text-gray-900">
                            ← Back
                        </Link>
                        <h1 className="text-xl font-bold text-gray-900">Support Tickets</h1>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-3 py-1 rounded-lg text-sm font-medium ${filter === 'all' ? 'bg-purple-100 text-purple-800' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setFilter('open')}
                            className={`px-3 py-1 rounded-lg text-sm font-medium ${filter === 'open' ? 'bg-green-100 text-green-800' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                            Open
                        </button>
                        <button
                            onClick={() => setFilter('closed')}
                            className={`px-3 py-1 rounded-lg text-sm font-medium ${filter === 'closed' ? 'bg-gray-100 text-gray-800' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                            Closed
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-6">
                <div className="grid gap-4">
                    {filteredTickets.map((ticket) => (
                        <div key={ticket.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg">{ticket.subject}</h3>
                                    <p className="text-sm text-gray-500">
                                        by {ticket.riders?.first_name} {ticket.riders?.last_name} ({ticket.riders?.mobile})
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${ticket.status === 'open' ? 'bg-green-100 text-green-800' :
                                            ticket.status === 'closed' ? 'bg-gray-100 text-gray-800' :
                                                'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {ticket.status.toUpperCase()}
                                    </span>
                                    <select
                                        value={ticket.status}
                                        onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                                        className="text-sm border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                                    >
                                        <option value="open">Mark Open</option>
                                        <option value="in_progress">Mark In Progress</option>
                                        <option value="closed">Mark Closed</option>
                                    </select>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                <p className="text-gray-700 whitespace-pre-wrap">{ticket.description}</p>
                            </div>

                            <div className="text-xs text-gray-400 flex justify-between items-center">
                                <span>Created: {new Date(ticket.created_at).toLocaleString()}</span>
                                <span>ID: {ticket.id}</span>
                            </div>
                        </div>
                    ))}

                    {filteredTickets.length === 0 && (
                        <div className="text-center py-12 text-gray-500 bg-white rounded-xl shadow-sm">
                            <p className="text-4xl mb-2">✅</p>
                            <p>No tickets found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
