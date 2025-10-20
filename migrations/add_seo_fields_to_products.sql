-- Add SEO fields to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS seo_title TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS seo_description TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS seo_keywords TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS seo_tags TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS meta_robots TEXT DEFAULT 'index, follow';
ALTER TABLE products ADD COLUMN IF NOT EXISTS canonical_url TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS og_title TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS og_description TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS og_image TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS twitter_title TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS twitter_description TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS twitter_image TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS structured_data JSONB;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_seo_title ON products(seo_title);
CREATE INDEX IF NOT EXISTS idx_products_seo_keywords ON products(seo_keywords);
CREATE INDEX IF NOT EXISTS idx_products_seo_tags ON products(seo_tags);

-- Add comments for documentation
COMMENT ON COLUMN products.seo_title IS 'Custom SEO title for search engines (max 60 chars recommended)';
COMMENT ON COLUMN products.seo_description IS 'Custom SEO meta description (max 160 chars recommended)';
COMMENT ON COLUMN products.seo_keywords IS 'Comma-separated SEO keywords for search engines';
COMMENT ON COLUMN products.seo_tags IS 'Comma-separated tags for internal categorization and filtering';
COMMENT ON COLUMN products.meta_robots IS 'Meta robots directive (e.g., index, follow, noindex, nofollow)';
COMMENT ON COLUMN products.canonical_url IS 'Canonical URL to prevent duplicate content issues';
COMMENT ON COLUMN products.og_title IS 'Open Graph title for social media sharing';
COMMENT ON COLUMN products.og_description IS 'Open Graph description for social media sharing';
COMMENT ON COLUMN products.og_image IS 'Open Graph image URL for social media sharing';
COMMENT ON COLUMN products.twitter_title IS 'Twitter card title';
COMMENT ON COLUMN products.twitter_description IS 'Twitter card description';
COMMENT ON COLUMN products.twitter_image IS 'Twitter card image URL';
COMMENT ON COLUMN products.structured_data IS 'JSON-LD structured data for rich snippets';
