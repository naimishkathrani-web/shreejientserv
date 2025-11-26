-- Complete setup for test rider 9900000010
-- Run this entire script in Supabase SQL Editor

-- Step 1: Update user metadata to add role
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || '{"role": "rider"}'::jsonb
WHERE email = '9900000010@rider.shreejientserv.in';

-- Step 2: Create rider record (automatically gets user ID)
DO $$
DECLARE
  v_user_id UUID;
  v_scheme_id UUID;
BEGIN
  -- Get user ID
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = '9900000010@rider.shreejientserv.in';

  -- Get scheme ID
  SELECT id INTO v_scheme_id
  FROM schemes
  WHERE name = 'Regular Scheme'
  LIMIT 1;

  -- Delete existing rider if exists
  DELETE FROM riders WHERE mobile = '9900000010';

  -- Create rider record
  INSERT INTO riders (
    user_id,
    first_name,
    last_name,
    mobile,
    email,
    pidge_rider_id,
    city,
    hub,
    status,
    wallet_balance,
    frozen_balance,
    current_scheme_id
  ) VALUES (
    v_user_id,
    'Test',
    'Rider',
    '9900000010',
    '9900000010@rider.shreejientserv.in',
    'TEST010',
    'Mumbai',
    'Andheri',
    'active',
    5000.00,
    0.00,
    v_scheme_id
  );

  RAISE NOTICE 'Test rider created successfully!';
END $$;

-- Step 3: Verify
SELECT 
  r.first_name,
  r.last_name,
  r.mobile,
  r.email,
  r.wallet_balance,
  u.raw_user_meta_data->>'role' as role
FROM riders r
JOIN auth.users u ON r.user_id = u.id
WHERE r.mobile = '9900000010';

-- ============================================
-- ✅ LOGIN CREDENTIALS
-- ============================================
-- Mobile: 9900000010
-- Password: rider123
-- OTP: 123456 (in development)
-- ============================================
