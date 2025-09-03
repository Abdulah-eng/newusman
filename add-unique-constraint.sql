-- Add unique constraint to prevent duplicate orders by stripe_session_id
-- This will prevent duplicate orders even if the application logic fails

-- First, remove any existing duplicate orders (keep the latest one)
DELETE FROM orders 
WHERE id NOT IN (
    SELECT DISTINCT ON (stripe_session_id) id 
    FROM orders 
    WHERE stripe_session_id IS NOT NULL 
    ORDER BY stripe_session_id, created_at DESC
);

-- Add unique constraint
ALTER TABLE orders ADD CONSTRAINT unique_stripe_session_id UNIQUE (stripe_session_id);

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_orders_stripe_session_id ON orders(stripe_session_id);
