-- Migration: Add length, width, height, and availability fields to product_variants table
-- Date: 2024-01-XX

-- Add new columns to product_variants table
ALTER TABLE product_variants 
ADD COLUMN IF NOT EXISTS length VARCHAR(100),
ADD COLUMN IF NOT EXISTS width VARCHAR(100),
ADD COLUMN IF NOT EXISTS height VARCHAR(100),
ADD COLUMN IF NOT EXISTS availability BOOLEAN DEFAULT TRUE;

-- Update existing rows to have availability = true
UPDATE product_variants 
SET availability = TRUE 
WHERE availability IS NULL;

-- Add comments for documentation
COMMENT ON COLUMN product_variants.length IS 'Length of the product variant';
COMMENT ON COLUMN product_variants.width IS 'Width of the product variant';
COMMENT ON COLUMN product_variants.height IS 'Height of the product variant';
COMMENT ON COLUMN product_variants.availability IS 'Whether this variant is available for purchase';
