# Admin Dashboard Setup Guide

## Overview

This admin dashboard provides comprehensive product management capabilities for your e-commerce store. It includes:

- **Product Management**: Add, edit, and delete products with all details
- **Category Management**: Manage product categories
- **Brand Management**: Manage product brands
- **Order Management**: View and manage customer orders
- **Dashboard Overview**: Statistics and analytics

## Features

### Product Management
- **Basic Information**: Name, slug, brand, category, descriptions
- **Pricing**: Original price, current price, monthly payment options
- **Images**: Main image + multiple additional images
- **Specifications**: Sizes, colors, features, materials
- **Inventory**: Stock quantity, dispatch time, setup services
- **Promotional Offers**: Add product deals, save percentages, free shipping
- **Product Questions**: FAQ management
- **Warranty & Care**: Warranty details and care instructions
- **SEO**: Meta titles, descriptions, keywords

### Database Schema
The dashboard uses a comprehensive database schema that stores:
- Multiple product images
- Real pricing with discounts
- All available sizes and colors
- Product features and materials
- Dimensions information
- Promotional offers
- Product questions and warranty info

## Setup Instructions

### 1. Database Setup

1. **Run the SQL Schema**: 
   - Copy the contents of `supabase-schema-products.sql`
   - Go to your Supabase Dashboard → SQL Editor
   - Paste and run the SQL script

2. **Verify Tables Created**:
   - `products` - Main product table
   - `categories` - Product categories
   - `brands` - Product brands
   - `product_variants` - Size/color combinations
   - `product_images` - Image management
   - `promotional_offers` - Special deals
   - `product_questions` - FAQ management
   - `warranty_info` - Warranty details
   - `admin_users` - Admin access control

### 2. Environment Variables

Ensure these are set in your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 3. Storage Setup

1. **Create Storage Bucket**:
   - Go to Supabase Dashboard → Storage
   - Create bucket named `product-images`
   - Set to public (or configure policies)

2. **Storage Policies** (already in SQL schema):
   ```sql
   -- Public read access
   CREATE POLICY "Public read access" ON storage.objects 
   FOR SELECT USING (bucket_id = 'product-images');
   
   -- Authenticated upload access
   CREATE POLICY "Authenticated users can upload" ON storage.objects 
   FOR INSERT WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');
   ```

### 4. Access the Dashboard

Navigate to `/admin` in your application to access the dashboard.

## Usage

### Adding a Product

1. **Navigate to Products** section
2. **Click "Add Product"**
3. **Fill in all required fields**:
   - Basic information (name, brand, category)
   - Pricing (original and current prices)
   - Upload main image and additional images
   - Add sizes, colors, features, materials
   - Set inventory and delivery options
   - Configure promotional offers
   - Add product questions
   - Set warranty and care information
   - Add SEO meta data

4. **Click "Save Product"**

### Managing Products

- **View All Products**: See all products in a table format
- **Edit Products**: Click edit button to modify existing products
- **Delete Products**: Remove products with confirmation
- **Filter & Search**: Find products by name, brand, or status

### Categories & Brands

- **Categories**: Manage product categories (Mattresses, Sofas, etc.)
- **Brands**: Manage product brands (ARTHUR SLEEP, SILENTNIGHT, etc.)

## API Endpoints

### Products API (`/api/products`)

**GET** - Fetch products with filters:
- `?category=mattresses` - Filter by category
- `?featured=true` - Featured products only
- `?onSale=true` - Products on sale
- `?limit=10` - Limit results

**POST** - Create new product (admin only)

### Database Integration

The dashboard automatically:
- Fetches real data from your Supabase database
- Updates product information in real-time
- Manages image uploads to Supabase storage
- Handles all CRUD operations for products

## Security Features

- **Row Level Security (RLS)** enabled on all tables
- **Public read access** for products, categories, brands
- **Authenticated access** required for admin operations
- **Image upload validation** (file type, size limits)

## Customization

### Adding New Fields

1. **Update Database Schema**: Add new columns to the `products` table
2. **Update Product Form**: Add form fields in `components/admin/product-form.tsx`
3. **Update API**: Modify `/api/products/route.ts` to handle new fields
4. **Update Frontend**: Modify product display components

### Styling

The dashboard uses:
- **Tailwind CSS** for styling
- **Shadcn/ui** components for UI elements
- **Lucide React** for icons
- **Responsive design** for mobile and desktop

## Troubleshooting

### Common Issues

1. **Database Connection Error**:
   - Verify environment variables
   - Check Supabase project status
   - Verify service role key permissions

2. **Image Upload Fails**:
   - Check storage bucket exists
   - Verify storage policies
   - Check file size limits (5MB default)

3. **Products Not Loading**:
   - Check database tables exist
   - Verify RLS policies
   - Check API endpoint logs

### Debug Mode

Enable debug logging by checking browser console and server logs for detailed error information.

## Support

For issues or questions:
1. Check the browser console for errors
2. Verify database schema is correctly applied
3. Ensure all environment variables are set
4. Check Supabase dashboard for any service issues

## Future Enhancements

Potential improvements:
- **User Authentication**: Secure admin login system
- **Bulk Operations**: Import/export products
- **Advanced Analytics**: Sales reports and insights
- **Inventory Management**: Stock tracking and alerts
- **Multi-language Support**: Internationalization
- **Advanced Search**: Product search and filtering
- **Order Management**: Complete order processing workflow
