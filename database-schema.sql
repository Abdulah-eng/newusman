-- Database Schema for Usman Mattresses Product Management System
-- This script can be run multiple times safely

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (in reverse dependency order)
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS product_recommendations CASCADE;
DROP TABLE IF EXISTS product_popular_categories CASCADE;
DROP TABLE IF EXISTS product_dimensions CASCADE;
DROP TABLE IF EXISTS product_warranty_sections CASCADE;
DROP TABLE IF EXISTS product_faqs CASCADE;
DROP TABLE IF EXISTS product_description_paragraphs CASCADE;
DROP TABLE IF EXISTS product_custom_reasons CASCADE;
DROP TABLE IF EXISTS product_reasons_to_love CASCADE;
DROP TABLE IF EXISTS product_features CASCADE;
DROP TABLE IF EXISTS product_variants CASCADE;
DROP TABLE IF EXISTS product_images CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL UNIQUE,
    slug VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert the 6 main categories
INSERT INTO categories (name, slug) VALUES
    ('Mattresses', 'mattresses'),
    ('Beds', 'beds'),
    ('Sofas', 'sofas'),
    ('Pillows', 'pillows'),
    ('Toppers', 'toppers'),
    ('Bunkbeds', 'bunkbeds')
ON CONFLICT (slug) DO NOTHING;

-- Products table (main product information)
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    rating DECIMAL(3,2) CHECK (rating >= 0 AND rating <= 5),
    headline VARCHAR(255),
    long_description TEXT,
    firmness_scale VARCHAR(20) CHECK (firmness_scale IN ('Soft', 'Soft-Medium', 'Medium', 'Medium-Firm', 'Firm', 'Extra-firm')),
    support_level VARCHAR(10) CHECK (support_level IN ('Low', 'Medium', 'High')),
    pressure_relief_level VARCHAR(10) CHECK (pressure_relief_level IN ('Low', 'Medium', 'High')),
    air_circulation_level VARCHAR(10) CHECK (air_circulation_level IN ('Low', 'Medium', 'High')),
    durability_level VARCHAR(10) CHECK (durability_level IN ('Low', 'Medium', 'High')),
    show_in_kids_category BOOLEAN DEFAULT FALSE,
    show_in_sales_category BOOLEAN DEFAULT FALSE,
    selected_mattresses TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product images table
CREATE TABLE IF NOT EXISTS product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    image_url TEXT,
    file_name VARCHAR(255),
    file_size INTEGER,
    file_type VARCHAR(100),
    is_main_image BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product variants table
CREATE TABLE IF NOT EXISTS product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    sku VARCHAR(100) UNIQUE,
    sdi_number VARCHAR(100),
    original_price DECIMAL(10,2) NOT NULL,
    current_price DECIMAL(10,2) NOT NULL,
    color VARCHAR(100),
    depth VARCHAR(100),
    firmness VARCHAR(100),
    size VARCHAR(100),
    length VARCHAR(100),
    width VARCHAR(100),
    height VARCHAR(100),
    availability BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product features table
