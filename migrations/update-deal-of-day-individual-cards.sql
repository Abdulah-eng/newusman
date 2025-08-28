-- Migration: Update deal_of_day section to support individual product cards
-- Run this in your Supabase SQL editor

-- Update the deal_of_day section content structure to support individual product cards
UPDATE public.homepage_content 
SET content = '{"productCards": []}'::jsonb
WHERE section = 'deal_of_day';

-- If the section doesn't exist, insert it
INSERT INTO public.homepage_content (section, content, order_index) 
VALUES ('deal_of_day', '{"productCards": []}'::jsonb, 4)
ON CONFLICT (section) DO NOTHING;
