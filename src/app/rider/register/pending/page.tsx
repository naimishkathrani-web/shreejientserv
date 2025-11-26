import Link from 'next/link'

export default function PendingApprovalPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl">⏳</span>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">Verification Pending</h2>

                <p className="text-gray-600 mb-8">
                    Thank you for submitting your documents! Our team is currently reviewing your application.
                    This process usually takes 24-48 hours.
                </p>

                <div className="bg-blue-50 p-4 rounded-lg text-left mb-8">
                    <h3 className="font-semibold text-blue-900 mb-2">What happens next?</h3>
                    <ul className="text-sm text-blue-800 space-y-2 list-disc list-inside">
                        <li>Admin reviews your documents</li>
                        <li>You receive an SMS/Email upon approval</li>
                        <li>Once approved, you can log in and start earning!</li>
                    </ul>
                </div>

                <Link
                    href="/"
                    className="block w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                    Return to Home
                </Link>
            </div>
        </div>
    )
}
