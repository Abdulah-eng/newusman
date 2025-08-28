# Database Schema Setup Guide

## Problem
You're getting this error when trying to save products:
```
Product insert error: {
  code: 'PGRST204',
  details: null,
  hint: null,
  message: "Could not find the 'color' column of 'products' in the schema cache"
}
```

This happens because your database schema is missing several columns that your frontend form is trying to save.

## Solution
You need to update your Supabase database schema to include the missing columns.

## Step 1: Run the Migration Script

1. Go to your Supabase dashboard
2. Navigate to **SQL Editor**
3. Copy and paste this migration script:

```sql
-- Migration script to add missing columns to products table
-- Run this in your Supabase SQL editor to update your existing products table

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

4. Click **Run** to execute the script

## Step 2: Verify the Changes

After running the migration, you should see output showing all columns in your products table. The table should now include:

- `id` (UUID, Primary Key)
- `name` (TEXT, NOT NULL)
- `brand` (TEXT, NOT NULL)
- `category` (TEXT, NOT NULL)
- `price` (DECIMAL, NOT NULL)
- `description` (TEXT)
- `images` (TEXT ARRAY)
- `specifications` (JSONB)
- `size` (TEXT) ← **NEW**
- `material` (TEXT) ← **NEW**
- `color` (TEXT) ← **NEW**
- `in_stock` (BOOLEAN) ← **Note: different from frontend's 'inStock'**
- `featured` (BOOLEAN) ← **NEW**
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## Step 3: Test Product Saving

1. Go back to your admin panel (`/admin`)
2. Try to save a product with all the fields filled in
3. The product should now save successfully without the schema error

## Important Notes

### Column Name Mapping
- Frontend sends: `inStock` → Database stores: `in_stock`
- Frontend sends: `featured` → Database stores: `featured`
- Frontend sends: `size`, `material`, `color` → Database stores: `size`, `material`, `color`

### Default Values
- `size`, `material`, `color` default to empty strings (`''`)
- `featured` defaults to `false`
- `in_stock` defaults to `true`

## Alternative: Complete Schema Reset

If you prefer to start fresh, you can:

1. Drop the existing products table:
```sql
DROP TABLE IF EXISTS products CASCADE;
```

2. Run the complete schema from `supabase-schema.sql` (which now includes all the missing columns)

## Troubleshooting

### If you get permission errors:
- Make sure you're using the correct database connection
- Check that your Supabase user has the necessary permissions

### If columns still don't exist:
- Refresh your Supabase dashboard
- Check the SQL Editor output for any error messages
- Verify the table structure in the **Table Editor** section

### If products still don't save:
- Check the browser console for any JavaScript errors
- Check your terminal/server logs for API errors
- Verify that your environment variables are set correctly

## Next Steps

After fixing the schema:
1. Test saving a few products to ensure everything works
2. Consider adding validation rules or constraints to the database
3. Set up proper indexes for performance if you'll have many products
4. Consider adding foreign key constraints if you want to link products to categories or brands

## Support

If you continue to have issues:
1. Check the Supabase logs in your dashboard
2. Verify your environment variables are correct
3. Ensure your API routes are properly configured
4. Check that your frontend form is sending the correct data structure
