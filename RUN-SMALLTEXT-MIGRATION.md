# How to Run the Smalltext Migration

Since the automated migration script requires environment variables that aren't accessible, you can run this migration manually in your Supabase dashboard:

## Option 1: Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to the "SQL Editor" section
3. Copy the contents of `migrations/add-smalltext-to-reasons-to-love.sql`
4. Paste it into the SQL editor
5. Click "Run" to execute the migration

## Option 2: Command Line (if you have access to .env.local)

If you have access to the `.env.local` file with your Supabase credentials:

1. Make sure your `.env.local` file contains:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

2. Run the migration script:
   ```bash
   node run-smalltext-migration.js
   ```

## What the Migration Does

- Adds a `smalltext` column to the `product_reasons_to_love` table
- Sets a default value for existing records
- Creates an index for performance
- Adds helpful comments to the database

## After Running the Migration

Once the migration is complete, the new `smalltext` field will be available in:
- The admin panel for editing feature descriptions
- The product page for displaying small text below feature icons
- The API endpoints for saving and retrieving the data

The feature is now fully implemented and ready to use!
