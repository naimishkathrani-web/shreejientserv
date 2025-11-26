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
                    console.log(`Warning: ${res.statusCode} - ${responseData}`)
                    resolve(null)
                }
            })
        })

        req.on('error', reject)
        if (data) req.write(JSON.stringify(data))
        req.end()
    })
}

async function createFreshRider() {
    console.log('Creating fresh test rider...\n')

    try {
        const mobile = '9999999999'
        const email = `${mobile}@rider.shreejientserv.in`

        // Try to create user
        const user = await makeRequest('POST', '/auth/v1/admin/users', {
            email,
            password: mobile,
            email_confirm: true,
            user_metadata: { role: 'rider' }
        })

        if (!user || !user.id) {
            console.log('❌ Could not create auth user')
            return
        }

        console.log('✓ Auth User:', user.id)

        // Create rider record
        const rider = await makeRequest('POST', '/rest/v1/riders?select=*', {
            user_id: user.id,
            first_name: 'Test',
            last_name: 'Rider',
            mobile,
            pidge_rider_id: 'TEST999',
            status: 'active',
            wallet_balance: 25000
        })

        if (rider && rider[0]) {
            console.log('✓ Rider:', rider[0].id)
            console.log('\n✅ SUCCESS! Login with:')
            console.log(`Mobile: ${mobile}`)
            console.log(`Password: ${mobile}`)
            console.log(`Wallet: ₹25,000`)
        } else {
            console.log('❌ Could not create rider record')
        }

    } catch (error) {
        console.error('❌ Error:', error.message)
    }
}

createFreshRider()
