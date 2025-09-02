-- Add product information columns to order_items table
ALTER TABLE order_items 
ADD COLUMN IF NOT EXISTS product_name TEXT,
ADD COLUMN IF NOT EXISTS product_size TEXT,
ADD COLUMN IF NOT EXISTS product_color TEXT,
ADD COLUMN IF NOT EXISTS total_price DECIMAL(10,2);

-- Add comments for documentation
COMMENT ON COLUMN order_items.product_name IS 'Name of the product ordered';
COMMENT ON COLUMN order_items.product_size IS 'Size variant of the product';
COMMENT ON COLUMN order_items.product_color IS 'Color variant of the product';
COMMENT ON COLUMN order_items.total_price IS 'Total price for this item (unit_price * quantity)';

-- Update existing order items to have default values
UPDATE order_items 
SET product_name = 'Unknown Product',
    product_size = NULL,
    product_color = NULL,
    total_price = unit_price * quantity
WHERE product_name IS NULL OR total_price IS NULL;
