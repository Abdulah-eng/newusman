-- Migration: Add Badge System and Free Gift functionality
-- This migration adds badge management and free gift selection to products

-- Add badge-related fields to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS badges JSONB DEFAULT '[]';
ALTER TABLE products ADD COLUMN IF NOT EXISTS free_gift_product_id UUID REFERENCES products(id);
ALTER TABLE products ADD COLUMN IF NOT EXISTS free_gift_enabled BOOLEAN DEFAULT FALSE;

-- Create free_gifts table to track gift relationships
CREATE TABLE IF NOT EXISTS free_gifts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    gift_product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(product_id, gift_product_id)
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_free_gifts_product_id ON free_gifts(product_id);
CREATE INDEX IF NOT EXISTS idx_free_gifts_gift_product_id ON free_gifts(gift_product_id);

-- Add comment to explain the badges JSONB structure
COMMENT ON COLUMN products.badges IS 'JSON array of badge objects with structure: [{"type": "sale", "enabled": true}, {"type": "new_in", "enabled": true}, {"type": "free_gift", "enabled": true}]';
COMMENT ON COLUMN products.free_gift_product_id IS 'Reference to the product that will be given as a free gift when this product is added to cart';
COMMENT ON COLUMN products.free_gift_enabled IS 'Whether free gift functionality is enabled for this product';
