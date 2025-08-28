# Image Upload Setup Guide

The admin panel now supports direct image uploads to Supabase storage instead of requiring image URLs. This provides a better user experience and ensures all images are stored securely. The admin panel also now uses proper Supabase authentication.

## Components

### 1. File Upload API (`/api/upload`)
- **Purpose**: Handles image file uploads from admin panel
- **Features**:
  - Secure authentication required
  - File type validation (images only)
  - File size validation (max 5MB)
  - Uploads to Supabase storage bucket
  - Returns public URL for uploaded image

### 2. Admin Panel Features
- **Banner Image Upload**: Upload banner images directly
- **Product Image Management**: Upload multiple product images with preview
- **Drag & Drop Interface**: Modern upload experience
- **Image Preview**: See uploaded images immediately

## Setup Requirements

### 1. Environment Variables
Create a `.env.local` file in your project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

**Important**: The `SUPABASE_SERVICE_ROLE_KEY` is required for the upload API to work properly.

### 2. Supabase Storage Setup
1. Go to your Supabase dashboard
2. Navigate to Storage → Buckets
3. Create a new bucket called `product-images`
4. Set it to public (or configure policies as needed)

### 3. Storage Policies
Run this SQL in your Supabase SQL editor:

```sql
-- Allow authenticated users to upload to product-images bucket
CREATE POLICY "Authenticated users can upload" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');

-- Allow public read access to product-images bucket
CREATE POLICY "Public read access" ON storage.objects 
FOR SELECT USING (bucket_id = 'product-images');
```

## Troubleshooting Upload API 500 Error

If you're getting a 500 Internal Server Error when trying to upload images, follow these steps:

### **Step 1: Check Environment Variables**
Verify your `.env.local` file has all required variables:
```bash
# Check if these exist and are correct
echo $NEXT_PUBLIC_SUPABASE_URL
echo $SUPABASE_SERVICE_ROLE_KEY
```

### **Step 2: Verify Supabase Storage Bucket**
1. Go to Supabase Dashboard → Storage → Buckets
2. Ensure `product-images` bucket exists
3. Check bucket permissions

### **Step 3: Test Supabase Connection**
Add this to your upload API route temporarily for debugging:

```typescript
// Add this at the top of your POST function
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('Service Role Key exists:', !!process.env.SUPABASE_SERVICE_ROLE_KEY)
```

### **Step 4: Check Browser Console**
Look for these specific error messages:
- "Failed to fetch" → Network/API issue
- "Unauthorized" → Authentication problem
- "Bucket not found" → Storage bucket missing

### **Step 5: Common Solutions**

#### **Missing Service Role Key**
```bash
# Get your service role key from Supabase Dashboard → Settings → API
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### **Storage Bucket Not Found**
```sql
-- Run this in Supabase SQL Editor
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true);
```

#### **Authentication Issues**
Make sure you're logged in as admin before trying to upload.

## Testing the Upload

1. Start your development server: `npm run dev`
2. Navigate to `/admin` and log in
3. Try uploading a banner image
4. Check browser console for any errors
5. Verify image appears in Supabase storage

## File Structure

```
app/
├── api/
│   └── upload/
│       └── route.ts          # Image upload endpoint with auth
├── admin/
│   └── page.tsx              # Admin panel with upload functionality
components/
└── ui/                       # UI components for forms and buttons
```

## Security Features

- **Authentication Required**: Only logged-in users can upload
- **File Type Validation**: Only image files accepted
- **File Size Limits**: Maximum 5MB per file
- **Admin Access Control**: Restricted to specific admin email
- **Secure Storage**: Files stored in Supabase with proper policies

## Future Enhancements

- Add image compression before upload
- Support for multiple file formats
- Add bulk image upload support
- Image optimization and resizing
- CDN integration for faster delivery

## Upload Banner Image

1. Go to Admin Panel → Banner Section
2. Click the upload icon next to "Banner Image"
3. Select an image file (JPG, PNG, etc.)
4. Wait for upload to complete
5. Images are uploaded and previewed

## Upload Product Images

1. Go to Admin Panel → Add/Edit Product
2. **Upload Fails**: Check Supabase credentials and storage bucket
3. **Authentication Error**: Ensure you're logged in as admin
4. **File Too Large**: Compress image or use smaller file
5. **Invalid File Type**: Use only image files (JPG, PNG, GIF, etc.)

## Troubleshooting

### Common Issues

1. **Upload Fails**: Check Supabase credentials and storage bucket
2. **Authentication Error**: Ensure you're logged in as admin
3. **File Too Large**: Compress image or use smaller file
4. **Invalid File Type**: Use only image files (JPG, PNG, GIF, etc.)

### Debug Steps

1. Check browser console for error messages
2. Verify environment variables are loaded
3. Test Supabase connection in dashboard
4. Check storage bucket exists and has correct policies
5. Ensure you're using the correct service role key

## Support

If you continue to have issues:
1. Check the browser console for detailed error messages
2. Verify all environment variables are set correctly
3. Ensure Supabase storage bucket exists and has proper policies
4. Check that you're authenticated as an admin user
