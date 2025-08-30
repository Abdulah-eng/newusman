# Badge System Implementation

This document explains the comprehensive badge system that has been implemented for the product management system.

## Overview

The badge system allows administrators to:
- Enable/disable different types of badges for products
- Select specific products as free gifts
- Automatically display badges on product cards based on database settings
- Automatically add free gifts to cart when products with free gift badges are purchased

## Badge Types

### 1. Sale Badge (Orange)
- **Purpose**: Indicates when a product is on sale
- **Color**: Orange (`bg-orange-500`)
- **Display Logic**: Shows when `badges` array contains `{type: 'sale', enabled: true}`
- **Position**: Top right of product card

### 2. New In Badge (Darker Orange)
- **Purpose**: Indicates new products
- **Color**: Darker orange (`bg-orange-600`)
- **Display Logic**: Shows when `badges` array contains `{type: 'new_in', enabled: true}`
- **Position**: Below Sale badge on the right

### 3. Free Gift Badge (Blue)
- **Purpose**: Indicates products that come with a free gift
- **Color**: Blue (`bg-blue-900`)
- **Display Logic**: Shows when `badges` array contains `{type: 'free_gift', enabled: true}`
- **Position**: Top left of product card
- **Special Feature**: When enabled, allows selection of a specific product as the free gift

## Database Schema Changes

### New Fields in `products` Table

```sql
-- Badge configuration (JSONB array)
badges JSONB DEFAULT '[]'

-- Free gift product reference
free_gift_product_id UUID REFERENCES products(id)

-- Whether free gift is enabled
free_gift_enabled BOOLEAN DEFAULT FALSE
```

### New Table: `free_gifts`

```sql
CREATE TABLE free_gifts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  gift_product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, gift_product_id)
);
```

## Badge Data Structure

The `badges` field stores an array of badge objects:

```json
[
  {
    "type": "sale",
    "enabled": true
  },
  {
    "type": "new_in", 
    "enabled": false
  },
  {
    "type": "free_gift",
    "enabled": true
  }
]
```

## Implementation Details

### 1. Product Form (`components/admin/product-form.tsx`)

The product form now includes a "Product Badges" section with:
- Checkboxes for each badge type
- Visual preview of badge appearance
- Free gift product selection modal
- Automatic badge management

**Key Features:**
- Badge toggles with visual feedback
- Product selection modal for free gifts
- Automatic clearing of gift selection when badge is disabled
- Integration with existing form submission

### 2. Product Selection Modal (`components/admin/product-selection-modal.tsx`)

A reusable modal component for selecting products:
- Search functionality
- Product grid with images and names
- Exclusion of current product from selection
- Responsive design

### 3. Product Card (`components/product-card.tsx`)

Updated to use database-driven badges:
- Conditional badge rendering based on database settings
- Proper positioning and styling
- Integration with existing badge system

### 4. Cart Context (`lib/cart-context.tsx`)

Enhanced to handle free gifts:
- Automatic addition of free gifts when products are added to cart
- Free gift items appear with £0.00 price
- Proper cart state management

## Usage Instructions

### Setting Up Badges

1. **Run the Migration**:
   ```bash
   node run-badge-migration.js
   ```

2. **Access Product Form**:
   - Go to Admin Dashboard
   - Edit or create a product
   - Scroll to "Product Badges" section

3. **Enable Badges**:
   - Check the boxes for desired badge types
   - For Free Gift badge, click "Select Product" to choose the gift

4. **Save Product**:
   - Badge settings are automatically saved with the product

### Managing Free Gifts

1. **Enable Free Gift Badge**:
   - Check the "Free Gift Badge" checkbox

2. **Select Gift Product**:
   - Click "Select Product" button
   - Choose from available products in the modal
   - Confirm selection

3. **Remove Gift Product**:
   - Click the X button on the selected gift
   - Or uncheck the Free Gift Badge checkbox

## Cart Behavior

When a product with a free gift badge is added to cart:

1. **Main Product**: Added normally with selected price
2. **Free Gift**: Automatically added with £0.00 price
3. **Cart Display**: Both items visible, gift clearly marked as "Free Gift"
4. **Checkout**: Gift included in order at no additional cost

## Styling and Appearance

### Badge Styling
- **Sale**: Orange background with hover effects
- **New In**: Darker orange with hover effects  
- **Free Gift**: Blue background (left side)
- **Product Badge**: Gray background (custom text)

### Interactive Features
- Hover effects with color transitions
- Scale transforms on hover
- Smooth animations
- Proper z-index layering

## Technical Notes

### Performance Considerations
- Badges are stored as JSONB for efficient querying
- Indexes on free_gifts table for fast lookups
- Minimal database queries for badge rendering

### Error Handling
- Graceful fallbacks when badge data is missing
- Validation of badge types and enabled states
- Safe handling of missing gift product references

### Responsive Design
- Badges adapt to different screen sizes
- Proper spacing and alignment on mobile devices
- Touch-friendly interactive elements

## Troubleshooting

### Common Issues

1. **Badges Not Showing**:
   - Check if badges are enabled in product form
   - Verify database migration was successful
   - Check browser console for errors

2. **Free Gift Not Working**:
   - Ensure free gift badge is enabled
   - Verify gift product is selected
   - Check cart context implementation

3. **Migration Errors**:
   - Run migration manually using SQL file
   - Check database permissions
   - Verify environment variables

### Debug Steps

1. Check product data in database
2. Verify badge JSON structure
3. Test cart functionality
4. Review browser console logs

## Future Enhancements

Potential improvements for the badge system:

1. **Badge Customization**:
   - Custom badge text
   - Color customization
   - Badge positioning options

2. **Advanced Badge Logic**:
   - Time-based badge display
   - Inventory-based badges
   - User role-based badges

3. **Analytics**:
   - Badge click tracking
   - Conversion rate analysis
   - Badge performance metrics

## Support

For issues or questions about the badge system:
1. Check this documentation
2. Review the migration logs
3. Test with sample products
4. Contact development team
