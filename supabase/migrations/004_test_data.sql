-- ============================================
-- Test Data Setup Script
-- Creates admin, agency, and 5 test riders with realistic performance data
-- Based on actual MIS data from Nov 17-23, 2025
-- ============================================

-- ============================================
-- STEP 1: Create Admin User
-- ============================================
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at, confirmation_token, email_change,
  email_change_token_new, recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated', 'authenticated',
  'admin@test.com',
  crypt('admin123', gen_salt('bf')),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"role": "admin", "name": "Test Admin"}',
  NOW(), NOW(), '', '', '', ''
);

-- ============================================
-- STEP 2: Create Test Agency
-- ============================================
DO $$
DECLARE
  agency_user_id UUID;
  agency_id UUID;
BEGIN
  -- Create agency auth user
  INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated', 'authenticated',
    'agency@test.com',
    crypt('agency123', gen_salt('bf')),
    NOW(),
    '{"provider": "email", "providers": ["email"]}',
    '{"role": "agency", "name": "Test Agency"}',
    NOW(), NOW()
  ) RETURNING id INTO agency_user_id;

  -- Create agency record
  INSERT INTO agencies (
    user_id, name, contact_person, mobile, email,
    bank_account_number, bank_ifsc, bank_name, status
  ) VALUES (
    agency_user_id,
    'Test Recruitment Agency',
    'Rajesh Kumar',
    '9876543210',
    'agency@test.com',
    '1234567890123456',
    'HDFC0001234',
    'HDFC Bank',
    'active'
  ) RETURNING id INTO agency_id;

  RAISE NOTICE 'Agency created with ID: %', agency_id;
END $$;

-- ============================================
-- STEP 3: Create Test Riders
-- ============================================

-- Rider 1: High Performer (Based on mohammed rizwan 35268)
-- Email: rider1@test.com | Password: rider123
DO $$
DECLARE
  rider_user_id UUID;
  rider_id UUID;
  scheme_id UUID;
BEGIN
  SELECT id INTO scheme_id FROM schemes WHERE name = 'Regular Scheme' LIMIT 1;

  INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated', 'authenticated',
    '9900000001@rider.shreejientserv.in',
    crypt('rider123', gen_salt('bf')),
    NOW(),
    '{"provider": "email", "providers": ["email"]}',
    '{"role": "rider"}',
    NOW(), NOW()
  ) RETURNING id INTO rider_user_id;

  INSERT INTO riders (
    user_id, first_name, last_name, mobile, email,
    pidge_rider_id, city, hub, current_scheme_id,
    status, wallet_balance, frozen_balance
  ) VALUES (
    rider_user_id,
    'Rajesh', 'Sharma',
    '9900000001',
    '9900000001@rider.shreejientserv.in',
    'TEST001',
    'Mumbai', 'Andheri',
    scheme_id,
    'active', 15000.00, 0.00
  ) RETURNING id INTO rider_id;

  -- Add weekly transactions (Nov 17-23)
  INSERT INTO daily_transactions (rider_id, date, pidge_orders, pidge_distance_km, pidge_daily_earning, pidge_daily_incentive, pidge_total, slab_amount, final_payout)
  VALUES 
    (rider_id, '2025-11-17', 26, 52.0, 920.25, 150.00, 1070.25, 1200.00, 1200.00),
    (rider_id, '2025-11-18', 28, 55.0, 980.50, 160.00, 1140.50, 1250.00, 1250.00),
    (rider_id, '2025-11-19', 25, 50.0, 875.00, 145.00, 1020.00, 1150.00, 1150.00),
    (rider_id, '2025-11-20', 27, 54.0, 945.00, 155.00, 1100.00, 1220.00, 1220.00),
    (rider_id, '2025-11-21', 29, 58.0, 1015.00, 165.00, 1180.00, 1300.00, 1300.00),
    (rider_id, '2025-11-22', 30, 60.0, 1050.00, 170.00, 1220.00, 1350.00, 1350.00),
    (rider_id, '2025-11-23', 24, 48.0, 840.00, 140.00, 980.00, 1100.00, 1100.00);

  RAISE NOTICE 'Rider 1 (High Performer) created - rider1@test.com';
