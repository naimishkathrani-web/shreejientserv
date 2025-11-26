# Shreeji Rider Management Platform - Implementation Plan

## 🎯 Project Overview
Building a comprehensive rider management system for Shreeji Enterprise Services to automate operations for Pidge and Vahan delivery partners.

## 📊 Current Status
- **Riders:** ~45 active
- **Weekly Orders:** ~3,900
- **Goal:** 2,000 riders by Dec 2026
- **Break-even Target:** Dec 2025

## 🗄️ Database Schema

### Core Tables

#### 1. Riders
```sql
CREATE TABLE riders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Authentication
  user_id UUID REFERENCES auth.users(id),
  mobile VARCHAR(15) UNIQUE NOT NULL,
  email VARCHAR(255),
  
  -- Personal Info
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  date_of_birth DATE,
  parent_name VARCHAR(200),
  parent_mobile VARCHAR(15),
  
  -- Documents
  aadhar_number VARCHAR(12),
  pan_number VARCHAR(10),
  license_number VARCHAR(20),
  
  -- Address
  permanent_address TEXT,
  current_address TEXT,
  work_location VARCHAR(100),
  
  -- Vehicle
  vehicle_type VARCHAR(50),
  vehicle_number VARCHAR(20),
  
  -- Pidge Integration
  pidge_rider_id VARCHAR(50) UNIQUE,
  
  -- Bank Details
  bank_account_number VARCHAR(20),
  bank_ifsc VARCHAR(11),
  bank_name VARCHAR(100),
  account_holder_name VARCHAR(200),
  
  -- Wallet
  wallet_balance DECIMAL(10,2) DEFAULT 0,
  
  -- Status
  status VARCHAR(20) DEFAULT 'pending', -- pending, active, inactive, suspended
  onboarding_date DATE,
  last_active_date DATE,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID,
  
  CONSTRAINT valid_mobile CHECK (mobile ~ '^[0-9]{10}$'),
  CONSTRAINT valid_aadhar CHECK (aadhar_number IS NULL OR aadhar_number ~ '^[0-9]{12}$'),
  CONSTRAINT valid_pan CHECK (pan_number IS NULL OR pan_number ~ '^[A-Z]{5}[0-9]{4}[A-Z]{1}$')
);
```

#### 2. Rider Documents
```sql
CREATE TABLE rider_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rider_id UUID REFERENCES riders(id) ON DELETE CASCADE,
  
  document_type VARCHAR(50) NOT NULL, -- aadhar, pan, license, rc, insurance, puc, photo
  file_url TEXT NOT NULL,
  file_name VARCHAR(255),
  file_size INTEGER,
  
  verified BOOLEAN DEFAULT FALSE,
  verified_by UUID,
  verified_at TIMESTAMP,
  
  uploaded_at TIMESTAMP DEFAULT NOW()
);
```

