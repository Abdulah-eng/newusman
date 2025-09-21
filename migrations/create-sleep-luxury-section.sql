-- Migration: Create Sleep Luxury Section Management
-- This migration adds a table to manage selected products for the Sleep Luxury section

-- Create table for Sleep Luxury section products
CREATE TABLE IF NOT EXISTS sleep_luxury_products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category VARCHAR(50) NOT NULL,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(category, product_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sleep_luxury_products_category ON sleep_luxury_products(category);
CREATE INDEX IF NOT EXISTS idx_sleep_luxury_products_display_order ON sleep_luxury_products(display_order);
CREATE INDEX IF NOT EXISTS idx_sleep_luxury_products_active ON sleep_luxury_products(is_active);

-- Enable Row Level Security
ALTER TABLE sleep_luxury_products ENABLE ROW LEVEL SECURITY;

-- Create policy for the sleep luxury products table
CREATE POLICY "Allow all operations on sleep_luxury_products"
ON sleep_luxury_products FOR ALL USING (true);

-- Add comment to the table
COMMENT ON TABLE sleep_luxury_products IS 'Stores selected products for the Sleep Luxury section, organized by category';

-- Insert some default products for each category (you can modify these IDs as needed)
-- Note: These are placeholder product IDs - replace with actual product IDs from your database
INSERT INTO sleep_luxury_products (category, product_id, display_order) VALUES
('mattresses', (SELECT id FROM products WHERE category_id = (SELECT id FROM categories WHERE slug = 'mattresses') LIMIT 1), 1),
('mattresses', (SELECT id FROM products WHERE category_id = (SELECT id FROM categories WHERE slug = 'mattresses') LIMIT 1 OFFSET 1), 2),
('mattresses', (SELECT id FROM products WHERE category_id = (SELECT id FROM categories WHERE slug = 'mattresses') LIMIT 1 OFFSET 2), 3),
('mattresses', (SELECT id FROM products WHERE category_id = (SELECT id FROM categories WHERE slug = 'mattresses') LIMIT 1 OFFSET 3), 4),
('beds', (SELECT id FROM products WHERE category_id = (SELECT id FROM categories WHERE slug = 'beds') LIMIT 1), 1),
('beds', (SELECT id FROM products WHERE category_id = (SELECT id FROM categories WHERE slug = 'beds') LIMIT 1 OFFSET 1), 2),
('beds', (SELECT id FROM products WHERE category_id = (SELECT id FROM categories WHERE slug = 'beds') LIMIT 1 OFFSET 2), 3),
('beds', (SELECT id FROM products WHERE category_id = (SELECT id FROM categories WHERE slug = 'beds') LIMIT 1 OFFSET 3), 4),
('sofas', (SELECT id FROM products WHERE category_id = (SELECT id FROM categories WHERE slug = 'sofas') LIMIT 1), 1),
('sofas', (SELECT id FROM products WHERE category_id = (SELECT id FROM categories WHERE slug = 'sofas') LIMIT 1 OFFSET 1), 2),
('sofas', (SELECT id FROM products WHERE category_id = (SELECT id FROM categories WHERE slug = 'sofas') LIMIT 1 OFFSET 2), 3),
('sofas', (SELECT id FROM products WHERE category_id = (SELECT id FROM categories WHERE slug = 'sofas') LIMIT 1 OFFSET 3), 4)
ON CONFLICT (category, product_id) DO NOTHING;
