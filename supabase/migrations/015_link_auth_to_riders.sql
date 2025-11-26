-- Link auth users to rider records
-- This updates the user_id field in riders table

UPDATE riders r
SET user_id = au.id
FROM auth.users au
WHERE au.email = r.email
AND r.user_id IS NULL;

-- Verify the update
SELECT 
    r.pidge_rider_id,
    r.first_name,
    r.mobile,
    r.email,
    CASE WHEN r.user_id IS NOT NULL THEN '✅ Linked' ELSE '❌ Not Linked' END as auth_status
FROM riders r
WHERE r.pidge_rider_id IN ('28536', '28553', '31901', '33623', '35268')
ORDER BY r.pidge_rider_id;
