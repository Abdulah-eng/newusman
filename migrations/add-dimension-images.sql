-- Migration: Add dimension images and editable headings to product_dimensions table
-- Date: 2024-01-XX

-- Add new columns to product_dimensions table for editable headings
ALTER TABLE product_dimensions
ADD COLUMN IF NOT EXISTS mattress_size_heading VARCHAR(100) DEFAULT 'Mattress Size',
ADD COLUMN IF NOT EXISTS maximum_height_heading VARCHAR(100) DEFAULT 'Maximum Height',
ADD COLUMN IF NOT EXISTS weight_capacity_heading VARCHAR(100) DEFAULT 'Weight Capacity',
ADD COLUMN IF NOT EXISTS pocket_springs_heading VARCHAR(100) DEFAULT 'Pocket Springs',
ADD COLUMN IF NOT EXISTS comfort_layer_heading VARCHAR(100) DEFAULT 'Comfort Layer',
ADD COLUMN IF NOT EXISTS support_layer_heading VARCHAR(100) DEFAULT 'Support Layer';

-- Create table for dimension images
CREATE TABLE IF NOT EXISTS product_dimension_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    file_name VARCHAR(255),
    file_size INTEGER,
    file_type VARCHAR(100),
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_product_dimension_images_product_id ON product_dimension_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_dimension_images_sort_order ON product_dimension_images(sort_order);

-- Enable RLS on the new table
ALTER TABLE product_dimension_images ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for the new table
CREATE POLICY "Allow all operations on product_dimension_images" 
ON product_dimension_images FOR ALL USING (true);

-- Add comments for documentation
COMMENT ON COLUMN product_dimensions.mattress_size_heading IS 'Editable heading for mattress size field';
COMMENT ON COLUMN product_dimensions.maximum_height_heading IS 'Editable heading for maximum height field';
COMMENT ON COLUMN product_dimensions.weight_capacity_heading IS 'Editable heading for weight capacity field';
COMMENT ON COLUMN product_dimensions.pocket_springs_heading IS 'Editable heading for pocket springs field';
COMMENT ON COLUMN product_dimensions.comfort_layer_heading IS 'Editable heading for comfort layer field';
COMMENT ON COLUMN product_dimensions.support_layer_heading IS 'Editable heading for support layer field';
COMMENT ON TABLE product_dimension_images IS 'Stores images for the Dimensions & Specifications section';
