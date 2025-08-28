-- Migration: Create homepage_content table
-- Run this in your Supabase SQL editor

-- Create the homepage_content table
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_homepage_content_order ON public.homepage_content (order_index);
CREATE INDEX IF NOT EXISTS idx_homepage_content_section ON public.homepage_content (section);

-- Insert some default content structure
INSERT INTO public.homepage_content (section, content, order_index) VALUES
('hero', '{"smallImage1": "", "smallImage2": "", "slidingImages": ["", "", ""]}'::jsonb, 1),
('image_cards', '[{"id": "1", "image": "", "heading": "", "text": "", "buttonText": "", "buttonLink": ""}, {"id": "2", "image": "", "heading": "", "text": "", "buttonText": "", "buttonLink": ""}, {"id": "3", "image": "", "heading": "", "text": "", "buttonText": "", "buttonLink": ""}, {"id": "4", "image": "", "heading": "", "text": "", "buttonText": "", "buttonLink": ""}]'::jsonb, 2),
('quiz', '{"image": "", "heading": "", "paragraph": ""}'::jsonb, 3),
('deal_of_day', '{"productIds": []}'::jsonb, 4),
('mattresses', '{"productIds": [], "description": ""}'::jsonb, 5),
('bedroom_inspiration', '{"productIds": [], "description": ""}'::jsonb, 6),
('sofa_types', '[]'::jsonb, 7),
('ideas_guides', '[]'::jsonb, 8)
ON CONFLICT (section) DO NOTHING;

-- Grant necessary permissions
GRANT ALL ON public.homepage_content TO authenticated;
GRANT ALL ON public.homepage_content TO service_role;
