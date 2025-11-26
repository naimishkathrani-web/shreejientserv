const axios = require('axios');
const FormData = require('form-data');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://dmphpqdjpbqfsdvyqltc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRtcGhwcWRqcGJxZnNkdnlxbHRjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzE4MjA5MywiZXhwIjoyMDc4NzU4MDkzfQ.vPONcH4kpOxJdHqTNMQJQBTbpKMNJKFbqQUPKfPJRZE';
const supabase = createClient(supabaseUrl, supabaseKey);

const PIDGE_CONFIG = {
    url: 'https://app.appsmith.com/api/v1/actions/execute',
    summaryActionId: '6914d88bdf0d052a6992f647', // Summary API with earnings
    cookies: 'XSRF-TOKEN=bbf2bc5a-b39f-47c6-bb74-3cf677129831',
    xsrfToken: 'bbf2bc5a-b39f-47c6-bb74-3cf677129831',
    environmentId: '670f48b619b75a1d0a004d84'
};

// Fetch summary data (distance, earnings, incentives)
async function fetchPidgeSummary(startDate, endDate) {
    const form = new FormData();
    form.append('executeActionDTO', JSON.stringify({
        actionId: PIDGE_CONFIG.summaryActionId,
        viewMode: true,
        paramProperties: {
            k0: { datatype: 'string', blobIdentifiers: [] },
            k1: { datatype: 'string', blobIdentifiers: [] },
            k2: { datatype: 'string', blobIdentifiers: [] }
        },
        analyticsProperties: { isUserInitiated: false }
    }));

    form.append('parameterMap', JSON.stringify({
        'appsmith.store.selected_business': 'k0',
        'moment(end_date.selectedDate).endOf("day").format("YYYY-MM-DD")': 'k1',
        'moment(start_date.selectedDate).startOf("day").format("YYYY-MM-DD")': 'k2'
    }));

    form.append('k0', 'Shreeji Enterprise Services', { filename: 'blob', contentType: 'text/plain' });
    form.append('k1', endDate, { filename: 'blob', contentType: 'text/plain' });
    form.append('k2', startDate, { filename: 'blob', contentType: 'text/plain' });

    const headers = {
        ...form.getHeaders(),
        'accept': 'application/json',
        'cookie': PIDGE_CONFIG.cookies,
        'x-appsmith-environmentid': PIDGE_CONFIG.environmentId,
        'x-xsrf-token': PIDGE_CONFIG.xsrfToken
    };

    const response = await axios.post(PIDGE_CONFIG.url, form, { headers });
    return response.data.data.body;
}

async function createRiderIfNotExists(pidgeRiderId) {
    const { data: existing } = await supabase
        .from('riders')
        .select('id')
        .eq('pidge_rider_id', pidgeRiderId)
        .single();

    if (existing) return existing.id;

    const email = `${pidgeRiderId}@rider.shreejientserv.in`;
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email,
        password: pidgeRiderId.toString(),
        email_confirm: true,
        user_metadata: { role: 'rider' }
    });

    if (authError) {
        console.error(`Auth failed for ${pidgeRiderId}:`, authError.message);
        return null;
    }

    const { data: rider, error: riderError } = await supabase
        .from('riders')
        .insert({
            user_id: authUser.user.id,
            first_name: 'Rider',
            last_name: pidgeRiderId.toString(),
            mobile: pidgeRiderId.toString(),
            pidge_rider_id: pidgeRiderId,
            status: 'active',
            wallet_balance: 0
        })
        .select()
        .single();

    if (riderError) {
        console.error(`Rider insert failed for ${pidgeRiderId}:`, riderError.message);
        return null;
    }

    console.log(`✓ Created rider ${pidgeRiderId}`);
    return rider.id;
}

async function importHistoricalData() {
    try {
        console.log('Fetching Nov 17-23, 2025 summary data...');
        const summaryData = await fetchPidgeSummary('2025-11-17', '2025-11-23');
        console.log(`Fetched ${summaryData.length} summary records`);

        if (summaryData.length > 0) {
            console.log('Sample record:', JSON.stringify(summaryData[0], null, 2));
        }

        for (const record of summaryData) {
            // Extract fields - adjust based on actual API response
            const riderId = record.rider_id;
            const date = record.date;
            const distance = parseFloat(record.distance || record.total_distance || 0);
            const dailyEarning = parseFloat(record.daily_earning || record.pidge_daily_earning || 0);
            const dailyIncentive = parseFloat(record.daily_incentive || record.pidge_daily_incentive || 0);
            const totalTrips = parseInt(record.total_trips || record.completed_trips || 0);

            if (!riderId || !date) continue;

            const dbRiderId = await createRiderIfNotExists(riderId);
            if (!dbRiderId) continue;

            const { data: existing } = await supabase
                .from('daily_transactions')
                .select('id')
                .eq('rider_id', dbRiderId)
                .eq('date', date)
                .single();

            if (existing) {
                await supabase.from('daily_transactions').update({
                    pidge_orders: totalTrips,
                    pidge_distance_km: distance,
                    pidge_daily_earning: dailyEarning,
                    pidge_daily_incentive: dailyIncentive,
                    pidge_total: dailyEarning + dailyIncentive
                }).eq('id', existing.id);
                console.log(`✓ Updated ${date} rider ${riderId}: ${totalTrips} trips, ${distance}km, ₹${dailyEarning + dailyIncentive}`);
            } else {
                await supabase.from('daily_transactions').insert({
                    rider_id: dbRiderId,
                    date: date,
                    pidge_orders: totalTrips,
                    pidge_distance_km: distance,
                    pidge_daily_earning: dailyEarning,
                    pidge_daily_incentive: dailyIncentive,
                    pidge_total: dailyEarning + dailyIncentive
                });
                console.log(`✓ Inserted ${date} rider ${riderId}: ${totalTrips} trips, ${distance}km, ₹${dailyEarning + dailyIncentive}`);
            }
        }

        console.log('✅ Import complete!');
    } catch (error) {
        console.error('❌ Import failed:', error.message);
        console.error(error.stack);
    }
}

importHistoricalData();