END $$;

-- Rider 2: Medium Performer (Based on sachin sachin 33623)
-- Email: rider2@test.com | Password: rider123
DO $$
DECLARE
  rider_user_id UUID;
  rider_id UUID;
  scheme_id UUID;
BEGIN
  SELECT id INTO scheme_id FROM schemes WHERE name = 'Regular Scheme' LIMIT 1;

  INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated', 'authenticated',
    '9900000002@rider.shreejientserv.in',
    crypt('rider123', gen_salt('bf')),
    NOW(),
    '{"provider": "email", "providers": ["email"]}',
    '{"role": "rider"}',
    NOW(), NOW()
  ) RETURNING id INTO rider_user_id;

  INSERT INTO riders (
    user_id, first_name, last_name, mobile, email,
    pidge_rider_id, city, hub, current_scheme_id,
    status, wallet_balance, frozen_balance
  ) VALUES (
    rider_user_id,
    'Amit', 'Patel',
    '9900000002',
    '9900000002@rider.shreejientserv.in',
    'TEST002',
    'Mumbai', 'Bandra',
    scheme_id,
    'active', 8500.00, 0.00
  ) RETURNING id INTO rider_id;

  -- Add weekly transactions
  INSERT INTO daily_transactions (rider_id, date, pidge_orders, pidge_distance_km, pidge_daily_earning, pidge_daily_incentive, pidge_total, slab_amount, final_payout)
  VALUES 
    (rider_id, '2025-11-17', 18, 36.0, 630.00, 100.00, 730.00, 850.00, 850.00),
    (rider_id, '2025-11-18', 20, 40.0, 700.00, 110.00, 810.00, 920.00, 920.00),
    (rider_id, '2025-11-19', 17, 34.0, 595.00, 95.00, 690.00, 800.00, 800.00),
    (rider_id, '2025-11-20', 19, 38.0, 665.00, 105.00, 770.00, 880.00, 880.00),
    (rider_id, '2025-11-21', 21, 42.0, 735.00, 115.00, 850.00, 950.00, 950.00),
    (rider_id, '2025-11-22', 16, 32.0, 560.00, 90.00, 650.00, 750.00, 750.00),
    (rider_id, '2025-11-23', 15, 30.0, 525.00, 85.00, 610.00, 700.00, 700.00);

  RAISE NOTICE 'Rider 2 (Medium Performer) created - rider2@test.com';
END $$;

-- Rider 3: Low Performer (Based on Imran Kasam 33073)
-- Email: rider3@test.com | Password: rider123
DO $$
DECLARE
  rider_user_id UUID;
  rider_id UUID;
  scheme_id UUID;
BEGIN
  SELECT id INTO scheme_id FROM schemes WHERE name = 'Regular Scheme' LIMIT 1;

  INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated', 'authenticated',
    '9900000003@rider.shreejientserv.in',
    crypt('rider123', gen_salt('bf')),
    NOW(),
    '{"provider": "email", "providers": ["email"]}',
    '{"role": "rider"}',
    NOW(), NOW()
  ) RETURNING id INTO rider_user_id;

  INSERT INTO riders (
    user_id, first_name, last_name, mobile, email,
    pidge_rider_id, city, hub, current_scheme_id,
    status, wallet_balance, frozen_balance
  ) VALUES (
    rider_user_id,
    'Vikram', 'Singh',
    '9900000003',
    '9900000003@rider.shreejientserv.in',
    'TEST003',
    'Mumbai', 'Powai',
    scheme_id,
    'active', 3200.00, 0.00
  ) RETURNING id INTO rider_id;

  -- Add weekly transactions (lower performance)
  INSERT INTO daily_transactions (rider_id, date, pidge_orders, pidge_distance_km, pidge_daily_earning, pidge_daily_incentive, pidge_total, slab_amount, final_payout)
  VALUES 
    (rider_id, '2025-11-17', 8, 16.0, 280.00, 50.00, 330.00, 400.00, 400.00),
    (rider_id, '2025-11-18', 10, 20.0, 350.00, 60.00, 410.00, 480.00, 480.00),
    (rider_id, '2025-11-19', 7, 14.0, 245.00, 45.00, 290.00, 350.00, 350.00),
    (rider_id, '2025-11-20', 9, 18.0, 315.00, 55.00, 370.00, 440.00, 440.00),
    (rider_id, '2025-11-21', 11, 22.0, 385.00, 65.00, 450.00, 520.00, 520.00),
    (rider_id, '2025-11-22', 6, 12.0, 210.00, 40.00, 250.00, 300.00, 300.00),
    (rider_id, '2025-11-23', 5, 10.0, 175.00, 35.00, 210.00, 250.00, 250.00);

  RAISE NOTICE 'Rider 3 (Low Performer) created - rider3@test.com';
