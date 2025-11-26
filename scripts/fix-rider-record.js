const https = require('https')

const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InludWlpdGdzbXVkZ3hhb2x2aGhqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzkyNjMzOSwiZXhwIjoyMDc5NTAyMzM5fQ.6AujsS61AlHE548_AuK_I-2r40j8T2fP8W2bmcgT-80'
const baseUrl = 'ynuiitgsmudgxaolvhhj.supabase.co'

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
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            }
        }

        const req = https.request(options, (res) => {
            let responseData = ''
            res.on('data', (chunk) => { responseData += chunk })
            res.on('end', () => {
                console.log(`${method} ${path} - Status: ${res.statusCode}`)
                if (responseData) console.log('Response:', responseData.substring(0, 200))

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

async function fixRider() {
    try {
        const userId = '94fb0484-3170-466c-8f5b-9caad25fcb0d'
        const mobile = '9999999999'

        console.log('Creating rider record for existing user...\n')

        const rider = await makeRequest('POST', '/rest/v1/riders', {
            user_id: userId,
            first_name: 'Test',
            last_name: 'Rider',
            mobile,
            pidge_rider_id: 'TEST999',
            status: 'active',
            wallet_balance: 25000
        })

        console.log('\n✅ SUCCESS!')
        console.log(`Mobile: ${mobile}`)
        console.log(`Password: ${mobile}`)

    } catch (error) {
        console.error('\n❌ Error:', error.message)
    }
}

fixRider()
