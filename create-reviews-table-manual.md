# Manual Reviews Table Creation

Since the automated migration had issues, please follow these steps to create the reviews table manually:

## Step 1: Go to Supabase Dashboard
1. Open your Supabase project dashboard
2. Navigate to the "SQL Editor" tab

## Step 2: Run the SQL Migration
Copy and paste the following SQL into the SQL Editor and run it:

```sql
-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL,
  product_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT NOT NULL,
  review_text TEXT NOT NULL,
  customer_name TEXT NOT NULL DEFAULT 'Anonymous',
  email TEXT,
  verified BOOLEAN DEFAULT FALSE,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at);
CREATE INDEX IF NOT EXISTS idx_reviews_verified ON reviews(verified);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_reviews_updated_at 
  BEFORE UPDATE ON reviews 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();
```

## Step 3: Verify Table Creation
After running the SQL, you should see:
- ✅ Table "reviews" created successfully
- ✅ Indexes created successfully  
- ✅ Trigger created successfully

## Step 4: Test the Review System
1. Restart your development server: `npm run dev`
2. Go to any product page
3. Click "Write a Review" button
4. Submit a test review
5. Verify the review appears on the product page

## Troubleshooting
If you encounter any issues:
1. Check the Supabase logs for any SQL errors
2. Verify the table exists in the "Table Editor" tab
3. Check that your environment variables are correctly set
4. Restart your development server after table creation

The review system should now be fully functional!
