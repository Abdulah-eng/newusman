-- Migration: Create header_dropdown_items table with custom image and discount support
-- Run this in your Supabase SQL editor

-- Create the header_dropdown_items table
CREATE TABLE IF NOT EXISTS public.header_dropdown_items (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_slug character varying(50) NOT NULL,
    slot_index integer NOT NULL,
    product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    custom_image text, -- URL to custom image uploaded for this dropdown item
    discount_percentage integer, -- Custom discount percentage (e.g., 30 for 30% OFF)
    discount_price numeric(10,2), -- Custom discount price
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT header_dropdown_items_category_slot_unique UNIQUE (category_slug, slot_index)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_header_dropdown_items_category ON public.header_dropdown_items (category_slug);
CREATE INDEX IF NOT EXISTS idx_header_dropdown_items_product ON public.header_dropdown_items (product_id);
CREATE INDEX IF NOT EXISTS idx_header_dropdown_items_slot ON public.header_dropdown_items (slot_index);

-- Grant necessary permissions
GRANT ALL ON public.header_dropdown_items TO authenticated;
GRANT ALL ON public.header_dropdown_items TO service_role;
