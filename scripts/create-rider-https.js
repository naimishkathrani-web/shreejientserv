const https = require('https')

const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRtcGhwcWRqcGJxZnNkdnlxbHRjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzE4MjA5MywiZXhwIjoyMDc4NzU4MDkzfQ.vPONcH4kpOxJdHqTNMQJQBTbpKMNJKFbqQUPKfPJRZE'
const baseUrl = 'dmphpqdjpbqfsdvyqltc.supabase.co'

function makeRequest(method, path, data = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: baseUrl,
            port: 443,
            path,
            method,
            headers: {
                'apikey': serviceRoleKey,
                'Authorization': `Bearer ${serviceRoleKey}`,
                'Content-Type': 'application/json'
            }
        }

        const req = https.request(options, (res) => {
            let responseData = ''
            res.on('data', (chunk) => { responseData += chunk })
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(JSON.parse(responseData || '{}'))
                } else {
                    reject(new Error(`HTTP ${res.statusCode}: ${responseData}`))
                }
            })
        })

        req.on('error', reject)
        if (data) req.write(JSON.stringify(data))
        req.end()
    })
}

async function createTestRider() {
    console.log('Creating test rider...\n')

    try {
        const mobile = '9920374755'
        const user = await makeRequest('POST', '/auth/v1/admin/users', {
            email: `${mobile}@rider.shreejientserv.in`,
            password: mobile,
            email_confirm: true,
            user_metadata: { role: 'rider' }
        })
        console.log('✓ Auth User:', user.id)

        const rider = await makeRequest('POST', '/rest/v1/riders?select=*', {
            user_id: user.id,
            first_name: 'Mahendra',
            last_name: 'Gupta',
            mobile,
            pidge_rider_id: 28536,
            pan_number: 'DWNPG2076L',
            aadhar_number: '455509200479',
            status: 'active',
            wallet_balance: 0
        })
        console.log('✓ Rider:', rider[0].id)

        console.log('\n✅ Test rider created!')
        console.log('\nLOGIN CREDENTIALS:')
        console.log(`Mobile: ${mobile}`)
        console.log(`Password: ${mobile}`)

    } catch (error) {
        console.error('❌ Error:', error.message)
    }
}

createTestRider()
