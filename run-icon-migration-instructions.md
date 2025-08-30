# Manual Icon Migration Instructions

If the automated migration script doesn't work, you can manually run the migration in your Supabase dashboard.

## Steps:

1. **Go to your Supabase Dashboard**
   - Navigate to your project
   - Go to the "SQL Editor" section

2. **Run the following SQL commands one by one:**

```sql
-- Add the icon column
ALTER TABLE product_reasons_to_love
ADD COLUMN IF NOT EXISTS icon VARCHAR(100);

-- Add a comment to describe the column
COMMENT ON COLUMN product_reasons_to_love.icon IS 'Icon type selected in admin panel for the feature (e.g., springs, brain, sliders, etc.)';

-- Create an index on the icon column for performance
CREATE INDEX IF NOT EXISTS idx_product_reasons_icon ON product_reasons_to_love(icon);

-- Verify the column was added
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'product_reasons_to_love'
AND column_name = 'icon';
```

3. **Verify the migration was successful**
   - The last SELECT query should return a row showing the new `icon` column
   - The column should have `data_type` = 'character varying' and `is_nullable` = 'YES'

## What this migration does:

- **Adds an `icon` column** to store the icon type selected in the admin panel
- **Creates an index** for better query performance
- **Adds documentation** to explain what the column is for

## After running the migration:

1. The admin panel will now save icon information when adding features
2. The API will return the icon data
3. The "Features you'll love" section will display the correct icons
4. The `smalltext` field will also work properly

## Troubleshooting:

- If you get an error about the column already existing, that's fine - it means the migration was already run
- If you get permission errors, make sure you're using an account with admin privileges
- If the index creation fails, the column will still work, just without the performance optimization

