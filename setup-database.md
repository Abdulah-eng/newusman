# Database Setup Guide

## 1. Run the Database Schema

Copy and paste the contents of `database-schema.sql` into your Supabase SQL editor and run it.

## 2. Verify Tables Created

After running the schema, you should see these tables in your Supabase dashboard:

- `categories` - Product categories
- `products` - Main product information
- `product_images` - Product images and files
- `product_variants` - Product variants (SKU, pricing, attributes)
- `product_features` - Product features
- `product_reasons_to_love` - Reasons customers will love the product
- `product_custom_reasons` - Custom reasons to buy
- `product_description_paragraphs` - Product description with images
- `product_faqs` - Frequently asked questions
- `product_warranty_sections` - Warranty information
- `product_dimensions` - Product dimensions and specifications
- `product_recommendations` - Recommended products

## 3. Test the Admin Panel

1. Go to `/admin` in your application
2. Fill out the product form
3. Click "Save [Category]"
4. Check your Supabase dashboard to see the data being saved

## 4. Next Steps

After confirming the database integration works:

1. **Fetch Data**: Update frontend components to fetch from database instead of hardcoded data
2. **Image Upload**: Implement actual file upload to Supabase Storage
3. **Authentication**: Add proper admin authentication
4. **Validation**: Add server-side validation
5. **Error Handling**: Improve error handling and user feedback

## 5. Database Schema Features

- **UUID Primary Keys**: All tables use UUIDs for better security
- **Foreign Key Relationships**: Proper relationships between products and related data
- **Indexes**: Performance indexes on frequently queried fields
- **Triggers**: Automatic `updated_at` timestamp updates
- **Row Level Security**: Enabled for future authentication implementation
- **Data Validation**: Check constraints for firmness scales and comfort levels
