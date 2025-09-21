-- Migration: Create promotional_banners table for managing sales and clearance banners
-- Run this in your Supabase SQL editor

-- Create the promotional_banners table
CREATE TABLE IF NOT EXISTS public.promotional_banners (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    banner_type VARCHAR(50) NOT NULL, -- 'flash_sale', 'clearance', 'end_of_season', etc.
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    description TEXT,
    image_url VARCHAR(500) NOT NULL,
    link_url VARCHAR(500),
    badge_text VARCHAR(50),
    badge_color VARCHAR(50) DEFAULT 'red',
    discount_percentage INTEGER,
    discount_text VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT promotional_banners_type_unique UNIQUE (banner_type)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_promotional_banners_type ON public.promotional_banners (banner_type);
CREATE INDEX IF NOT EXISTS idx_promotional_banners_active ON public.promotional_banners (is_active);
CREATE INDEX IF NOT EXISTS idx_promotional_banners_sort ON public.promotional_banners (sort_order);

-- Grant necessary permissions
GRANT ALL ON public.promotional_banners TO authenticated;
GRANT ALL ON public.promotional_banners TO service_role;

-- Insert default promotional banners
INSERT INTO public.promotional_banners (banner_type, title, subtitle, description, image_url, link_url, badge_text, badge_color, discount_percentage, discount_text, is_active, sort_order) VALUES
('flash_sale', 'FLASH SALE', 'Up to 70% Off', 'Limited Time Only', '/clearance.png', '/sale', 'HOT DEAL', 'red', 70, 'Up to 70% Off', true, 1),
('clearance', 'CLEARANCE', 'Up to 60% Off', 'While Stocks Last', '/clearance.png', '/sale', 'SAVE BIG', 'orange', 60, 'Up to 60% Off', true, 2),
('end_of_season', 'END OF SEASON', 'Up to 50% Off', 'Final Reductions', '/clearance.png', '/sale', 'LAST CHANCE', 'gray', 50, 'Up to 50% Off', true, 3);
