'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const REQUIRED_DOCS = [
    { id: 'aadhar', label: 'Aadhar Card' },
    { id: 'pan', label: 'PAN Card' },
    { id: 'driving_license', label: 'Driving License' },
    { id: 'bank_passbook', label: 'Bank Passbook / Cancelled Cheque' },
    { id: 'photo', label: 'Profile Photo' }
]

export default function DocumentUploadPage() {
    const [uploading, setUploading] = useState<string | null>(null)
    const [uploadedDocs, setUploadedDocs] = useState<Record<string, boolean>>({})
    const [riderId, setRiderId] = useState<string | null>(null)
    const [submitting, setSubmitting] = useState(false)

    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        checkUser()
    }, [])

    const checkUser = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            router.push('/rider/register')
            return
        }

        const { data: rider } = await supabase
            .from('riders')
            .select('id')
            .eq('user_id', user.id)
            .single()

        if (rider) setRiderId(rider.id)
    }

    const handleUpload = async (docType: string, file: File) => {
        if (!riderId) return
        setUploading(docType)

        try {
            const fileExt = file.name.split('.').pop()
            const fileName = `${riderId}/${docType}.${fileExt}`
            const filePath = `${fileName}`

            // 1. Upload to Storage
            const { error: uploadError } = await supabase.storage
                .from('rider-documents')
                .upload(filePath, file, { upsert: true })

            if (uploadError) throw uploadError

            // 2. Get Public URL (or signed URL, but public is easier for now if bucket was public, but it's private so we store path)
            // Actually we store the path and generate signed URLs when viewing

            // 3. Create DB Record
            const { error: dbError } = await supabase
                .from('rider_documents')
                .insert({
                    rider_id: riderId,
                    document_type: docType,
                    document_url: filePath,
                    verification_status: 'pending'
                })

            if (dbError) throw dbError

            setUploadedDocs(prev => ({ ...prev, [docType]: true }))
        } catch (error: any) {
            console.error('Upload error:', error)
            alert('Error uploading document: ' + error.message)
        } finally {
            setUploading(null)
        }
    }

    const handleComplete = async () => {
        if (!riderId) return
        setSubmitting(true)

        try {
            // Update rider status
            const { error } = await supabase
                .from('riders')
                .update({ verification_status: 'pending' })
                .eq('id', riderId)

            if (error) throw error

            router.push('/rider/register/pending')
        } catch (error) {
            alert('Error completing registration')
        } finally {
            setSubmitting(false)
        }
    }

    const allUploaded = REQUIRED_DOCS.every(doc => uploadedDocs[doc.id])

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto space-y-8 bg-white p-8 rounded-xl shadow-lg">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900">Upload Documents</h2>
                    <p className="mt-2 text-sm text-gray-600">Please upload clear photos of the following documents</p>
                </div>

                <div className="space-y-6">
                    {REQUIRED_DOCS.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50">
                            <div>
                                <h3 className="font-medium text-gray-900">{doc.label}</h3>
                                {uploadedDocs[doc.id] && <span className="text-xs text-green-600 font-medium">✓ Uploaded</span>}
                            </div>

                            <div className="flex items-center gap-4">
                                <input
                                    type="file"
                                    id={`file-${doc.id}`}
                                    className="hidden"
                                    accept="image/*,.pdf"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0]
                                        if (file) handleUpload(doc.id, file)
                                    }}
                                    disabled={!!uploading}
                                />
                                <label
                                    htmlFor={`file-${doc.id}`}
                                    className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-medium transition-colors ${uploadedDocs[doc.id]
                                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    {uploading === doc.id ? 'Uploading...' : uploadedDocs[doc.id] ? 'Re-upload' : 'Upload'}
                                </label>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="pt-6 border-t border-gray-200">
                    <button
                        onClick={handleComplete}
                        disabled={!allUploaded || submitting}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {submitting ? 'Finalizing...' : 'Submit for Verification'}
                    </button>
                    {!allUploaded && (
                        <p className="text-center text-xs text-gray-500 mt-2">Please upload all required documents to proceed</p>
                    )}
                </div>
            </div>
        </div>
    )
}
