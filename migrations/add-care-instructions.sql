-- Add care_instructions field to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS care_instructions TEXT;

-- Add comment to document the field
COMMENT ON COLUMN products.care_instructions IS 'Stores care and maintenance instructions for the product (e.g., "Rotate your mattress every 3-6 months, use a mattress protector, and clean spills immediately")';
