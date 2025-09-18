-- Migration: Add missing columns to existing header_dropdown_items table
-- Run this in your Supabase SQL editor

-- Add the missing columns to the existing table
ALTER TABLE public.header_dropdown_items 
ADD COLUMN IF NOT EXISTS custom_image text,
ADD COLUMN IF NOT EXISTS discount_percentage integer,
ADD COLUMN IF NOT EXISTS discount_price numeric(10,2);

-- Update the constraint to include the new columns if needed
-- (This is optional, the existing constraint should work fine)
