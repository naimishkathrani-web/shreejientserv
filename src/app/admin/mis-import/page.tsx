'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { parseMISFile } from '@/lib/mis-parser'
import Link from 'next/link'

export default function MISImportPage() {
    const router = useRouter()
    const [file, setFile] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<{ success: boolean; count: number; errors: string[] } | null>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
            setResult(null)
        }
    }

    const handleUpload = async () => {
        if (!file) return

        setLoading(true)
        try {
            const res = await parseMISFile(file)
            setResult(res)
        } catch (error: any) {
            setResult({ success: false, count: 0, errors: [error.message] })
        } finally {
            setLoading(false)
        }
    }

    const handleDownloadSample = () => {
        import('xlsx').then((XLSX) => {
            const headers = [
                {
                    'Rider ID': 'RIDER001',
                    'Orders': 15,
                    'Distance': 45.5,
                    'Earning': 450,
                    'Incentive': 50,
                    'Date': new Date().toISOString().split('T')[0]
                },
                {
                    'Rider ID': 'RIDER002',
                    'Orders': 22,
                    'Distance': 60.2,
                    'Earning': 600,
                    'Incentive': 100,
                    'Date': new Date().toISOString().split('T')[0]
                }
            ]

            const ws = XLSX.utils.json_to_sheet(headers)
            const wb = XLSX.utils.book_new()
            XLSX.utils.book_append_sheet(wb, ws, "Sample Data")
            XLSX.writeFile(wb, "pidge_mis_sample.xlsx")
        })
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b shadow-sm">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/dashboard" className="text-gray-600 hover:text-gray-900">
                            ← Back
                        </Link>
                        <h1 className="text-xl font-bold text-gray-900">Import MIS Report</h1>
                    </div>
                    <button
                        onClick={handleDownloadSample}
                        className="text-purple-600 text-sm font-medium hover:text-purple-700 flex items-center gap-2"
                    >
                        <span>📥</span> Download Template
                    </button>
                </div>
            </div>

            <div className="max-w-4xl mx-auto p-6">
                <div className="bg-white rounded-xl shadow p-8">
                    <div className="mb-8 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                            📊
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">Upload Pidge Daily Report</h2>
                        <p className="text-gray-500 text-sm mt-1">
                            Upload the Excel file (.xlsx) containing rider performance data.
                        </p>
                    </div>

                    <div className="max-w-md mx-auto space-y-6">
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-purple-500 transition-colors bg-gray-50">
                            <input
                                type="file"
                                accept=".xlsx, .xls"
                                onChange={handleFileChange}
                                className="hidden"
                                id="file-upload"
                            />
                            <label
                                htmlFor="file-upload"
                                className="cursor-pointer flex flex-col items-center"
                            >
                                <span className="text-4xl mb-2">📁</span>
                                <span className="text-sm font-medium text-gray-700">
                                    {file ? file.name : 'Click to select file'}
                                </span>
                                <span className="text-xs text-gray-500 mt-1">
                                    Supports .xlsx and .xls
                                </span>
                            </label>
                        </div>

                        <button
                            onClick={handleUpload}
                            disabled={!file || loading}
                            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? 'Processing...' : 'Upload & Process'}
                        </button>
                    </div>

                    {result && (
                        <div className={`mt-8 p-4 rounded-lg ${result.success ? 'bg-green-50' : 'bg-red-50'}`}>
                            <h3 className={`font-bold ${result.success ? 'text-green-800' : 'text-red-800'}`}>
                                {result.success ? 'Processing Complete' : 'Processing Failed'}
                            </h3>
                            <p className="text-sm mt-1">
                                Successfully processed: <strong>{result.count}</strong> records
                            </p>

                            {result.errors.length > 0 && (
                                <div className="mt-4">
                                    <p className="text-sm font-medium text-red-800 mb-2">Errors:</p>
                                    <ul className="list-disc list-inside text-sm text-red-700 space-y-1 max-h-40 overflow-y-auto">
                                        {result.errors.map((err, i) => (
                                            <li key={i}>{err}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <h3 className="font-bold text-blue-900 text-sm mb-2">How it works:</h3>
                    <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
                        <li>System matches records using <strong>Rider ID</strong> (Pidge ID).</li>
                        <li>Calculates earnings based on the <strong>Active Payment Slab</strong>.</li>
                        <li>Updates <strong>Daily Transactions</strong> automatically.</li>
                        <li>Final Payout is the higher of (Pidge Total) vs (Slab Amount).</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}
