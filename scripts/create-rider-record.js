const https = require('https')

const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InludWlpdGdzbXVkZ3hhb2x2aGhqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzkyNjMzOSwiZXhwIjoyMDc5NTAyMzM5fQ.6AujsS61AlHE548_AuK_I-2r40j8T2fP8W2bmcgT-80'
const userId = 'ad19745d-a5b3-465a-9c3b-720bb209f247'

async function createRiderRecord() {
    // First get scheme ID
    const getScheme = () => new Promise((resolve, reject) => {
        const options = {
            hostname: 'ynuiitgsmudgxaolvhhj.supabase.co',
            port: 443,
            path: '/rest/v1/schemes?name=eq.Regular%20Scheme&select=id&limit=1',
            method: 'GET',
            headers: {
                'apikey': serviceRoleKey,
                'Authorization': `Bearer ${serviceRoleKey}`
            }
        }

        const req = https.request(options, (res) => {
            let data = ''
            res.on('data', (chunk) => { data += chunk })
            res.on('end', () => {
                const schemes = JSON.parse(data)
                resolve(schemes[0]?.id)
            })
        })
        req.on('error', reject)
        req.end()
    })

    const schemeId = await getScheme()
    console.log('✓ Found scheme ID:', schemeId)

    // Create rider record
    const riderData = JSON.stringify({
        user_id: userId,
        first_name: 'Test',
        last_name: 'Rider',
        mobile: '9900000020',
        email: '9900000020@rider.shreejientserv.in',
        pidge_rider_id: 'TEST020',
        city: 'Mumbai',
        hub: 'Andheri',
        status: 'active',
        wallet_balance: 5000.00,
        frozen_balance: 0.00,
        current_scheme_id: schemeId
    })

    const options = {
        hostname: 'ynuiitgsmudgxaolvhhj.supabase.co',
        port: 443,
        path: '/rest/v1/riders',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': riderData.length,
            'apikey': serviceRoleKey,
            'Authorization': `Bearer ${serviceRoleKey}`,
            'Prefer': 'return=representation'
        }
    }

    const req = https.request(options, (res) => {
        let data = ''
        res.on('data', (chunk) => { data += chunk })
        res.on('end', () => {
            if (res.statusCode === 201) {
                console.log('✅ Rider record created successfully!')
                console.log('\n🎉 TEST RIDER READY!')
                console.log('\n📱 LOGIN CREDENTIALS:')
                console.log('   Mobile: 9900000020')
                console.log('   Password: rider123')
                console.log('   OTP: 123456')
                console.log('\n🔗 Login URL: http://localhost:3000/rider/login')
            } else {
                console.log('❌ Error:', res.statusCode)
                console.log(data)
            }
        })
    })

    req.on('error', (error) => {
        console.error('❌ Request error:', error)
    })

    req.write(riderData)
    req.end()
}

createRiderRecord()
