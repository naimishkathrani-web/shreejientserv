-- Test the sync API endpoint
-- Run this to verify the Pidge sync works

-- First, check current data
SELECT COUNT(*) as total_riders FROM riders WHERE user_id IS NOT NULL;
SELECT COUNT(*) as total_transactions FROM daily_transactions;
SELECT COUNT(*) as today_transactions FROM daily_transactions WHERE date = CURRENT_DATE;

-- Check a specific rider's data
SELECT 
    r.pidge_rider_id,
    r.first_name,
    r.wallet_balance,
    COUNT(dt.id) as transaction_count
FROM riders r
LEFT JOIN daily_transactions dt ON dt.rider_id = r.id
WHERE r.pidge_rider_id = '35268'
GROUP BY r.id, r.pidge_rider_id, r.first_name, r.wallet_balance;
