-- ============================================
-- PHASE 3 DATABASE SCHEMA
-- Complete schema for all Phase 3 features
-- ============================================

-- ============================================
-- WITHDRAWAL SYSTEM
-- ============================================

-- System settings table for configurable parameters
CREATE TABLE IF NOT EXISTS system_settings (
  key VARCHAR(100) PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMP DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Insert default withdrawal settings
INSERT INTO system_settings (key, value, description) VALUES
('withdrawal_daily_limit', '{"amount": 500, "full_withdrawal_day": "thursday"}'::jsonb, 'Daily withdrawal limit and full withdrawal day')
ON CONFLICT (key) DO NOTHING;

-- Withdrawal requests table
CREATE TABLE IF NOT EXISTS withdrawal_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rider_id UUID REFERENCES riders(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'rejected')),
  requested_at TIMESTAMP DEFAULT NOW(),
  processed_at TIMESTAMP,
  processed_by UUID REFERENCES auth.users(id),
  transaction_id VARCHAR(100),
  payment_method VARCHAR(50) DEFAULT 'bank_transfer',
  notes TEXT,
  rejection_reason TEXT
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_withdrawal_requests_rider ON withdrawal_requests(rider_id);
CREATE INDEX IF NOT EXISTS idx_withdrawal_requests_status ON withdrawal_requests(status);
CREATE INDEX IF NOT EXISTS idx_withdrawal_requests_date ON withdrawal_requests(requested_at DESC);

-- ============================================
-- SELF-REGISTRATION & VERIFICATION
-- ============================================

-- Add contract and verification fields to riders table
ALTER TABLE riders 
ADD COLUMN IF NOT EXISTS contract_accepted_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS contract_version VARCHAR(10) DEFAULT '1.0',
ADD COLUMN IF NOT EXISTS verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
ADD COLUMN IF NOT EXISTS verified_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS verified_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- Rider documents table
CREATE TABLE IF NOT EXISTS rider_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rider_id UUID REFERENCES riders(id) ON DELETE CASCADE,
  document_type VARCHAR(50) NOT NULL CHECK (document_type IN ('aadhar', 'pan', 'driving_license', 'photo', 'bank_passbook', 'other')),
  document_url TEXT NOT NULL,
  document_number VARCHAR(100),
  uploaded_at TIMESTAMP DEFAULT NOW(),
  verified_by UUID REFERENCES auth.users(id),
  verified_at TIMESTAMP,
  verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  rejection_reason TEXT
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_rider_documents_rider ON rider_documents(rider_id);
CREATE INDEX IF NOT EXISTS idx_rider_documents_status ON rider_documents(verification_status);

-- ============================================
-- FINANCIAL TRANSACTIONS LOG
-- ============================================

-- Financial transactions table for complete audit trail
CREATE TABLE IF NOT EXISTS financial_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rider_id UUID REFERENCES riders(id) ON DELETE CASCADE,
  transaction_type VARCHAR(50) NOT NULL CHECK (transaction_type IN ('earning', 'withdrawal', 'penalty', 'bonus', 'adjustment')),
  amount DECIMAL(10,2) NOT NULL,
  balance_before DECIMAL(10,2) NOT NULL,
  balance_after DECIMAL(10,2) NOT NULL,
  description TEXT,
  reference_id UUID, -- Links to withdrawal_requests, mdnd_cases, etc.
  reference_type VARCHAR(50), -- 'withdrawal', 'mdnd', 'daily_earning', etc.
  created_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_financial_transactions_rider ON financial_transactions(rider_id);
CREATE INDEX IF NOT EXISTS idx_financial_transactions_date ON financial_transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_financial_transactions_type ON financial_transactions(transaction_type);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on new tables
ALTER TABLE withdrawal_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE rider_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Withdrawal requests policies
CREATE POLICY "Riders can view own withdrawal requests"
  ON withdrawal_requests FOR SELECT
  USING (rider_id IN (SELECT id FROM riders WHERE user_id = auth.uid()));

CREATE POLICY "Riders can create withdrawal requests"
  ON withdrawal_requests FOR INSERT
  WITH CHECK (rider_id IN (SELECT id FROM riders WHERE user_id = auth.uid()));

