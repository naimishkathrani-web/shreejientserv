-- Helper function to deduct wallet balance safely
CREATE OR REPLACE FUNCTION deduct_wallet_balance(p_rider_id UUID, p_amount DECIMAL)
RETURNS VOID AS $$
BEGIN
  UPDATE riders
  SET wallet_balance = wallet_balance - p_amount
  WHERE id = p_rider_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Rider not found';
  END IF;
END;
$$ LANGUAGE plpgsql;
