-- Reset all rider passwords to their Pidge rider IDs
-- This fixes the login issue where passwords don't match

-- For riders with Pidge IDs, set password = pidge_rider_id
-- For test riders, set password = mobile number

-- Note: This needs to be run in Supabase SQL editor as auth.users is protected
-- Manual steps:
-- 1. Go to Supabase Dashboard > SQL Editor
-- 2. Run this query for each rider:

-- Example for TEST001:
-- UPDATE auth.users 
-- SET encrypted_password = crypt('TEST001', gen_salt('bf'))
-- WHERE email = '9900000001@rider.shreejientserv.in';

-- For now, document the working credentials:
-- Mobile: 9999999999, Password: 9999999999 (Test account - WORKING)
-- Mobile: 9900000001, Password: Should be TEST001 (needs manual reset)

-- Alternative: Update login to accept both mobile and Pidge ID as password
