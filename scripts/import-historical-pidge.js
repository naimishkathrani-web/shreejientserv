const axios = require('axios');
const FormData = require('form-data');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://dmphpqdjpbqfsdvyqltc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRtcGhwcWRqcGJxZnNkdnlxbHRjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzE4MjA5MywiZXhwIjoyMDc4NzU4MDkzfQ.vPONcH4kpOxJdHqTNMQJQBTbpKMNJKFbqQUPKfPJRZE';
const supabase = createClient(supabaseUrl, supabaseKey);

const PIDGE_CONFIG = {
    url: 'https://app.appsmith.com/api/v1/actions/execute',
    actionId: '6914d8f2a480302e8556471a',
    cookies: 'XSRF-TOKEN=bbf2bc5a-b39f-47c6-bb74-3cf677129831',
    xsrfToken: 'bbf2bc5a-b39f-47c6-bb74-3cf677129831',
    environmentId: '670f48b619b75a1d0a004d84'
};

async function fetchPidgeData(startDate, endDate) {
    const form = new FormData();
    form.append('executeActionDTO', JSON.stringify({
        actionId: PIDGE_CONFIG.actionId,
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
        console.log('Fetching Nov 17-23, 2025...');
        const trips = await fetchPidgeData('2025-11-17', '2025-11-23');
        console.log(`Fetched ${trips.length} trips`);

        const dailyStats = {};
        trips.forEach(trip => {
            if (!trip.rider_id || !trip.date) return;
            const key = `${trip.rider_id}_${trip.date}`;
            if (!dailyStats[key]) {
                dailyStats[key] = { riderId: trip.rider_id, date: trip.date, total: 0, completed: 0 };
            }
            dailyStats[key].total++;
            if (trip.trip_completed) dailyStats[key].completed++;
        });

        console.log(`Processing ${Object.keys(dailyStats).length} records...`);

        for (const stats of Object.values(dailyStats)) {
            const riderId = await createRiderIfNotExists(stats.riderId);
            if (!riderId) continue;

            const { data: existing } = await supabase
                .from('daily_transactions')
                .select('id')
                .eq('rider_id', riderId)
                .eq('date', stats.date)
                .single();

            if (existing) {
                await supabase.from('daily_transactions').update({ pidge_orders: stats.completed }).eq('id', existing.id);
                console.log(`✓ Updated ${stats.date} rider ${stats.riderId}: ${stats.completed} orders`);
            } else {
                await supabase.from('daily_transactions').insert({
                    rider_id: riderId,
                    date: stats.date,
                    pidge_orders: stats.completed,
                    pidge_distance_km: 0
                });
                console.log(`✓ Inserted ${stats.date} rider ${stats.riderId}: ${stats.completed} orders`);
            }
        }

        console.log('✅ Import complete!');
    } catch (error) {
        console.error('❌ Import failed:', error.message);
    }
}

importHistoricalData();
