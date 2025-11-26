const https = require('https')
const FormData = require('form-data')

const PIDGE_EMAIL = 'naimish@shreejientserv.in'
const PIDGE_PASSWORD = 'Shreeji@2024'

const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InludWlpdGdzbXVkZ3hhb2x2aGhqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzkyNjMzOSwiZXhwIjoyMDc5NTAyMzM5fQ.6AujsS61AlHE548_AuK_I-2r40j8T2fP8W2bmcgT-80'
const supabaseUrl = 'ynuiitgsmudgxaolvhhj.supabase.co'

let pidgeToken = null

function pidgeRequest(method, path, data = null, token = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'app.appsmith.com',
            port: 443,
            path: `/api/v1/consolidated/${path}`,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        }

        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`
        }

        const req = https.request(options, (res) => {
            let responseData = ''
            res.on('data', (chunk) => { responseData += chunk })
            res.on('end', () => {
                try {
                    resolve(JSON.parse(responseData))
                } catch (e) {
                    resolve(responseData)
                }
            })
        })

        req.on('error', reject)
        if (data) req.write(JSON.stringify(data))
        req.end()
    })
}

function supabaseRequest(method, path, data = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: supabaseUrl,
            port: 443,
            path: path,
            method: method,
            headers: {
                'apikey': serviceRoleKey,
                'Authorization': `Bearer ${serviceRoleKey}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            }
        }

        if (data) {
            const body = JSON.stringify(data)
            options.headers['Content-Length'] = Buffer.byteLength(body)
        }

        const req = https.request(options, (res) => {
            let responseData = ''
            res.on('data', (chunk) => { responseData += chunk })
            res.on('end', () => {
                try {
                    resolve(JSON.parse(responseData))
                } catch (e) {
                    resolve(responseData)
                }
            })
        })

        req.on('error', reject)
        if (data) req.write(JSON.stringify(data))
        req.end()
    })
}

async function loginPidge() {
    console.log('🔐 Logging into Pidge...')
    const response = await pidgeRequest('POST', 'users/login', {
        username: PIDGE_EMAIL,
        password: PIDGE_PASSWORD
    })

    if (response.data && response.data.token) {
        pidgeToken = response.data.token
        console.log('✅ Pidge login successful\n')
        return true
    }
    return false
}

async function fetchTodayData() {
    console.log('📊 Fetching today\'s data from Pidge...\n')

    const today = '2025-11-26'

    // Fetch trip allocation data
    const response = await pidgeRequest('GET', `pages/floating_fleet_ch/queries/trip_allocation_data_query?startDate=${today}&endDate=${today}`, null, pidgeToken)

    if (!response.data || !response.data.body) {
        console.log('❌ No data returned from Pidge')
        return []
    }

    const trips = response.data.body
    console.log(`Found ${trips.length} rider records for today\n`)

    return trips
}

async function loadIntoDatabase(trips) {
    console.log('💾 Loading data into database...\n')

    // Get all riders from database
    const riders = await supabaseRequest('GET', '/rest/v1/riders?select=id,pidge_rider_id')
    const riderMap = {}
    riders.forEach(r => {
        if (r.pidge_rider_id) {
            riderMap[r.pidge_rider_id] = r.id
        }
    })

    let loaded = 0
    let skipped = 0

    for (const trip of trips) {
        const riderId = riderMap[trip.rider_id]

        if (!riderId) {
            skipped++
            continue
        }

        // Insert/update daily transaction
        const transaction = {
            rider_id: riderId,
            date: trip.date || '2025-11-26',
            pidge_orders: trip.completed_trips || 0,
            pidge_distance_km: 0,
            pidge_daily_earning: 0,
            pidge_daily_incentive: 0,
            pidge_total: 0,
            slab_amount: 0,
            final_payout: 0
        }

        const result = await supabaseRequest('POST', '/rest/v1/daily_transactions', transaction)

        if (result && result.length > 0) {
            loaded++
            console.log(`✅ ${loaded}/${trips.length} - Loaded: Rider ${trip.rider_id} (${trip.completed_trips} orders)`)
        }
    }

    console.log(`\n✅ Complete! Loaded: ${loaded}, Skipped: ${skipped}`)
}

async function findRiderWithBothData() {
    console.log('\n🔍 Finding riders with both today and historical data...\n')

    const result = await supabaseRequest('GET', '/rest/v1/daily_transactions?select=rider_id,date,pidge_orders&order=date.desc&limit=100')

    const riderDates = {}
    result.forEach(t => {
        if (!riderDates[t.rider_id]) {
            riderDates[t.rider_id] = []
        }
        riderDates[t.rider_id].push(t.date)
    })

    // Find riders with data from multiple dates
    for (const [riderId, dates] of Object.entries(riderDates)) {
        const uniqueDates = [...new Set(dates)]
        if (uniqueDates.length >= 2) {
            const rider = await supabaseRequest('GET', `/rest/v1/riders?id=eq.${riderId}&select=pidge_rider_id,first_name,last_name,mobile`)
            if (rider && rider.length > 0) {
                console.log(`✅ Found: ${rider[0].first_name} ${rider[0].last_name}`)
                console.log(`   Pidge ID: ${rider[0].pidge_rider_id}`)
                console.log(`   Mobile: ${rider[0].mobile}`)
                console.log(`   Dates: ${uniqueDates.join(', ')}`)
                console.log(`   Password: ${rider[0].pidge_rider_id}\n`)
                return rider[0]
            }
        }
    }
}

async function main() {
    try {
        await loginPidge()
        const trips = await fetchTodayData()

        if (trips.length > 0) {
            await loadIntoDatabase(trips)
            await findRiderWithBothData()
        }
    } catch (error) {
        console.error('Error:', error.message)
    }
}

main()
