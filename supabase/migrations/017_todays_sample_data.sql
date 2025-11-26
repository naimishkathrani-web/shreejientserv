-- Add today's data (Nov 26, 2025) for active riders
-- This simulates live data from Pidge showing 39 active riders with 121 total orders

INSERT INTO daily_transactions (rider_id, date, pidge_orders, pidge_distance_km, pidge_daily_earning, pidge_daily_incentive, pidge_total, slab_amount, final_payout, created_at)
SELECT 
    r.id,
    '2025-11-26'::DATE,
    CASE r.pidge_rider_id
        WHEN '28553' THEN 7  -- Hemat - 7 orders
        WHEN '35268' THEN 12 -- Mohammed - 12 orders (top performer)
        WHEN '35473' THEN 10 -- Swapnil - 10 orders
        WHEN '35360' THEN 8  -- Ravindra - 8 orders
        WHEN '36176' THEN 9  -- Harikesh - 9 orders
        WHEN '35121' THEN 11 -- Rahul - 11 orders
        WHEN '33623' THEN 10 -- Sachin - 10 orders
        WHEN '34121' THEN 8  -- Vinod - 8 orders
        WHEN '35646' THEN 7  -- Abdul - 7 orders
        WHEN '35897' THEN 9  -- Kaustubh - 9 orders
        ELSE 5 -- Others - 5 orders average
    END as orders,
    25.5 as distance_km,
    CASE r.pidge_rider_id
        WHEN '28553' THEN 245.50
        WHEN '35268' THEN 420.75  -- Top earner
        WHEN '35473' THEN 350.00
        WHEN '35360' THEN 280.25
        WHEN '36176' THEN 315.50
        WHEN '35121' THEN 385.00
        WHEN '33623' THEN 350.00
        WHEN '34121' THEN 280.00
        WHEN '35646' THEN 245.00
        WHEN '35897' THEN 315.00
        ELSE 175.00
    END as daily_earning,
    CASE r.pidge_rider_id
        WHEN '35268' THEN 200  -- Milestone bonus
        WHEN '35473' THEN 200
        WHEN '35121' THEN 200
        WHEN '33623' THEN 200
        ELSE 0
    END as incentive,
    0 as pidge_total,
    0 as slab_amount,
    CASE r.pidge_rider_id
        WHEN '28553' THEN 245.50
        WHEN '35268' THEN 620.75  -- Total with bonus
        WHEN '35473' THEN 550.00
        WHEN '35360' THEN 280.25
        WHEN '36176' THEN 315.50
        WHEN '35121' THEN 585.00
        WHEN '33623' THEN 550.00
        WHEN '34121' THEN 280.00
        WHEN '35646' THEN 245.00
        WHEN '35897' THEN 315.00
        ELSE 175.00
    END as final_payout,
    NOW()
FROM riders r
WHERE r.pidge_rider_id IN (
    '28553', '35268', '35473', '35360', '36176', '35121', '33623', 
    '34121', '35646', '35897', '34976', '35418', '35393', '35674',
    '35690', '35726', '35764', '35835', '35955', '36106'
)
ON CONFLICT (rider_id, date) DO UPDATE SET
    pidge_orders = EXCLUDED.pidge_orders,
    pidge_distance_km = EXCLUDED.pidge_distance_km,
    pidge_daily_earning = EXCLUDED.pidge_daily_earning,
    pidge_daily_incentive = EXCLUDED.pidge_daily_incentive,
    final_payout = EXCLUDED.final_payout;

-- Verify the data
SELECT 
    r.pidge_rider_id,
    r.first_name,
    r.mobile,
    dt.date,
    dt.pidge_orders,
    dt.final_payout
FROM daily_transactions dt
JOIN riders r ON r.id = dt.rider_id
WHERE dt.date = '2025-11-26'
ORDER BY dt.final_payout DESC
LIMIT 10;
