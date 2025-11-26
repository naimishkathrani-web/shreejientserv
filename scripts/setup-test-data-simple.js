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
                    reject(new Error(`HTTP ${res.statusCode}: ${responseData}`))
                }
            })
        })

        req.on('error', reject)
        if (data) req.write(JSON.stringify(data))
        req.end()
    })
}

async function setup() {
    console.log('🚀 Setting up test environment...\n')

    try {
        const schemes = await makeRequest('GET', '/rest/v1/schemes?name=eq.Regular%20Scheme&select=id&limit=1')
        const schemeId = schemes[0]?.id
        console.log('✓ Scheme ID:', schemeId)

        const agencyUser = await makeRequest('POST', '/auth/v1/admin/users', {
            email: 'testagency@shreejientserv.in',
            password: 'agency123',
            email_confirm: true,
            user_metadata: { role: 'agency' }
        })
        console.log('✓ Agency User:', agencyUser.id)

        const agency = await makeRequest('POST', '/rest/v1/agencies?select=*', {
            user_id: agencyUser.id,
            name: 'Mumbai Riders Agency',
            contact_person: 'Rajesh Kumar',
            mobile: '9876543210',
            email: 'testagency@shreejientserv.in',
            bank_account_number: '1234567890123456',
            bank_ifsc: 'HDFC0001234',
            bank_name: 'HDFC Bank',
            status: 'active'
        })
        console.log('✓ Agency:', agency[0].id)

        const riders = []
        for (let i = 1; i <= 3; i++) {
            const mobile = `990000010${i}`
            const user = await makeRequest('POST', '/auth/v1/admin/users', {
                email: `${mobile}@rider.shreejientserv.in`,
                password: 'rider123',
                email_confirm: true,
                user_metadata: { role: 'rider' }
            })

            const rider = await makeRequest('POST', '/rest/v1/riders?select=*', {
                user_id: user.id,
                first_name: ['Amit', 'Priya', 'Rahul'][i - 1],
                last_name: ['Sharma', 'Patel', 'Singh'][i - 1],
                mobile,
                email: `${mobile}@rider.shreejientserv.in`,
                pidge_rider_id: `TEST10${i}`,
                city: 'Mumbai',
                hub: ['Andheri', 'Bandra', 'Powai'][i - 1],
                current_scheme_id: schemeId,
                agency_id: agency[0].id,
                status: 'active',
                wallet_balance: [15000, 8000, 2000][i - 1],
                frozen_balance: [0, 0, 500][i - 1]
            })
            riders.push(rider[0])
            console.log(`✓ Rider ${i}:`, rider[0].id)
        }

        console.log('\n✅ Setup complete!')
        console.log('\nLOGIN CREDENTIALS:')
        console.log('Agency: testagency@shreejientserv.in / agency123')
        console.log('Rider 1: 9900000101 / rider123')
        console.log('Rider 2: 9900000102 / rider123')
        console.log('Rider 3: 9900000103 / rider123')
        console.log('OTP: 123456')

    } catch (error) {
        console.error('❌ Error:', error.message)
    }
}

setup()
