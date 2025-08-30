-- Migration: Add important notices table for products
-- This table will store multiple important notices for each product

-- Create table for product important notices
CREATE TABLE IF NOT EXISTS product_important_notices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    notice_text TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_product_important_notices_product_id ON product_important_notices(product_id);
CREATE INDEX IF NOT EXISTS idx_product_important_notices_sort_order ON product_important_notices(sort_order);

-- Enable Row Level Security
ALTER TABLE product_important_notices ENABLE ROW LEVEL SECURITY;

-- Create policy for the important notices table
CREATE POLICY "Allow all operations on product_important_notices"
ON product_important_notices FOR ALL USING (true);

-- Add comment to the table
COMMENT ON TABLE product_important_notices IS 'Stores important notices for products in the Dimensions section';
