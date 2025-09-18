-- Migration: Add custom image support to deal_of_day section
-- Run this in your Supabase SQL editor

-- Update the deal_of_day section content structure to include custom images
UPDATE public.homepage_content 
SET content = '{"productCards": []}'::jsonb
WHERE section = 'deal_of_day';

-- If the section doesn't exist, insert it
INSERT INTO public.homepage_content (section, content, order_index) 
VALUES ('deal_of_day', '{"productCards": []}'::jsonb, 4)
ON CONFLICT (section) DO NOTHING;

-- The new structure will support:
-- {
--   "productCards": [
--     {
--       "productId": "uuid",
--       "description": "Custom description",
--       "percentageOff": "30% OFF",
--       "customImage": "https://bucket-url/image.jpg" // New field for custom image
--     }
--   ]
-- }
