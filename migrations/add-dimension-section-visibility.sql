-- Migration: Add dimension section visibility control fields
-- Date: 2024-01-XX
-- This migration adds boolean fields to control which dimension sections are visible on the product page

-- Add visibility control columns to product_dimensions table
ALTER TABLE product_dimensions
ADD COLUMN IF NOT EXISTS show_basic_dimensions BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS show_mattress_specs BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS show_technical_specs BOOLEAN DEFAULT TRUE;

-- Add comments for documentation
COMMENT ON COLUMN product_dimensions.show_basic_dimensions IS 'Controls visibility of basic dimensions section (Height, Length, Width)';
COMMENT ON COLUMN product_dimensions.show_mattress_specs IS 'Controls visibility of mattress specifications section (Mattress Size, Maximum Height, Weight Capacity)';
COMMENT ON COLUMN product_dimensions.show_technical_specs IS 'Controls visibility of technical specifications section (Pocket Springs, Comfort Layer, Support Layer)';

-- Update existing records to have all sections visible by default
UPDATE product_dimensions 
SET 
    show_basic_dimensions = TRUE,
    show_mattress_specs = TRUE,
    show_technical_specs = TRUE
WHERE show_basic_dimensions IS NULL 
   OR show_mattress_specs IS NULL 
   OR show_technical_specs IS NULL;
