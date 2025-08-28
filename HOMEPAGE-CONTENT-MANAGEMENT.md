# Homepage Content Management System

## Overview
This system allows admins to manage all content on the homepage through a comprehensive admin panel. The content is stored in the database and can be dynamically updated without code changes.

## Features

### 1. Hero Section
- **2 Small Images**: Upload and manage two small promotional images
- **3 Sliding Images**: Upload and manage three images for the main carousel/slider
- **Image Management**: Drag & drop uploads with preview and removal options

### 2. 4 Image Cards Section
- **Individual Cards**: Each card has its own image, heading, text, button text, and button link
- **Content Management**: Full control over text content and call-to-action buttons
- **Image Upload**: Individual image uploads for each card

### 3. Take Quiz Section
- **Quiz Image**: Upload an image for the quiz section
- **Heading**: Customizable quiz section title
- **Paragraph**: Detailed description of the quiz

### 4. Deal of the Day Section
- **Product Selection**: Browse all products from the database
- **Limit Control**: Select up to 5 products maximum
- **Visual Feedback**: Clear indication of selected products
- **Product Information**: Shows product name, category, and pricing

### 5. Our Mattresses Section
- **Individual Product Cards**: Add/remove mattress products individually
- **Product Selection**: Choose from all available mattress products
- **Feature Display**: Select which feature to highlight for each mattress
- **Custom Description**: Add description for each mattress card
- **Dynamic Management**: Add or remove mattress cards as needed

### 6. Turn Your Bedroom Into Inspiration
- **Individual Product Cards**: Add/remove bedroom products individually
- **Category Filtering**: Automatically shows beds, bedding, and bed-frames
- **Product Selection**: Choose from available bedroom-related products
- **Feature Display**: Select which feature to highlight for each product
- **Custom Description**: Add description for each product card
- **Dynamic Management**: Add or remove product cards as needed

### 7. Our Sofa Types Section
- **Dynamic Addition**: Add/remove sofa type cards as needed
- **Sofa Selection**: Choose from all available sofa products
- **Feature Display**: Select which "feature you will love" to show
- **Custom Content**: Add custom heading and description for each sofa type
- **Icon Integration**: Shows the selected feature with its icon

### 8. Ideas & Guides Section
- **Dynamic Addition**: Add/remove guide cards as needed
- **Image Management**: Upload and manage guide images
- **Content Control**: Customize heading, description, and time to read
- **Flexible Structure**: Supports any number of guides
- **Visual Consistency**: Maintains exact card structure from homepage

## Database Structure

### Table: `homepage_content`
```sql
CREATE TABLE homepage_content (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    section varchar(100) UNIQUE NOT NULL,
    content jsonb NOT NULL,
    order_index integer NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);
```

### Content Structure by Section

#### Hero Section
```json
{
  "smallImage1": "image_url_1",
  "smallImage2": "image_url_2", 
  "slidingImages": ["image_url_3", "image_url_4", "image_url_5"]
}
```

#### Image Cards
```json
[
  {
    "id": "1",
    "image": "image_url",
    "heading": "Card Title",
    "text": "Card description text",
    "buttonText": "Click Here",
    "buttonLink": "/destination-url"
  }
]
```

#### Quiz Section
```json
{
  "image": "quiz_image_url",
  "heading": "Quiz Title",
  "paragraph": "Quiz description text"
}
```

#### Deal of Day
```json
{
  "productIds": ["uuid1", "uuid2", "uuid3"],
  "description": "Custom description for the deal of the day section",
  "percentageOff": "Up to 50% Off",
  "productCards": [
    {
      "productId": "uuid1",
      "description": "Write a compelling description about comfort, materials and value",
      "percentageOff": "50% OFF"
    },
    {
      "productId": "uuid2", 
      "description": "Premium quality product with exceptional features",
      "percentageOff": "30% OFF"
    }
  ]
}
```

#### Product Sections (Mattresses, Bedroom Inspiration)
```json
{
  "productIds": ["uuid1", "uuid2"],
  "description": "Section description text"
}
```

#### Sofa Types
```json
[
  {
    "id": "unique_id",
    "sofaId": "product_uuid",
    "description": "Sofa type description",
    "featureToShow": "Premium Fabric"
  }
]
```

#### Ideas & Guides
```json
[
  {
    "id": "unique_id",
    "image": "guide_image_url",
    "heading": "Guide Title",
    "description": "Guide description text",
    "timeToRead": "5 min read"
  }
]
```

## Setup Instructions

### 1. Database Setup
Run the migration file in your Supabase SQL editor:
```sql
-- Run migrations/create-homepage-content-table.sql
```

### 2. Access the Admin Panel
Navigate to `/admin/homepage` in your application

### 3. Upload Images
- Use the drag & drop upload areas
- Images are stored in Supabase Storage under `homepage/` folder
- Supported formats: JPG, PNG, GIF, WebP

### 4. Manage Content
- Fill in all required fields
- Select products for relevant sections
- Customize descriptions and text content
- Add/remove sofa type cards as needed

### 5. Save Changes
- Click "Save All Changes" to persist your modifications
- Content is immediately available on the homepage

## Usage Examples

### Setting Up Hero Section
1. Upload 2 small promotional images
2. Upload 3 main carousel images
3. Images will automatically appear in the hero section

### Creating Image Cards
1. Upload an image for each card
2. Add compelling headings and descriptions
3. Set button text and destination links
4. Cards will display with the exact structure from the homepage

### Managing Deal of the Day
1. Browse all available products
2. Click to select up to 5 products
3. Selected products will show with orange highlighting
4. Products automatically appear in the deal section

### Setting Up Sofa Types
1. Click "Add Sofa Type" for each sofa category
2. Select the actual sofa product from the database
3. Choose which feature to highlight (e.g., "Premium Fabric")
4. Add custom description
5. The card will show the sofa image, selected feature with icon, and custom description

### Managing Ideas & Guides
1. Click "Add Guide" to create a new guide card
2. Upload an image for the guide
3. Add a compelling heading and description
4. Set the estimated time to read
5. The guide will appear in the Ideas & Guides section with the exact same card structure

## Technical Features

- **Real-time Updates**: Immediate visual feedback for all selections
- **Image Management**: Automatic image upload and storage
- **Product Integration**: Seamless integration with existing product database
- **Responsive Design**: Works on all device sizes
- **Data Validation**: Ensures data integrity and proper formatting
- **Error Handling**: Graceful error handling with user feedback

## Security

- **Authentication Required**: Only authenticated admin users can access
- **Image Validation**: Secure image upload with format validation
- **SQL Injection Protection**: Uses parameterized queries
- **Access Control**: Restricted to admin routes only

## Maintenance

### Regular Tasks
- Review and update promotional content
- Refresh deal of the day selections
- Update section descriptions as needed
- Monitor image quality and relevance

### Backup
- Content is automatically backed up with your database
- Consider exporting JSON content for additional backup

## Troubleshooting

### Common Issues
1. **Images not uploading**: Check Supabase Storage permissions
2. **Products not loading**: Verify database connection and product table
3. **Content not saving**: Check database permissions and table structure

### Debug Mode
Enable console logging to see detailed error information during development.

## Future Enhancements

- **Content Scheduling**: Set content to change at specific times
- **A/B Testing**: Test different content variations
- **Analytics Integration**: Track content performance
- **Bulk Operations**: Import/export content in bulk
- **Content Templates**: Pre-built content templates for common sections