END $$;

-- Rider 4: With MDND Case (Based on Mahendra Gupta 28536)
-- Email: rider4@test.com | Password: rider123
DO $$
DECLARE
  rider_user_id UUID;
  rider_id UUID;
  scheme_id UUID;
BEGIN
  SELECT id INTO scheme_id FROM schemes WHERE name = 'Regular Scheme' LIMIT 1;

  INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated', 'authenticated',
    '9900000004@rider.shreejientserv.in',
    crypt('rider123', gen_salt('bf')),
    NOW(),
    '{"provider": "email", "providers": ["email"]}',
    '{"role": "rider"}',
    NOW(), NOW()
  ) RETURNING id INTO rider_user_id;

  INSERT INTO riders (
    user_id, first_name, last_name, mobile, email,
    pidge_rider_id, city, hub, current_scheme_id,
    status, wallet_balance, frozen_balance
  ) VALUES (
    rider_user_id,
    'Suresh', 'Gupta',
    '9900000004',
    '9900000004@rider.shreejientserv.in',
    'TEST004',
    'Mumbai', 'Goregaon',
    scheme_id,
    'active', 6500.00, 350.00
  ) RETURNING id INTO rider_id;

  -- Add weekly transactions
  INSERT INTO daily_transactions (rider_id, date, pidge_orders, pidge_distance_km, pidge_daily_earning, pidge_daily_incentive, pidge_total, slab_amount, final_payout)
  VALUES 
    (rider_id, '2025-11-17', 15, 30.0, 525.00, 85.00, 610.00, 700.00, 700.00),
    (rider_id, '2025-11-18', 16, 32.0, 560.00, 90.00, 650.00, 750.00, 750.00),
    (rider_id, '2025-11-19', 14, 28.0, 490.00, 80.00, 570.00, 650.00, 650.00),
    (rider_id, '2025-11-20', 17, 34.0, 595.00, 95.00, 690.00, 800.00, 800.00),
    (rider_id, '2025-11-21', 13, 26.0, 455.00, 75.00, 530.00, 600.00, 600.00),
    (rider_id, '2025-11-22', 18, 36.0, 630.00, 100.00, 730.00, 850.00, 850.00),
    (rider_id, '2025-11-23', 12, 24.0, 420.00, 70.00, 490.00, 550.00, 550.00);

  -- Add MDND cases
  INSERT INTO mdnd_cases (rider_id, date, order_id, penalty_amount, status, frozen_amount, is_weekly_bonus_loss)
  VALUES 
    (rider_id, '2025-11-20', 'ORD789012', 200.00, 'pending', 200.00, FALSE),
    (rider_id, '2025-11-22', 'ORD789013', 150.00, 'disputed', 150.00, FALSE);

  RAISE NOTICE 'Rider 4 (With MDND) created - rider4@test.com';
END $$;

-- Rider 5: New Rider (Limited history)
-- Email: rider5@test.com | Password: rider123
DO $$
DECLARE
  rider_user_id UUID;
  rider_id UUID;
  scheme_id UUID;
