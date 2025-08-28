# Fix Database Schema - Step by Step Guide

## The Problem
Your database is missing these columns that the frontend form is trying to save:
- `size`
- `material` 
- `color`
- `featured`

This causes the error: "Could not find the 'color' column of 'products' in the schema cache"

## Solution: Run the Migration Script

### Step 1: Open Supabase Dashboard
1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Sign in to your account
3. Select your project

### Step 2: Open SQL Editor
1. In the left sidebar, click on "SQL Editor"
2. Click "New query" or the "+" button

### Step 3: Copy and Paste the Migration Script
Copy this entire script and paste it into the SQL Editor:

```sql
-- Fix products table by adding missing columns
-- Run this in your Supabase SQL Editor

-- Add missing columns to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS size TEXT,
ADD COLUMN IF NOT EXISTS material TEXT,
ADD COLUMN IF NOT EXISTS color TEXT,
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;

-- Update existing products to have default values for new columns
UPDATE products 
SET 
  size = COALESCE(size, ''),
  material = COALESCE(material, ''),
  color = COALESCE(color, ''),
  featured = COALESCE(featured, false)
WHERE size IS NULL OR material IS NULL OR color IS NULL OR featured IS NULL;

-- Create index for featured column for better performance
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);

-- Verify the changes
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'products' 
ORDER BY ordinal_position;
```

### Step 4: Run the Script
1. Click the "Run" button (or press Ctrl+Enter)
2. Wait for the script to complete
3. You should see a success message and a list of all columns

### Step 5: Verify the Results
After running the script, you should see all these columns in the results:
- `id`
- `name`
- `brand`
- `category`
- `price`
- `description`
- `images`
- `specifications`
- `size` ← NEW
- `material` ← NEW
- `color` ← NEW
- `in_stock`
- `featured` ← NEW
- `created_at`
- `updated_at`

### Step 6: Test Product Saving
1. Go back to your admin panel
2. Fill out the product form with all fields
3. Click "Save Product"
4. It should now work without the database error!

## What This Script Does

1. **Adds Missing Columns**: Creates `size`, `material`, `color`, and `featured` columns
2. **Sets Default Values**: Gives existing products empty strings for text fields and `false` for featured
3. **Creates Index**: Adds a performance index for the featured column
4. **Verifies Changes**: Shows you the final table structure

## If You Still Get Errors

If you still get errors after running this script:

1. **Check the SQL Editor output** - Make sure there were no error messages
2. **Wait a few minutes** - Sometimes changes take a moment to propagate
3. **Restart your Next.js app** - Run `npm run dev` again
4. **Check the browser console** - Look for any new error messages

## Alternative: Manual Column Addition

If the script doesn't work, you can add columns one by one:

```sql
ALTER TABLE products ADD COLUMN size TEXT;
ALTER TABLE products ADD COLUMN material TEXT;
ALTER TABLE products ADD COLUMN color TEXT;
ALTER TABLE products ADD COLUMN featured BOOLEAN DEFAULT false;
```

## Need Help?

If you're still having issues:
1. Check the SQL Editor for any error messages
2. Make sure you're running the script in the correct project
3. Verify your database connection is working
