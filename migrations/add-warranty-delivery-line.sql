-- Migration: Add warranty_delivery_line field to products table
-- This field will store the warranty, delivery, and trial information line

-- Add the new field to the products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS warranty_delivery_line TEXT;

-- Add comment to the field
COMMENT ON COLUMN products.warranty_delivery_line IS 'Stores the warranty, delivery, and trial information line (e.g., "10-Year Warranty • Free Delivery • 100-Night Trial")';

-- Update existing products with a default value if needed (optional)
-- UPDATE products SET warranty_delivery_line = '10-Year Warranty • Free Delivery • 100-Night Trial' WHERE warranty_delivery_line IS NULL;
