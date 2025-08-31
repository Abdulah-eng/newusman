-- Add dimension_disclaimer field to product_dimensions table
ALTER TABLE product_dimensions ADD COLUMN IF NOT EXISTS dimension_disclaimer TEXT;

-- Add comment to document the field
COMMENT ON COLUMN product_dimensions.dimension_disclaimer IS 'Stores the disclaimer text for dimension measurements (e.g., "All measurements are approximate and may vary slightly.")';
