-- Update product_variants table to support hex color values
-- This migration ensures the color field can store hex color codes properly

-- Update the color field to support hex color codes (7 characters for #RRGGBB)
ALTER TABLE product_variants 
ALTER COLUMN color TYPE VARCHAR(7);

-- Add a comment to clarify the expected format
COMMENT ON COLUMN product_variants.color IS 'Hex color code (e.g., #FF5733) for variant color selection';

-- Optional: Add a check constraint to ensure valid hex color format
-- This will validate that color values are either NULL or valid hex codes
ALTER TABLE product_variants 
ADD CONSTRAINT check_color_format 
CHECK (color IS NULL OR color ~ '^#[0-9A-Fa-f]{6}$');

-- Create an index on the color field for better performance when filtering by color
CREATE INDEX IF NOT EXISTS idx_product_variants_color ON product_variants(color);

-- Update any existing color values to hex format if they're not already
-- This is a one-time conversion for existing data
UPDATE product_variants 
SET color = CASE 
  WHEN color IS NULL THEN NULL
  WHEN color ~ '^#[0-9A-Fa-f]{6}$' THEN color  -- Already hex format
  WHEN LOWER(color) = 'black' THEN '#000000'
  WHEN LOWER(color) = 'white' THEN '#FFFFFF'
  WHEN LOWER(color) = 'red' THEN '#FF0000'
  WHEN LOWER(color) = 'green' THEN '#00FF00'
  WHEN LOWER(color) = 'blue' THEN '#0000FF'
  WHEN LOWER(color) = 'yellow' THEN '#FFFF00'
  WHEN LOWER(color) = 'orange' THEN '#FFA500'
  WHEN LOWER(color) = 'purple' THEN '#800080'
  WHEN LOWER(color) = 'pink' THEN '#FFC0CB'
  WHEN LOWER(color) = 'brown' THEN '#A52A2A'
  WHEN LOWER(color) = 'gray' OR LOWER(color) = 'grey' THEN '#808080'
  WHEN LOWER(color) = 'silver' THEN '#C0C0C0'
  WHEN LOWER(color) = 'gold' THEN '#FFD700'
  ELSE '#808080'  -- Default to gray for unrecognized colors
END;
