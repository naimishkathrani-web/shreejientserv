const https = require('https')

const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InludWlpdGdzbXVkZ3hhb2x2aGhqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzkyNjMzOSwiZXhwIjoyMDc5NTAyMzM5fQ.6AujsS61AlHE548_AuK_I-2r40j8T2fP8W2bmcgT-80'
const baseUrl = 'ynuiitgsmudgxaolvhhj.supabase.co'

// Helper function for HTTP requests
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

async function setupCompleteTestData() {
    console.log('🚀 Setting up complete test environment...\n')

    try {
        // Step 1: Get scheme ID
        console.log('1️⃣  Getting scheme ID...')
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
    console.log('   ✓ Agency ID:', agency[0].id)

    // Step 4: Create 3 Test Riders
    console.log('\n4️⃣  Creating 3 test riders...')

    const riders = [
        {
            mobile: '9900000101',
            firstName: 'Amit',
            lastName: 'Sharma',
            pidgeId: 'TEST101',
            city: 'Mumbai',
            hub: 'Andheri',
            wallet: 15000,
            frozen: 0,
            type: 'High Performer'
        },
        {
            mobile: '9900000102',
            firstName: 'Priya',
            lastName: 'Patel',
            pidgeId: 'TEST102',
            city: 'Mumbai',
            hub: 'Bandra',
            wallet: 8000,
            frozen: 0,
            type: 'Medium Performer'
        },
        {
            mobile: '9900000103',
            firstName: 'Rahul',
            lastName: 'Singh',
            pidgeId: 'TEST103',
            city: 'Mumbai',
            hub: 'Powai',
            wallet: 2000,
            frozen: 500,
            type: 'New Rider with MDND'
        }
    ]

    const createdRiders = []

    for (const rider of riders) {
        console.log(`\n   Creating ${rider.type}...`)

        // Create auth user
        const riderUser = await makeRequest('POST', '/auth/v1/admin/users', {
            email: `${rider.mobile}@rider.shreejientserv.in`,
            password: 'rider123',
            email_confirm: true,
            user_metadata: { role: 'rider' }
        })
        console.log(`   ✓ User created: ${riderUser.id}`)

        // Create rider record
        const riderRecord = await makeRequest('POST', '/rest/v1/riders?select=*', {
            user_id: riderUser.id,
            first_name: rider.firstName,
            last_name: rider.lastName,
            mobile: rider.mobile,
            email: `${rider.mobile}@rider.shreejientserv.in`,
            pidge_rider_id: rider.pidgeId,
            city: rider.city,
            hub: rider.hub,
            current_scheme_id: schemeId,
            agency_id: agency[0].id,
            status: 'active',
            wallet_balance: rider.wallet,
            frozen_balance: rider.frozen,
            verification_status: 'verified',
            contract_accepted_at: new Date().toISOString(),
            contract_version: '1.0'
        })

        createdRiders.push({ ...rider, id: riderRecord[0].id })
        console.log(`   ✓ Rider created: ${riderRecord[0].id}`)
    }

    // Step 5: Create Transaction History (30 days)
    console.log('\n5️⃣  Creating 30 days of transaction history...')

    const transactions = []
    const today = new Date()

    for (let i = 0; i < 30; i++) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)
        const dateStr = date.toISOString().split('T')[0]

        // High performer (Rider 1)
        transactions.push({
            rider_id: createdRiders[0].id,
            date: dateStr,
            pidge_orders: 25 + Math.floor(Math.random() * 10),
            pidge_distance_km: 50 + Math.floor(Math.random() * 20),
            pidge_daily_earning: 900 + Math.floor(Math.random() * 200),
            pidge_daily_incentive: 150 + Math.floor(Math.random() * 50),
            pidge_total: 1050 + Math.floor(Math.random() * 250),
            slab_amount: 1200 + Math.floor(Math.random() * 200),
            final_payout: 1200 + Math.floor(Math.random() * 200)
        })

        // Medium performer (Rider 2)
        transactions.push({
            rider_id: createdRiders[1].id,
            date: dateStr,
            pidge_orders: 15 + Math.floor(Math.random() * 8),
            pidge_distance_km: 30 + Math.floor(Math.random() * 15),
            pidge_daily_earning: 550 + Math.floor(Math.random() * 150),
            pidge_daily_incentive: 90 + Math.floor(Math.random() * 30),
            pidge_total: 640 + Math.floor(Math.random() * 180),
            slab_amount: 750 + Math.floor(Math.random() * 150),
            final_payout: 750 + Math.floor(Math.random() * 150)
        })

        // New rider (Rider 3) - only last 10 days
        if (i < 10) {
            transactions.push({
                rider_id: createdRiders[2].id,
                date: dateStr,
                pidge_orders: 8 + Math.floor(Math.random() * 5),
                pidge_distance_km: 16 + Math.floor(Math.random() * 8),
                pidge_daily_earning: 300 + Math.floor(Math.random() * 100),
                pidge_daily_incentive: 50 + Math.floor(Math.random() * 20),
                pidge_total: 350 + Math.floor(Math.random() * 120),
                slab_amount: 400 + Math.floor(Math.random() * 100),
                final_payout: 400 + Math.floor(Math.random() * 100)
            })
        }
    }

    // Batch insert transactions
    await makeRequest('POST', '/rest/v1/daily_transactions', transactions)
    console.log(`   ✓ Created ${transactions.length} transaction records`)

    // Step 6: Create Withdrawal Requests
    console.log('\n6️⃣  Creating withdrawal requests...')

    const withdrawals = [
        {
            rider_id: createdRiders[0].id,
            amount: 5000,
            status: 'completed',
            requested_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            processed_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
            transaction_id: 'TXN001',
            notes: 'Processed successfully'
        },
        {
            rider_id: createdRiders[1].id,
            amount: 3000,
            status: 'pending',
            requested_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            rider_id: createdRiders[0].id,
            amount: 500,
            status: 'processing',
            requested_at: new Date().toISOString()
        }
    ]

    await makeRequest('POST', '/rest/v1/withdrawal_requests', withdrawals)
    console.log(`   ✓ Created ${withdrawals.length} withdrawal requests`)

    // Step 7: Create MDND Cases
    console.log('\n7️⃣  Creating MDND cases...')

    const mdndCases = [
        {
            rider_id: createdRiders[2].id,
            date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            order_id: 'ORD789101',
            penalty_amount: 300,
            status: 'pending',
            frozen_amount: 300,
            is_weekly_bonus_loss: false,
            proof_url: null
        },
        {
            rider_id: createdRiders[2].id,
            date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            order_id: 'ORD789102',
            penalty_amount: 200,
            status: 'disputed',
            frozen_amount: 200,
            is_weekly_bonus_loss: false,
            proof_url: null
        }
    ]

    await makeRequest('POST', '/rest/v1/mdnd_cases', mdndCases)
    console.log(`   ✓ Created ${mdndCases.length} MDND cases`)

    // Final Summary
    console.log('\n' + '='.repeat(50))
    console.log('✅ TEST ENVIRONMENT SETUP COMPLETE!')
    console.log('='.repeat(50))
    console.log('\n📱 LOGIN CREDENTIALS:\n')
    console.log('👤 ADMIN:')
    console.log('   Email: admin@test.com')
    console.log('   Password: admin123')
    console.log('   URL: http://localhost:3000/admin/login\n')
    console.log('🏢 AGENCY:')
    console.log('   Email: testagency@shreejientserv.in')
    console.log('   Password: agency123')
    console.log('   URL: http://localhost:3000/agency/login\n')
    console.log('🚴 RIDERS:')
    console.log('   1. High Performer (Amit Sharma)')
    console.log('      Mobile: 9900000101')
    console.log('      Password: rider123')
    console.log('      Balance: ₹15,000 | 30 days history\n')
    console.log('   2. Medium Performer (Priya Patel)')
    console.log('      Mobile: 9900000102')
    console.log('      Password: rider123')
    console.log('      Balance: ₹8,000 | 1 pending withdrawal\n')
    console.log('   3. New Rider (Rahul Singh)')
    console.log('      Mobile: 9900000103')
    console.log('      Password: rider123')
    console.log('      Balance: ₹2,000 | ₹500 frozen (2 MDND cases)\n')
    console.log('🔐 OTP: 123456 (for all riders in development)\n')
    console.log('='.repeat(50))

} catch (error) {
    console.error('\n❌ Error:', error.message)
    process.exit(1)
}
}

setupCompleteTestData()
