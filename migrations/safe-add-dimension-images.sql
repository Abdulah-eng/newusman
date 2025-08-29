-- Safe Migration: Add dimension images and editable headings to product_dimensions table
-- Date: 2024-01-XX
-- This migration safely adds new columns and tables, checking for existence first

-- Check if product_dimensions table exists, if not create it
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'product_dimensions') THEN
        CREATE TABLE product_dimensions (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            product_id UUID NOT NULL,
            height VARCHAR(50),
            length VARCHAR(50),
            width VARCHAR(50),
            mattress_size VARCHAR(100),
            maximum_height VARCHAR(50),
            weight_capacity VARCHAR(50),
            pocket_springs VARCHAR(100),
            comfort_layer VARCHAR(100),
            support_layer VARCHAR(100),
            mattress_size_heading VARCHAR(100) DEFAULT 'Mattress Size',
            maximum_height_heading VARCHAR(100) DEFAULT 'Maximum Height',
            weight_capacity_heading VARCHAR(100) DEFAULT 'Weight Capacity',
            pocket_springs_heading VARCHAR(100) DEFAULT 'Pocket Springs',
            comfort_layer_heading VARCHAR(100) DEFAULT 'Comfort Layer',
            support_layer_heading VARCHAR(100) DEFAULT 'Support Layer',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- Add foreign key constraint
        ALTER TABLE product_dimensions 
        ADD CONSTRAINT fk_product_dimensions_product_id 
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;
        
        -- Add unique constraint
        ALTER TABLE product_dimensions 
        ADD CONSTRAINT uk_product_dimensions_product_id UNIQUE (product_id);
        
        RAISE NOTICE 'Created product_dimensions table';
    ELSE
        RAISE NOTICE 'product_dimensions table already exists';
    END IF;
END $$;

-- Add new columns to product_dimensions table for editable headings (only if they don't exist)
DO $$ 
BEGIN
    -- Check and add mattress_size_heading column
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'product_dimensions' AND column_name = 'mattress_size_heading') THEN
        ALTER TABLE product_dimensions ADD COLUMN mattress_size_heading VARCHAR(100) DEFAULT 'Mattress Size';
        RAISE NOTICE 'Added mattress_size_heading column';
    ELSE
        RAISE NOTICE 'mattress_size_heading column already exists';
    END IF;
    
    -- Check and add maximum_height_heading column
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'product_dimensions' AND column_name = 'maximum_height_heading') THEN
        ALTER TABLE product_dimensions ADD COLUMN maximum_height_heading VARCHAR(100) DEFAULT 'Maximum Height';
        RAISE NOTICE 'Added maximum_height_heading column';
    ELSE
        RAISE NOTICE 'maximum_height_heading column already exists';
    END IF;
    
    -- Check and add weight_capacity_heading column
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'product_dimensions' AND column_name = 'weight_capacity_heading') THEN
        ALTER TABLE product_dimensions ADD COLUMN weight_capacity_heading VARCHAR(100) DEFAULT 'Weight Capacity';
        RAISE NOTICE 'Added weight_capacity_heading column';
    ELSE
        RAISE NOTICE 'weight_capacity_heading column already exists';
    END IF;
    
    -- Check and add pocket_springs_heading column
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'product_dimensions' AND column_name = 'pocket_springs_heading') THEN
        ALTER TABLE product_dimensions ADD COLUMN pocket_springs_heading VARCHAR(100) DEFAULT 'Pocket Springs';
        RAISE NOTICE 'Added pocket_springs_heading column';
    ELSE
        RAISE NOTICE 'pocket_springs_heading column already exists';
    END IF;
    
    -- Check and add comfort_layer_heading column
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'product_dimensions' AND column_name = 'comfort_layer_heading') THEN
        ALTER TABLE product_dimensions ADD COLUMN comfort_layer_heading VARCHAR(100) DEFAULT 'Comfort Layer';
        RAISE NOTICE 'Added comfort_layer_heading column';
    ELSE
        RAISE NOTICE 'comfort_layer_heading column already exists';
    END IF;
    
    -- Check and add support_layer_heading column
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'product_dimensions' AND column_name = 'support_layer_heading') THEN
        ALTER TABLE product_dimensions ADD COLUMN support_layer_heading VARCHAR(100) DEFAULT 'Support Layer';
        RAISE NOTICE 'Added support_layer_heading column';
    ELSE
        RAISE NOTICE 'support_layer_heading column already exists';
    END IF;
END $$;

-- Create table for dimension images (only if it doesn't exist)
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

-- Add indexes for better performance (only if they don't exist)
CREATE INDEX IF NOT EXISTS idx_product_dimension_images_product_id ON product_dimension_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_dimension_images_sort_order ON product_dimension_images(sort_order);

-- Enable RLS on the new table
ALTER TABLE product_dimension_images ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for the new table (only if it doesn't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'product_dimension_images' AND policyname = 'Allow all operations on product_dimension_images') THEN
        CREATE POLICY "Allow all operations on product_dimension_images" 
        ON product_dimension_images FOR ALL USING (true);
        RAISE NOTICE 'Created RLS policy for product_dimension_images';
    ELSE
        RAISE NOTICE 'RLS policy for product_dimension_images already exists';
    END IF;
END $$;

-- Add comments for documentation
COMMENT ON COLUMN product_dimensions.mattress_size_heading IS 'Editable heading for mattress size field';
COMMENT ON COLUMN product_dimensions.maximum_height_heading IS 'Editable heading for maximum height field';
COMMENT ON COLUMN product_dimensions.weight_capacity_heading IS 'Editable heading for weight capacity field';
COMMENT ON COLUMN product_dimensions.pocket_springs_heading IS 'Editable heading for pocket springs field';
COMMENT ON COLUMN product_dimensions.comfort_layer_heading IS 'Editable heading for comfort layer field';
COMMENT ON COLUMN product_dimensions.support_layer_heading IS 'Editable heading for support layer field';
COMMENT ON TABLE product_dimension_images IS 'Stores images for the Dimensions & Specifications section';

-- Success message
SELECT 'Safe migration completed successfully!' as status;
