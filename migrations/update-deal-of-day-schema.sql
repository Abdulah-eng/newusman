-- Migration: Update deal_of_day section to include description and percentage_off
-- Run this in your Supabase SQL editor

-- Update the deal_of_day section content structure
UPDATE public.homepage_content 
SET content = '{"productIds": [], "description": "", "percentageOff": ""}'::jsonb
WHERE section = 'deal_of_day';

-- If the section doesn't exist, insert it
INSERT INTO public.homepage_content (section, content, order_index) 
VALUES ('deal_of_day', '{"productIds": [], "description": "", "percentageOff": ""}'::jsonb, 4)
ON CONFLICT (section) DO NOTHING;
