-- Add trial_information field to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS trial_information TEXT;

-- Add comment to document the field
COMMENT ON COLUMN products.trial_information IS 'Stores the trial information text (e.g., "Try your mattress risk-free for 100 nights. If you are not completely satisfied, return it for a full refund. No questions asked.")';
