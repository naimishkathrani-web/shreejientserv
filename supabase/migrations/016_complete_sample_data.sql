-- Complete Sample Data Setup for All User Types
-- Run this in Supabase SQL Editor

-- ============================================
-- PART 1: AGENCY SAMPLE DATA
-- ============================================

-- Create sample agency
INSERT INTO agencies (name, contact_person, email, phone, address, city, state, pincode, status)
VALUES 
    ('Mumbai Logistics Hub', 'Rajesh Sharma', 'rajesh@mumbailogistics.com', '9876543210', '123 Andheri East', 'Mumbai', 'Maharashtra', '400069', 'active'),
    ('Delhi Express Services', 'Priya Gupta', 'priya@delhiexpress.com', '9876543211', '456 Connaught Place', 'Delhi', 'Delhi', '110001', 'active')
ON CONFLICT (email) DO NOTHING;

-- Create agency users (you'll need to create auth users separately)
INSERT INTO agency_users (agency_id, name, email, phone, role, status)
SELECT 
    a.id,
    'Rajesh Sharma',
    'rajesh@mumbailogistics.com',
    '9876543210',
    'admin',
    'active'
FROM agencies a WHERE a.email = 'rajesh@mumbailogistics.com'
ON CONFLICT (email) DO NOTHING;

-- ============================================
-- PART 2: RIDER WALLET & TRANSACTIONS
-- ============================================

-- Update wallet balances for sample riders
UPDATE riders 
SET 
    wallet_balance = 5000.00,
    frozen_balance = 0
WHERE pidge_rider_id IN ('28536', '28553', '31901', '33623', '35268');

-- Add sample financial transactions
INSERT INTO financial_transactions (rider_id, amount, transaction_type, description, balance_after, created_at)
SELECT 
    r.id,
    1756.25,
    'earning',
    'Daily payout - Nov 17',
    1756.25,
    '2025-11-17 18:00:00'
FROM riders r WHERE r.pidge_rider_id = '28536'
UNION ALL
SELECT 
    r.id,
    1787.29,
    'earning',
    'Daily payout - Nov 19',
    3543.54,
    '2025-11-19 18:00:00'
FROM riders r WHERE r.pidge_rider_id = '28553'
UNION ALL
SELECT 
    r.id,
    3451.28,
    'earning',
    'Daily payout - Nov 19',
    3451.28,
    '2025-11-19 18:00:00'
FROM riders r WHERE r.pidge_rider_id = '31901'
UNION ALL
SELECT 
    r.id,
    -2000.00,
    'withdrawal',
    'Bank transfer to HDFC ****1234',
    1451.28,
    '2025-11-20 10:00:00'
FROM riders r WHERE r.pidge_rider_id = '31901'
UNION ALL
SELECT 
    r.id,
    3502.61,
    'earning',
    'Daily payout - Nov 17',
    3502.61,
    '2025-11-17 18:00:00'
FROM riders r WHERE r.pidge_rider_id = '33623';

-- ============================================
-- PART 3: WITHDRAWAL REQUESTS
-- ============================================

INSERT INTO withdrawal_requests (rider_id, amount, status, bank_account_number, ifsc_code, bank_name, created_at, processed_at)
SELECT 
    r.id,
    2000.00,
    'completed',
    '1234567890',
    'HDFC0001234',
    'HDFC Bank',
    '2025-11-20 09:00:00',
    '2025-11-20 10:00:00'
FROM riders r WHERE r.pidge_rider_id = '31901'
UNION ALL
SELECT 
    r.id,
    1500.00,
    'pending',
    '9876543210',
    'ICIC0001234',
    'ICICI Bank',
    '2025-11-23 14:00:00',
    NULL
FROM riders r WHERE r.pidge_rider_id = '33623';

-- ============================================
-- PART 4: SYSTEM SETTINGS
-- ============================================

INSERT INTO system_settings (key, value, description)
VALUES 
    ('daily_withdrawal_limit', '5000', 'Maximum daily withdrawal amount in rupees'),
    ('referral_bonus_amount', '500', 'Bonus amount for successful referrals'),
    ('min_referral_days', '6', 'Minimum days new rider must work to qualify referrer for bonus')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- ============================================
-- PART 5: MDND CASES (for frozen balance demo)
-- ============================================

INSERT INTO mdnd_cases (rider_id, order_id, amount, status, reported_date, proof_submitted)
SELECT 
    r.id,
    'MDND001',
    250.00,
    'pending',
    '2025-11-22',
    false
FROM riders r WHERE r.pidge_rider_id = '32141'
UNION ALL
SELECT 
    r.id,
    'MDND002',
    180.00,
    'resolved',
    '2025-11-18',
    true
FROM riders r WHERE r.pidge_rider_id = '28553';

-- Update frozen balance for rider with pending MDND
UPDATE riders r
SET frozen_balance = 250.00
FROM mdnd_cases m
WHERE r.id = m.rider_id AND m.status = 'pending';

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check rider data
SELECT 
    pidge_rider_id,
    first_name,
    mobile,
    wallet_balance,
    frozen_balance,
    CASE WHEN user_id IS NOT NULL THEN '✅' ELSE '❌' END as has_auth
FROM riders 
WHERE pidge_rider_id IN ('28536', '28553', '31901', '33623', '35268')
ORDER BY pidge_rider_id;

-- Check daily transactions
SELECT 
    r.pidge_rider_id,
    r.first_name,
    dt.date,
    dt.pidge_orders,
    dt.pidge_daily_earning,
    dt.final_payout
FROM daily_transactions dt
JOIN riders r ON r.id = dt.rider_id
WHERE r.pidge_rider_id IN ('28536', '28553', '31901')
ORDER BY r.pidge_rider_id, dt.date
LIMIT 10;

-- Check financial transactions
SELECT 
    r.pidge_rider_id,
    r.first_name,
    ft.transaction_type,
    ft.amount,
    ft.description,
    ft.created_at
FROM financial_transactions ft
JOIN riders r ON r.id = ft.rider_id
WHERE r.pidge_rider_id IN ('28536', '28553', '31901', '33623')
ORDER BY ft.created_at DESC
LIMIT 10;
