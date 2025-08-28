# Supabase Integration Setup Guide

This guide will help you set up the Supabase database and connect it to your admin dashboard.

## 🗄️ Database Setup

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note down your project URL and anon key

### 2. Environment Variables
Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 3. Run Database Schema
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase-schema-categories.sql`
4. Run the script

This will create:
- **Categories table** - Product categories
- **Brands table** - Product brands
- **Mattresses table** - Mattress products
- **Beds table** - Bed frame products
- **Sofas table** - Sofa products
- **Pillows table** - Pillow products
- **Toppers table** - Mattress topper products
- **Bunkbeds table** - Bunk bed products
- **Homepage content table** - Homepage sections
- **Frequently bought together table** - Related products

## 🔐 Authentication Setup

### 1. Enable Row Level Security (RLS)
The schema automatically enables RLS on all tables with policies:
- **Public read access** - Anyone can view products
- **Admin full access** - Authenticated users can manage products

### 2. Set up Authentication
1. In Supabase dashboard, go to Authentication > Settings
2. Configure your authentication providers (Email, Google, etc.)
3. Set up email templates if using email authentication

## 📁 API Endpoints

### Product Management
- `GET /api/mattresses` - Get all mattresses
- `POST /api/mattresses` - Create new mattress
- `PUT /api/mattresses` - Update mattress
- `DELETE /api/mattresses` - Delete mattress

Similar endpoints exist for other categories:
- `/api/beds`
- `/api/sofas`
- `/api/pillows`
- `/api/toppers`
- `/api/bunkbeds`

### Homepage Content
- `GET /api/homepage-content` - Get all homepage sections
- `POST /api/homepage-content` - Create/update homepage section
- `PUT /api/homepage-content` - Update homepage section
- `DELETE /api/homepage-content` - Delete homepage section

## 🖼️ Image Storage

### 1. Storage Bucket
The schema creates a `product-images` bucket automatically.

### 2. Storage Policies
- **Public read access** - Images are publicly viewable
- **Authenticated upload** - Only authenticated users can upload

### 3. Image Upload
Images are stored as URLs in the database. You can:
- Upload to Supabase Storage and store the URL
- Use external image hosting services
- Store base64 encoded images (not recommended for production)

## 🚀 Usage Examples

### Creating a New Mattress
```typescript
import { AdminService } from '@/lib/admin-service'

const newMattress = await AdminService.createProduct('mattresses', {
  name: 'Premium Memory Foam Mattress',
  currentPrice: 599.99,
  originalPrice: 799.99,
  mainImage: 'https://example.com/mattress.jpg',
  type: 'Memory Foam',
  firmnessLevel: 6,
  // ... other fields
})
```

### Updating Homepage Content
```typescript
import { AdminService } from '@/lib/admin-service'

await AdminService.updateHomepageContent('mattress_types', [
  {
    image: 'https://example.com/memory-foam.jpg',
    title: 'Memory Foam',
    description: 'Ultimate comfort and support'
  }
])
```

### Fetching Products by Category
```typescript
import { AdminService } from '@/lib/admin-service'

const mattresses = await AdminService.getProductsByCategory('mattresses')
const beds = await AdminService.getProductsByCategory('beds')
```

## 🔧 Admin Dashboard Integration

### 1. Update Product Management
The admin dashboard now uses the `AdminService` class for all database operations.

### 2. Real-time Updates
Supabase provides real-time subscriptions for live updates:
```typescript
const subscription = supabase
  .from('mattresses')
  .on('*', payload => {
    console.log('Change received!', payload)
    // Update your UI
  })
  .subscribe()
```

### 3. Error Handling
All API endpoints include proper error handling and logging.

## 📊 Database Structure

### Product Tables
Each product category has its own table with:
- **Basic info**: name, brand, pricing, images
- **Product details**: descriptions, specifications, dimensions
- **Category-specific fields**: mattress type, bed type, sofa type, etc.
- **Search filters**: All filter options for the frontend
- **Marketing**: reasons to buy, promotional offers
- **Support**: warranty info, care instructions, FAQs

### Homepage Content
Stored as JSON arrays for flexible content management:
- **Mattress types**: Featured mattress categories
- **Gallery items**: Inspiration images
- **Sofa types**: Featured sofa categories
- **Trending items**: Popular products
- **Promotional cards**: Marketing content
- **Guides**: Helpful articles

## 🚨 Important Notes

### 1. Data Migration
If you have existing data, you'll need to migrate it to the new schema structure.

### 2. Image URLs
Ensure all image URLs are accessible and properly formatted.

### 3. Authentication
Implement proper authentication before deploying to production.

### 4. Backup
Regularly backup your Supabase database.

## 🐛 Troubleshooting

### Common Issues

1. **RLS Policy Errors**
   - Check if RLS is enabled on tables
   - Verify authentication is working
   - Check policy syntax

2. **Image Upload Failures**
   - Verify storage bucket exists
   - Check storage policies
   - Ensure proper authentication

3. **API Errors**
   - Check environment variables
   - Verify table structure
   - Check console logs for detailed errors

### Getting Help
- Check Supabase documentation
- Review console logs
- Verify database schema matches expectations
- Test API endpoints individually

## 🔄 Next Steps

1. **Test the setup** with sample data
2. **Implement authentication** in your admin dashboard
3. **Add real-time features** for live updates
4. **Set up monitoring** and error tracking
5. **Optimize performance** with proper indexing
6. **Implement caching** for better performance

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

**Need help?** Check the console logs and verify your setup matches this guide step by step.
