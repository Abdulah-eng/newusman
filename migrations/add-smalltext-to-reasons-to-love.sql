-- Migration: Add smalltext column to product_reasons_to_love table
-- This adds a small descriptive text field that will be displayed below the icon in feature cards

-- Add the smalltext column
ALTER TABLE product_reasons_to_love 
ADD COLUMN IF NOT EXISTS smalltext TEXT;

-- Add a comment to describe the column
COMMENT ON COLUMN product_reasons_to_love.smalltext IS 'Small descriptive text displayed below the icon in feature cards on the product page';

-- Create an index on the smalltext column for performance
CREATE INDEX IF NOT EXISTS idx_product_reasons_smalltext ON product_reasons_to_love(smalltext);

-- Update existing records to have a default smalltext if needed
UPDATE product_reasons_to_love 
SET smalltext = 'Premium quality feature' 
WHERE smalltext IS NULL;

-- Verify the column was added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'product_reasons_to_love' 
AND column_name = 'smalltext';