#### 3. Rider Contracts
```sql
CREATE TABLE rider_contracts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rider_id UUID REFERENCES riders(id) ON DELETE CASCADE,
  
  contract_type VARCHAR(20) NOT NULL, -- new, existing
  
  -- Contract Details
  acceptance_date DATE NOT NULL,
  signed_location VARCHAR(100),
  
  -- Status
  status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected
  approved_by UUID,
  approved_at TIMESTAMP,
  rejection_reason TEXT,
  
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 4. Payment Slabs (Marketing Incentives)
```sql
CREATE TABLE payment_slabs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  name VARCHAR(100) NOT NULL,
  description TEXT,
  
  active BOOLEAN DEFAULT TRUE,
  start_date DATE NOT NULL,
  end_date DATE,
  
  created_by UUID,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE slab_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slab_id UUID REFERENCES payment_slabs(id) ON DELETE CASCADE,
  
  min_orders INTEGER NOT NULL,
  max_orders INTEGER,
  guaranteed_amount DECIMAL(10,2) NOT NULL,
  
  priority INTEGER DEFAULT 0
);
```

#### 5. Daily Transactions
```sql
CREATE TABLE daily_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  date DATE NOT NULL,
  rider_id UUID REFERENCES riders(id) ON DELETE CASCADE,
  
  -- From Pidge
  pidge_orders INTEGER DEFAULT 0,
  pidge_distance_km DECIMAL(10,2) DEFAULT 0,
  pidge_login_hours DECIMAL(5,2) DEFAULT 0,
  pidge_daily_earning DECIMAL(10,2) DEFAULT 0,
  pidge_daily_incentive DECIMAL(10,2) DEFAULT 0,
  pidge_total DECIMAL(10,2) DEFAULT 0,
  
  -- MDND
  mdnd_orders INTEGER DEFAULT 0,
  mdnd_earning DECIMAL(10,2) DEFAULT 0,
  
  -- Marketing Slab
  applied_slab_id UUID REFERENCES payment_slabs(id),
  slab_amount DECIMAL(10,2),
  
  -- Final Calculation
  final_payout DECIMAL(10,2) NOT NULL,
  payout_source VARCHAR(20), -- pidge, marketing_slab
  
  -- Payment Status
  wallet_credited BOOLEAN DEFAULT FALSE,
  wallet_credited_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(date, rider_id)
);
```

#### 6. Weekly Summary
```sql
CREATE TABLE weekly_summary (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  week_start DATE NOT NULL,
  week_end DATE NOT NULL,
  rider_id UUID REFERENCES riders(id) ON DELETE CASCADE,
  
  -- Working Days
  working_days INTEGER DEFAULT 0,
  worked_thursday BOOLEAN DEFAULT FALSE,
  worked_friday BOOLEAN DEFAULT FALSE,
  worked_saturday BOOLEAN DEFAULT FALSE,
  worked_sunday BOOLEAN DEFAULT FALSE,
  
  -- Totals
  total_orders INTEGER DEFAULT 0,
  total_distance_km DECIMAL(10,2) DEFAULT 0,
  base_payout DECIMAL(10,2) DEFAULT 0,
  daily_incentive DECIMAL(10,2) DEFAULT 0,
  
  -- Weekly Bonus
  eligible_for_weekly_bonus BOOLEAN DEFAULT FALSE,
  weekly_bonus_amount DECIMAL(10,2) DEFAULT 0,
  
  -- Penalties
  total_penalties DECIMAL(10,2) DEFAULT 0,
  
  -- Final
  final_amount DECIMAL(10,2) DEFAULT 0,
  
  -- MIS Import
  mis_imported BOOLEAN DEFAULT FALSE,
  mis_imported_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(week_start, rider_id)
);
```

#### 7. Vendor Weekly Summary
```sql
CREATE TABLE vendor_weekly_summary (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  week_start DATE NOT NULL,
  week_end DATE NOT NULL,
  
  -- Totals
  total_working_days INTEGER DEFAULT 0,
  total_orders INTEGER DEFAULT 0,
  base_payout DECIMAL(10,2) DEFAULT 0,
  daily_incentive DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) DEFAULT 0,
  
  -- Revenue (We Keep)
  management_fees DECIMAL(10,2) DEFAULT 0,
  management_fees_percentage DECIMAL(5,2) DEFAULT 0,
  weekly_incentive DECIMAL(10,2) DEFAULT 0,
  
  -- Deductions
  penalties DECIMAL(10,2) DEFAULT 0,
  pending_amount DECIMAL(10,2) DEFAULT 0,
  monthly_incentive DECIMAL(10,2) DEFAULT 0,
  vendor_referal_bonus DECIMAL(10,2) DEFAULT 0,
  
  -- Final
  final_payout DECIMAL(10,2) DEFAULT 0,
  
  -- Invoice & Payment
  invoice_number VARCHAR(50),
  invoice_date DATE,
  invoice_url TEXT,
  payment_received BOOLEAN DEFAULT FALSE,
  payment_received_date DATE,
  payment_amount DECIMAL(10,2),
  
  -- MIS
  mis_imported BOOLEAN DEFAULT FALSE,
  mis_imported_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(week_start)
);
```

#### 8. Payouts (Wallet Transactions)
```sql
CREATE TABLE payouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rider_id UUID REFERENCES riders(id) ON DELETE CASCADE,
  
  transaction_type VARCHAR(20) NOT NULL, -- credit, debit, withdrawal
  amount DECIMAL(10,2) NOT NULL,
  
  -- Source
  source_type VARCHAR(50), -- daily_payout, weekly_bonus, penalty, withdrawal
  source_id UUID, -- Reference to daily_transaction, weekly_summary, etc.
  
  -- Bank Transfer (for withdrawals)
  bank_transfer_initiated BOOLEAN DEFAULT FALSE,
  bank_transfer_id VARCHAR(100),
  bank_transfer_status VARCHAR(20), -- pending, success, failed
  bank_transfer_at TIMESTAMP,
  
  -- Balance
  balance_before DECIMAL(10,2),
  balance_after DECIMAL(10,2),
  
  notes TEXT,
  
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 9. MDND Cases
```sql
CREATE TABLE mdnd_cases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  date DATE NOT NULL,
  rider_id UUID REFERENCES riders(id) ON DELETE CASCADE,
  
  order_id VARCHAR(100),
  penalty_amount DECIMAL(10,2) NOT NULL,
  
  status VARCHAR(20) DEFAULT 'pending', -- pending, deducted, disputed, resolved
  
  deducted_from_wallet BOOLEAN DEFAULT FALSE,
  deducted_at TIMESTAMP,
  
  dispute_raised BOOLEAN DEFAULT FALSE,
  dispute_notes TEXT,
  resolution_notes TEXT,
  resolved_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 10. Expenses
```sql
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  date DATE NOT NULL,
  category VARCHAR(50) NOT NULL, -- rent, electricity, airtel, salaries, referral, other
  description TEXT,
  amount DECIMAL(10,2) NOT NULL,
  
  vendor_name VARCHAR(200),
  invoice_number VARCHAR(50),
  invoice_url TEXT,
  
  payment_status VARCHAR(20) DEFAULT 'pending', -- pending, paid
  payment_date DATE,
  payment_mode VARCHAR(50),
  
  created_by UUID,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 11. Support Tickets
