-- Add tracking and dispatch columns to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS tracking_number TEXT,
ADD COLUMN IF NOT EXISTS dispatched_at TIMESTAMP WITH TIME ZONE;

-- Add comments for documentation
COMMENT ON COLUMN orders.tracking_number IS 'Tracking number for dispatched orders';
COMMENT ON COLUMN orders.dispatched_at IS 'Timestamp when order was dispatched';

-- Update existing orders to have default values
UPDATE orders 
SET tracking_number = NULL, 
    dispatched_at = NULL 
WHERE tracking_number IS NULL OR dispatched_at IS NULL;
