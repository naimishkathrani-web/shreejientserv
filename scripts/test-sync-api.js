// Test script for Pidge sync API
// Add CRON_SECRET=test-secret-123 to your .env.local

const testSyncAPI = async () => {
    try {
        console.log('🧪 Testing Pidge Sync API...\n')

        const response = await fetch('http://localhost:3000/api/cron/sync-pidge-data', {
            headers: {
                'Authorization': 'Bearer test-secret-123'
            }
        })

        const data = await response.json()

        if (response.ok) {
            console.log('✅ API Response:', JSON.stringify(data, null, 2))
        } else {
            console.log('❌ API Error:', data)
            console.log('\n💡 Make sure to add to .env.local:')
            console.log('   CRON_SECRET=test-secret-123')
            console.log('   PIDGE_EMAIL=naimish@shreejientserv.in')
            console.log('   PIDGE_PASSWORD=Shreeji@2024')
        }
    } catch (error) {
        console.error('❌ Test failed:', error.message)
    }
}

testSyncAPI()