```sql
CREATE TABLE support_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  rider_id UUID REFERENCES riders(id) ON DELETE CASCADE,
  
  subject VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(50), -- payment, technical, document, other
  priority VARCHAR(20) DEFAULT 'medium', -- low, medium, high, urgent
  
  status VARCHAR(20) DEFAULT 'open', -- open, in_progress, resolved, closed
  
  assigned_to UUID,
  resolved_by UUID,
  resolved_at TIMESTAMP,
  resolution_notes TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🔐 Row Level Security (RLS)

```sql
-- Enable RLS on all tables
ALTER TABLE riders ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

-- Riders can only see their own data
CREATE POLICY "Riders can view own data" ON riders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Riders can view own transactions" ON daily_transactions
  FOR SELECT USING (rider_id IN (SELECT id FROM riders WHERE user_id = auth.uid()));

CREATE POLICY "Riders can view own payouts" ON payouts
  FOR SELECT USING (rider_id IN (SELECT id FROM riders WHERE user_id = auth.uid()));

-- Admins can see everything (create admin role in auth.users metadata)
CREATE POLICY "Admins can view all" ON riders
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
```

## 📁 File Structure

```
d:\Dev\ShreejiEntServ\
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (rider)/
│   │   │   ├── dashboard/
│   │   │   ├── earnings/
│   │   │   ├── wallet/
│   │   │   ├── profile/
│   │   │   └── support/
│   │   ├── (admin)/
│   │   │   ├── dashboard/
│   │   │   ├── riders/
│   │   │   ├── payments/
│   │   │   ├── mis-import/
│   │   │   ├── analytics/
│   │   │   ├── expenses/
│   │   │   └── settings/
│   │   └── api/
│   │       ├── riders/
│   │       ├── transactions/
│   │       ├── payouts/
│   │       └── mis-import/
│   ├── components/
│   │   ├── rider/
│   │   ├── admin/
│   │   └── shared/
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts
│   │   │   └── server.ts
│   │   ├── payment/
│   │   │   └── razorpay.ts
│   │   └── utils/
│   └── types/
└── supabase/
    ├── migrations/
    └── seed.sql
```

## 🚀 Next Steps

1. Create Supabase tables
2. Set up authentication
3. Build rider dashboard
4. Build admin dashboard
5. Integrate payment gateway
6. MIS import automation

## 📝 Notes

- Project URL: https://supabase.com/dashboard/project/ynuiitgsmudgxaolvhhj
- Publishable Key: sb_publishable_5TC2rAWZux14aSelEqT7bQ_XNmsU-YM
- Need anon key for client-side operations
