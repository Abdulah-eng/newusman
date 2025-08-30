-- Migration: Add icon column to product_reasons_to_love table
-- This adds an icon field that will store the icon type selected in the admin panel

-- Add the icon column
ALTER TABLE product_reasons_to_love
ADD COLUMN IF NOT EXISTS icon VARCHAR(100);

-- Add a comment to describe the column
COMMENT ON COLUMN product_reasons_to_love.icon IS 'Icon type selected in admin panel for the feature (e.g., springs, brain, sliders, etc.)';

-- Create an index on the icon column for performance
CREATE INDEX IF NOT EXISTS idx_product_reasons_icon ON product_reasons_to_love(icon);

-- Verify the column was added
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'product_reasons_to_love'
AND column_name = 'icon';

