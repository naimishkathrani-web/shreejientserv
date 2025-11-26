-- ============================================
-- Update existing test users to fix email format
-- Run this instead of deleting and recreating
-- ============================================

-- Update Rider 1 auth user email
UPDATE auth.users 
SET email = '9900000001@rider.shreejientserv.in'
WHERE email = 'rider1@test.com';

-- Update Rider 1 rider record email
UPDATE riders 
SET email = '9900000001@rider.shreejientserv.in'
WHERE mobile = '9900000001';

-- Update Rider 2 auth user email
UPDATE auth.users 
SET email = '9900000002@rider.shreejientserv.in'
WHERE email = 'rider2@test.com';

-- Update Rider 2 rider record email
UPDATE riders 
SET email = '9900000002@rider.shreejientserv.in'
WHERE mobile = '9900000002';

-- Update Rider 3 auth user email
UPDATE auth.users 
SET email = '9900000003@rider.shreejientserv.in'
WHERE email = 'rider3@test.com';

-- Update Rider 3 rider record email
UPDATE riders 
SET email = '9900000003@rider.shreejientserv.in'
WHERE mobile = '9900000003';

-- Update Rider 4 auth user email
UPDATE auth.users 
SET email = '9900000004@rider.shreejientserv.in'
WHERE email = 'rider4@test.com';

-- Update Rider 4 rider record email
UPDATE riders 
SET email = '9900000004@rider.shreejientserv.in'
WHERE mobile = '9900000004';

-- Update Rider 5 auth user email
UPDATE auth.users 
SET email = '9900000005@rider.shreejientserv.in'
WHERE email = 'rider5@test.com';

-- Update Rider 5 rider record email
UPDATE riders 
SET email = '9900000005@rider.shreejientserv.in'
WHERE mobile = '9900000005';

-- Verify updates
SELECT 'Updated auth users:' as info, email FROM auth.users WHERE email LIKE '%@rider.shreejientserv.in';
SELECT 'Updated riders:' as info, first_name, last_name, mobile, email FROM riders WHERE pidge_rider_id LIKE 'TEST%';
