// Final Pidge import - gets trips with distance, calculates earnings
const axios = require('axios');
const FormData = require('form-data');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient('https://dmphpqdjpbqfsdvyqltc.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRtcGhwcWRqcGJxZnNkdnlxbHRjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzE4MjA5MywiZXhwIjoyMDc4NzU4MDkzfQ.vPONcH4kpOxJdHqTNMQJQBTbpKMNJKFbqQUPKfPJRZE');

async function fetchTrips(start, end) {
    const form = new FormData();
    form.append('executeActionDTO', JSON.stringify({
        actionId: '68ef4d691cdba9790964c746',
        viewMode: true,
        paramProperties: { k0: { datatype: 'string', blobIdentifiers: [] }, k1: { datatype: 'string', blobIdentifiers: [] }, k2: { datatype: 'string', blobIdentifiers: [] } },
        analyticsProperties: { isUserInitiated: false }
    }));
    form.append('parameterMap', JSON.stringify({ 'appsmith.store.selected_business': 'k0', 'moment(end_date.selectedDate).endOf("day").format("YYYY-MM-DD")': 'k1', 'moment(start_date.selectedDate).startOf("day").format("YYYY-MM-DD")': 'k2' }));
    form.append('k0', 'Shreeji Enterprise Services', { filename: 'blob', contentType: 'text/plain' });
    form.append('k1', end, { filename: 'blob', contentType: 'text/plain' });
    form.append('k2', start, { filename: 'blob', contentType: 'text/plain' });
    const response = await axios.post('https://app.appsmith.com/api/v1/actions/execute', form, {
        headers: { ...form.getHeaders(), 'cookie': 'XSRF-TOKEN=bbf2bc5a-b39f-47c6-bb74-3cf677129831', 'x-appsmith-environmentid': '670f48b619b75a1d0a004d84', 'x-xsrf-token': 'bbf2bc5a-b39f-47c6-bb74-3cf677129831' }
    });
    return response.data.data.body;
}

async function run() {
    const trips = await fetchTrips('2025-11-17', '2025-11-23');
    const daily = {};
    trips.forEach(t => {
        if (t.fulfillment_Status !== 'DELIVERED' || !t.rider_id) return;
        const key = `${t.rider_id}_${t.Delivered_at.split('T')[0]}`;
        if (!daily[key]) daily[key] = { riderId: t.rider_id, date: t.Delivered_at.split('T')[0], trips: 0, km: 0 };
        daily[key].trips++;
        daily[key].km += parseFloat(t.km_distance || 0);
    });

    console.log(`Processing ${Object.keys(daily).length} records...`);
    for (const d of Object.values(daily)) {
        console.log(`Rider ${d.riderId} on ${d.date}: ${d.trips} trips, ${d.km.toFixed(2)}km`);
        // TODO: Insert into DB with scheme calculation
    }
}
run();
