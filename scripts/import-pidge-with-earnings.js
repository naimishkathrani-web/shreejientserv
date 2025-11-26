const axios = require('axios');
const FormData = require('form-data');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient('https://dmphpqdjpbqfsdvyqltc.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRtcGhwcWRqcGJxZnNkdnlxbHRjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzE4MjA5MywiZXhwIjoyMDc4NzU4MDkzfQ.vPONcH4kpOxJdHqTNMQJQBTbpKMNJKFbqQUPKfPJRZE');

// Payout structure
const SLABS = [
    { orders: 37, incentive: 3700 },
    { orders: 26, incentive: 1800 },
    { orders: 17, incentive: 900 },
    { orders: 9, incentive: 500 }
];

function calculateEarnings(trips, totalKm) {
    // Daily earning: ₹25/order + ₹4/km above 3km per order
    const baseEarning = trips * 25;
    const avgKmPerTrip = totalKm / trips;
    const extraKm = Math.max(0, avgKmPerTrip - 3) * trips;
    const dailyEarning = baseEarning + (extraKm * 4);

    // Daily incentive: slab-based
    const slab = SLABS.find(s => trips >= s.orders);
    const dailyIncentive = slab ? slab.incentive : 0;

    return {
        dailyEarning: Math.round(dailyEarning),
        dailyIncentive,
        total: Math.round(dailyEarning) + dailyIncentive
    };
}

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
        trips.forEach(t => {
            if (t.fulfillment_Status !== 'DELIVERED' || !t.rider_id) return;
            const key = `${t.rider_id}_${t.Delivered_at.split('T')[0]}`;
            if (!daily[key]) daily[key] = { riderId: t.rider_id, date: t.Delivered_at.split('T')[0], trips: 0, km: 0 };
            pidge_daily_earning: earnings.dailyEarning,
                pidge_daily_incentive: earnings.dailyIncentive,
                    pidge_total: earnings.total,
                        final_payout: earnings.total
        }).eq('id', existing.id);
    } else {
        await supabase.from('daily_transactions').insert({
            rider_id: riderId,
            date: d.date,
            pidge_orders: d.trips,
            pidge_distance_km: d.km,
            pidge_daily_earning: earnings.dailyEarning,
            pidge_daily_incentive: earnings.dailyIncentive,
            pidge_total: earnings.total,
            final_payout: earnings.total
        });
    }

    console.log(`✓ Rider ${d.riderId} ${d.date}: ${d.trips} trips, ${d.km.toFixed(1)}km → ₹${earnings.dailyEarning} + ₹${earnings.dailyIncentive} = ₹${earnings.total}`);
}

console.log('\n✅ Import complete!');
}

run();