CREATE POLICY "Admins can view all withdrawal requests"
  ON withdrawal_requests FOR SELECT
  USING (EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'role' = 'admin'));

CREATE POLICY "Admins can update withdrawal requests"
  ON withdrawal_requests FOR UPDATE
  USING (EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'role' = 'admin'));

-- Rider documents policies
CREATE POLICY "Riders can view own documents"
  ON rider_documents FOR SELECT
  USING (rider_id IN (SELECT id FROM riders WHERE user_id = auth.uid()));

CREATE POLICY "Riders can upload documents"
  ON rider_documents FOR INSERT
  WITH CHECK (rider_id IN (SELECT id FROM riders WHERE user_id = auth.uid()));

CREATE POLICY "Admins can view all documents"
  ON rider_documents FOR SELECT
  USING (EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'role' = 'admin'));

CREATE POLICY "Admins can update documents"
  ON rider_documents FOR UPDATE
  USING (EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'role' = 'admin'));

-- Financial transactions policies
CREATE POLICY "Riders can view own transactions"
  ON financial_transactions FOR SELECT
  USING (rider_id IN (SELECT id FROM riders WHERE user_id = auth.uid()));

CREATE POLICY "Admins can view all transactions"
  ON financial_transactions FOR SELECT
  USING (EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'role' = 'admin'));

CREATE POLICY "System can insert transactions"
  ON financial_transactions FOR INSERT
  WITH CHECK (true);

-- System settings policies
CREATE POLICY "Everyone can view system settings"
  ON system_settings FOR SELECT
  USING (true);

CREATE POLICY "Only admins can update system settings"
  ON system_settings FOR UPDATE
  USING (EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'role' = 'admin'));

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to get rider's available balance (wallet - frozen)
CREATE OR REPLACE FUNCTION get_available_balance(p_rider_id UUID)
RETURNS DECIMAL(10,2) AS $$
DECLARE
  v_wallet DECIMAL(10,2);
  v_frozen DECIMAL(10,2);
BEGIN
  SELECT wallet_balance, COALESCE(frozen_balance, 0)
  INTO v_wallet, v_frozen
  FROM riders
  WHERE id = p_rider_id;
  
  RETURN COALESCE(v_wallet, 0) - COALESCE(v_frozen, 0);
END;
$$ LANGUAGE plpgsql;

-- Function to check daily withdrawal limit
CREATE OR REPLACE FUNCTION check_withdrawal_limit(p_rider_id UUID, p_amount DECIMAL)
RETURNS BOOLEAN AS $$
DECLARE
  v_daily_limit DECIMAL(10,2);
  v_today_total DECIMAL(10,2);
  v_full_day TEXT;
  v_current_day TEXT;
BEGIN
  -- Get settings
  SELECT (value->>'amount')::DECIMAL INTO v_daily_limit
  FROM system_settings WHERE key = 'withdrawal_daily_limit';
  
  SELECT value->>'full_withdrawal_day' INTO v_full_day
  FROM system_settings WHERE key = 'withdrawal_daily_limit';
  
  -- Get current day
  v_current_day := LOWER(TO_CHAR(CURRENT_DATE, 'Day'));
  v_current_day := TRIM(v_current_day);
  
  -- If today is full withdrawal day, allow any amount
  IF v_current_day = v_full_day THEN
    RETURN TRUE;
  END IF;
  
  -- Get today's total withdrawals
  SELECT COALESCE(SUM(amount), 0) INTO v_today_total
  FROM withdrawal_requests
  WHERE rider_id = p_rider_id
    AND DATE(requested_at) = CURRENT_DATE
    AND status IN ('pending', 'processing', 'completed');
  
  -- Check if new amount would exceed limit
  RETURN (v_today_total + p_amount) <= v_daily_limit;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Verify schema creation
SELECT 'Schema created successfully!' as status;

SELECT 'Tables created:' as info;
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('withdrawal_requests', 'rider_documents', 'financial_transactions', 'system_settings')
ORDER BY table_name;

SELECT 'RLS policies created:' as info;
SELECT tablename, policyname FROM pg_policies 
WHERE tablename IN ('withdrawal_requests', 'rider_documents', 'financial_transactions', 'system_settings')
ORDER BY tablename, policyname;
