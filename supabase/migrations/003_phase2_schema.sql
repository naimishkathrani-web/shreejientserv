-- Phase 2: Agencies, Referrals, Schemes, MDND

-- ============================================
-- 1. AGENCIES TABLE
-- ============================================
CREATE TABLE agencies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- Link to auth user
  
  name VARCHAR(200) NOT NULL,
  contact_person VARCHAR(100),
  mobile VARCHAR(15) NOT NULL,
  email VARCHAR(255),
  
  -- Bank Details for Commission
  bank_account_number VARCHAR(20),
  bank_ifsc VARCHAR(11),
  bank_name VARCHAR(100),
  
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_agencies_user ON agencies(user_id);

-- ============================================
-- 2. SCHEMES TABLE (Client Programs)
-- ============================================
CREATE TABLE schemes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  name VARCHAR(100) NOT NULL, -- e.g., "Regular Scheme", "Backingo"
  description TEXT,
  
  -- Vendor Fees (What we charge the client)
  vendor_fee_type VARCHAR(20) DEFAULT 'percentage', -- percentage, fixed
  vendor_fee_value DECIMAL(10,2) DEFAULT 0,
  
  -- Rider Payout Config (JSON for flexibility)
  -- Structure: { "slabs": [...], "daily_incentive": ..., "guaranteed": ... }
  rider_payout_config JSONB DEFAULT '{}',
  
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Seed Data: Regular Scheme
INSERT INTO schemes (name, description, vendor_fee_type, vendor_fee_value, is_active)
VALUES ('Regular Scheme', 'Standard payout scheme with default management fees', 'percentage', 10.0, TRUE);

-- ============================================
-- 3. RIDER SCHEME HISTORY
-- ============================================
CREATE TABLE rider_scheme_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rider_id UUID REFERENCES riders(id) ON DELETE CASCADE,
  scheme_id UUID REFERENCES schemes(id),
  
  start_date DATE NOT NULL,
  end_date DATE, -- NULL means active
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_scheme_history_rider ON rider_scheme_history(rider_id);

-- ============================================
-- 4. REFERRAL CAMPAIGNS
-- ============================================
CREATE TABLE referral_campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  title VARCHAR(200) NOT NULL,
  description TEXT,
  
  target_audience VARCHAR(50) DEFAULT 'all', -- all, agency_only, rider_only
  
  -- Rule Config
  -- { "type": "one_time", "amount": 500, "condition_orders": 50 }
  -- { "type": "recurring", "amount": 100, "frequency": "weekly", "condition_active": true }
  rule_config JSONB NOT NULL,
  
  start_date DATE NOT NULL,
  end_date DATE,
  
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 5. REFERRAL EARNINGS
-- ============================================
CREATE TABLE referral_earnings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  campaign_id UUID REFERENCES referral_campaigns(id),
  
  -- Beneficiary
  agency_id UUID REFERENCES agencies(id),
  rider_id UUID REFERENCES riders(id),
  
  -- Source (Who triggered the bonus)
  referred_rider_id UUID REFERENCES riders(id),
  
  amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending', -- pending, paid, cancelled
  
  earned_at TIMESTAMP DEFAULT NOW(),
  paid_at TIMESTAMP
);

CREATE INDEX idx_ref_earnings_agency ON referral_earnings(agency_id);
CREATE INDEX idx_ref_earnings_rider ON referral_earnings(rider_id);

-- ============================================
-- 6. UPDATES TO RIDERS TABLE
-- ============================================
ALTER TABLE riders 
ADD COLUMN agency_id UUID REFERENCES agencies(id),
ADD COLUMN current_scheme_id UUID REFERENCES schemes(id),
ADD COLUMN referred_by_rider_id UUID REFERENCES riders(id),
ADD COLUMN city VARCHAR(100),
ADD COLUMN hub VARCHAR(100),
ADD COLUMN frozen_balance DECIMAL(10,2) DEFAULT 0;

CREATE INDEX idx_riders_agency ON riders(agency_id);
CREATE INDEX idx_riders_scheme ON riders(current_scheme_id);

-- ============================================
-- 7. UPDATES TO MDND CASES TABLE
-- ============================================
ALTER TABLE mdnd_cases
ADD COLUMN proof_url TEXT,
ADD COLUMN frozen_amount DECIMAL(10,2) DEFAULT 0,
ADD COLUMN is_weekly_bonus_loss BOOLEAN DEFAULT FALSE;

-- ============================================
-- 8. RLS POLICIES FOR NEW TABLES
-- ============================================

-- Agencies
ALTER TABLE agencies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Agencies can view own profile" ON agencies
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all agencies" ON agencies
  FOR ALL USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

-- Schemes
ALTER TABLE schemes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view active schemes" ON schemes
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Admins can manage schemes" ON schemes
  FOR ALL USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

-- Referral Campaigns
ALTER TABLE referral_campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view published campaigns" ON referral_campaigns
  FOR SELECT USING (is_published = TRUE);

CREATE POLICY "Admins can manage campaigns" ON referral_campaigns
  FOR ALL USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

-- Referral Earnings
ALTER TABLE referral_earnings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Agencies can view own earnings" ON referral_earnings
  FOR SELECT USING (agency_id IN (SELECT id FROM agencies WHERE user_id = auth.uid()));

CREATE POLICY "Riders can view own earnings" ON referral_earnings
  FOR SELECT USING (rider_id IN (SELECT id FROM riders WHERE user_id = auth.uid()));

CREATE POLICY "Admins can view all earnings" ON referral_earnings
  FOR ALL USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');