BEGIN
  SELECT id INTO scheme_id FROM schemes WHERE name = 'Regular Scheme' LIMIT 1;

  INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated', 'authenticated',
    '9900000005@rider.shreejientserv.in',
    crypt('rider123', gen_salt('bf')),
    NOW(),
    '{"provider": "email", "providers": ["email"]}',
    '{"role": "rider"}',
    NOW(), NOW()
  ) RETURNING id INTO rider_user_id;

  INSERT INTO riders (
    user_id, first_name, last_name, mobile, email,
    pidge_rider_id, city, hub, current_scheme_id,
    status, wallet_balance, frozen_balance
  ) VALUES (
    rider_user_id,
    'Priya', 'Desai',
    '9900000005',
    '9900000005@rider.shreejientserv.in',
    'TEST005',
    'Mumbai', 'Malad',
    scheme_id,
    'active', 1200.00, 0.00
  ) RETURNING id INTO rider_id;

  -- Add only last 3 days (new rider)
  INSERT INTO daily_transactions (rider_id, date, pidge_orders, pidge_distance_km, pidge_daily_earning, pidge_daily_incentive, pidge_total, slab_amount, final_payout)
  VALUES 
    (rider_id, '2025-11-21', 5, 10.0, 175.00, 35.00, 210.00, 250.00, 250.00),
    (rider_id, '2025-11-22', 8, 16.0, 280.00, 50.00, 330.00, 400.00, 400.00),
    (rider_id, '2025-11-23', 10, 20.0, 350.00, 60.00, 410.00, 550.00, 550.00);

  RAISE NOTICE 'Rider 5 (New Rider) created - rider5@test.com';
END $$;

-- ============================================
-- STEP 4: Create Referral Campaigns
-- ============================================
INSERT INTO referral_campaigns (
  title, description, target_audience, rule_config,
  start_date, end_date, is_published
) VALUES 
(
  'Monsoon Rider Hunt 2024',
  'Refer a new rider and earn ₹500 when they complete 50 orders in their first month!',
  'all',
  '{"type": "one_time", "amount": 500, "condition_orders": 50}'::jsonb,
  CURRENT_DATE - 10,
  CURRENT_DATE + 20,
  TRUE
),
(
  'Weekly Bonus Campaign',
  'Earn ₹100 every week for each active referred rider',
  'rider_only',
  '{"type": "recurring", "amount": 100, "frequency": "weekly"}'::jsonb,
  CURRENT_DATE - 5,
  CURRENT_DATE + 85,
  TRUE
),
(
  'Agency Recruitment Bonus',
  'Agencies earn ₹1000 for every rider who completes 100 orders',
  'agency_only',
  '{"type": "one_time", "amount": 1000, "condition_orders": 100}'::jsonb,
  CURRENT_DATE,
  CURRENT_DATE + 30,
  FALSE
);

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
SELECT '✅ Setup Complete!' as status;
SELECT '👤 Admin:' as type, email, raw_user_meta_data->>'role' as role FROM auth.users WHERE email = 'admin@test.com';
SELECT '🏢 Agency:' as type, email, raw_user_meta_data->>'role' as role FROM auth.users WHERE email = 'agency@test.com';
SELECT '🚴 Riders:' as type, COUNT(*)::text || ' riders created' as info FROM riders;
SELECT '📊 Transactions:' as type, COUNT(*)::text || ' daily transactions' as info FROM daily_transactions;
SELECT '⚠️  MDND Cases:' as type, COUNT(*)::text || ' cases' as info FROM mdnd_cases;
SELECT '📢 Campaigns:' as type, COUNT(*)::text || ' campaigns' as info FROM referral_campaigns;

-- ============================================
-- LOGIN CREDENTIALS
-- ============================================
-- Admin:  admin@test.com / admin123
-- Agency: agency@test.com / agency123
-- Rider1: rider1@test.com / rider123 (High Performer)
-- Rider2: rider2@test.com / rider123 (Medium Performer)
-- Rider3: rider3@test.com / rider123 (Low Performer)
-- Rider4: rider4@test.com / rider123 (With MDND)
-- Rider5: rider5@test.com / rider123 (New Rider)
-- ============================================
