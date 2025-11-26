const axios = require('axios');
const FormData = require('form-data');
const { createClient } = require('@supabase/supabase-js');

// Supabase setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRtcGhwcWRqcGJxZnNkdnlxbHRjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzE4MjA5MywiZXhwIjoyMDc4NzU4MDkzfQ.vPONcH4kpOxJdHqTNMQJQBTbpKMNJKFbqQUPKfPJRZE';
const supabase = createClient(supabaseUrl, supabaseKey);

// Pidge API config
const PIDGE_CONFIG = {
    url: 'https://app.appsmith.com/api/v1/actions/execute',
    actionId: '6914d8f2a480302e8556471a',
    cookies: 'XSRF-TOKEN=bbf2bc5a-b39f-47c6-bb74-3cf677129831; ajs_anonymous_id=3a6e9d32-10a7-47b1-bb50-3a84fbd8116a',
    xsrfToken: 'bbf2bc5a-b39f-47c6-bb74-3cf677129831',
    environmentId: '670f48b619b75a1d0a004d84'
};

// Get date based on 5:30 AM logic
function getPidgeDate() {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();

    // If before 5:30 AM, use previous day
    if (hour < 5 || (hour === 5 && minute < 30)) {
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        return yesterday.toISOString().split('T')[0];
    }

    return now.toISOString().split('T')[0];
}

async function fetchPidgeData(date) {
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
    form.append('k1', date, { filename: 'blob', contentType: 'text/plain' });
    form.append('k2', date, { filename: 'blob', contentType: 'text/plain' });

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

async function syncPidgeData() {
    try {
        const date = getPidgeDate();
        console.log(`Fetching Pidge data for: ${date}`);

        const trips = await fetchPidgeData(date);
        console.log(`Fetched ${trips.length} trips`);

        // Group by rider
        const riderStats = {};
        trips.forEach(trip => {
            const riderId = trip.rider_id;
            if (!riderStats[riderId]) {
                riderStats[riderId] = { total: 0, completed: 0 };
            }
            riderStats[riderId].total++;
            if (trip.trip_completed) {
                riderStats[riderId].completed++;
            }
        });

        // Update database
        for (const [pidgeRiderId, stats] of Object.entries(riderStats)) {
            // Find rider by pidge_rider_id
            const { data: rider } = await supabase
                .from('riders')
                .select('id')
                .eq('pidge_rider_id', pidgeRiderId)
                .single();

            if (rider) {
                // Check if daily_transaction exists
                const { data: existing } = await supabase
                    .from('daily_transactions')
                    .select('id')
                    .eq('rider_id', rider.id)
                    .eq('date', date)
                    .single();

                if (existing) {
                    // Update
                    await supabase
                        .from('daily_transactions')
                        .update({
                            pidge_orders: stats.completed,
                            updated_at: new Date().toISOString()
                        })
                        .eq('id', existing.id);
                } else {
                    // Insert
                    await supabase
                        .from('daily_transactions')
                        .insert({
                            rider_id: rider.id,
                            date: date,
                            pidge_orders: stats.completed,
                            pidge_distance_km: 0 // Not available from API
                        });
                }

                console.log(`Updated rider ${pidgeRiderId}: ${stats.completed} completed trips`);
            }
        }

        console.log('Sync complete!');
    } catch (error) {
        console.error('Sync failed:', error.message);
    }
}

syncPidgeData();
