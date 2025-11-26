-- Add bank account fields to riders table
ALTER TABLE riders ADD COLUMN IF NOT EXISTS bank_account_number VARCHAR(20);
ALTER TABLE riders ADD COLUMN IF NOT EXISTS bank_ifsc VARCHAR(11);
ALTER TABLE riders ADD COLUMN IF NOT EXISTS bank_name VARCHAR(100);
ALTER TABLE riders ADD COLUMN IF NOT EXISTS bank_account_holder VARCHAR(100);
ALTER TABLE riders ADD COLUMN IF NOT EXISTS bank_verified BOOLEAN DEFAULT false;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_riders_bank_verified ON riders(bank_verified);