CREATE TABLE IF NOT EXISTS product_features (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    feature_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product reasons to love table
CREATE TABLE IF NOT EXISTS product_reasons_to_love (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    reason_text VARCHAR(500) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Custom reasons to buy table
CREATE TABLE IF NOT EXISTS product_custom_reasons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    reason_text VARCHAR(500) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product description paragraphs table
CREATE TABLE IF NOT EXISTS product_description_paragraphs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    heading VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    file_name VARCHAR(255),
    file_size INTEGER,
    file_type VARCHAR(100),
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product FAQs table
CREATE TABLE IF NOT EXISTS product_faqs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product warranty sections table
CREATE TABLE IF NOT EXISTS product_warranty_sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    heading VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product dimensions table
CREATE TABLE IF NOT EXISTS product_dimensions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE UNIQUE,
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

-- Product dimension images table
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

-- Product popular categories table
CREATE TABLE IF NOT EXISTS product_popular_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    popular_category_name VARCHAR(100) NOT NULL,
    filter_key VARCHAR(50),
    filter_value VARCHAR(100),
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product recommended products table
CREATE TABLE IF NOT EXISTS product_recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    recommended_product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    category_name VARCHAR(50) NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Homepage Content Management
CREATE TABLE IF NOT EXISTS public.homepage_content (
    id uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
    section character varying(100) NOT NULL,
    content jsonb NOT NULL,
    order_index integer NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT homepage_content_pkey PRIMARY KEY (id),
    CONSTRAINT homepage_content_section_unique UNIQUE (section)
);

-- Index for ordering
CREATE INDEX IF NOT EXISTS idx_homepage_content_order ON public.homepage_content (order_index);

-- Index for section lookup
CREATE INDEX IF NOT EXISTS idx_homepage_content_section ON public.homepage_content (section);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_show_in_kids ON products(show_in_kids_category);
CREATE INDEX IF NOT EXISTS idx_products_show_in_sales ON products(show_in_sales_category);
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_sku ON product_variants(sku);
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_features_product_id ON product_features(product_id);
CREATE INDEX IF NOT EXISTS idx_product_reasons_product_id ON product_reasons_to_love(product_id);
CREATE INDEX IF NOT EXISTS idx_product_popular_categories_product_id ON product_popular_categories(product_id);
CREATE INDEX IF NOT EXISTS idx_product_dimension_images_product_id ON product_dimension_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_dimension_images_sort_order ON product_dimension_images(sort_order);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(32) UNIQUE,
    stripe_session_id TEXT,
    customer_name TEXT,
    customer_email TEXT NOT NULL,
    shipping_address JSONB,
    billing_address JSONB,
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending | dispatched | cancelled
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items store only SKU and quantity (plus unit price snapshot)
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    sku VARCHAR(100) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- Drop existing trigger function if it exists
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to relevant tables
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_product_variants_updated_at ON product_variants;
CREATE TRIGGER update_product_variants_updated_at BEFORE UPDATE ON product_variants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_product_dimensions_updated_at ON product_dimensions;
CREATE TRIGGER update_product_dimensions_updated_at BEFORE UPDATE ON product_dimensions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_reasons_to_love ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_custom_reasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_description_paragraphs ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_warranty_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_dimensions ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_popular_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_dimension_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow all operations" ON products;
DROP POLICY IF EXISTS "Allow all operations" ON product_images;
DROP POLICY IF EXISTS "Allow all operations" ON product_variants;
DROP POLICY IF EXISTS "Allow all operations" ON product_features;
DROP POLICY IF EXISTS "Allow all operations" ON product_reasons_to_love;
DROP POLICY IF EXISTS "Allow all operations" ON product_custom_reasons;
DROP POLICY IF EXISTS "Allow all operations" ON product_description_paragraphs;
DROP POLICY IF EXISTS "Allow all operations" ON product_faqs;
DROP POLICY IF EXISTS "Allow all operations" ON product_warranty_sections;
DROP POLICY IF EXISTS "Allow all operations" ON product_dimensions;
DROP POLICY IF EXISTS "Allow all operations" ON product_popular_categories;
DROP POLICY IF EXISTS "Allow all operations" ON product_recommendations;
DROP POLICY IF EXISTS "Allow all operations" ON product_dimension_images;
DROP POLICY IF EXISTS "Allow all operations" ON orders;
DROP POLICY IF EXISTS "Allow all operations" ON order_items;

-- For now, allow all operations (you can restrict this later with proper auth)
CREATE POLICY "Allow all operations" ON products FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON product_images FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON product_variants FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON product_features FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON product_reasons_to_love FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON product_custom_reasons FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON product_description_paragraphs FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON product_faqs FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON product_warranty_sections FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON product_dimensions FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON product_popular_categories FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON product_recommendations FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON product_dimension_images FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON orders FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON order_items FOR ALL USING (true);

-- Success message
SELECT 'Database schema created successfully!' as status;
