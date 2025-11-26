-- Create RPC function for incrementing wallet balance
-- This ensures atomic updates and prevents race conditions

CREATE OR REPLACE FUNCTION increment_wallet(
    p_rider_id UUID,
    p_amount DECIMAL
)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE riders
    SET wallet_balance = COALESCE(wallet_balance, 0) + p_amount
    WHERE id = p_rider_id;
END;
$$;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_daily_transactions_rider_date 
ON daily_transactions(rider_id, date);

-- Create index for pidge_rider_id lookups
CREATE INDEX IF NOT EXISTS idx_riders_pidge_id 
ON riders(pidge_rider_id);
