# Free Gift System Fix Guide

## 🚨 Issue Summary

The free gift products are not being fetched and added to the cart automatically when the original product is added. This is happening because the free gift system requires proper configuration in both the database and the frontend.

## 🔍 Root Causes

The free gift functionality requires **both** of these conditions to be met:

1. **A `free_gift` badge must be enabled** in the `badges` array
2. **The `free_gift_product_id` and `free_gift_enabled` fields must be set**

### Current Problem

The product card component is checking for both conditions:
```typescript
const freeGiftBadge = safeProduct.badges?.find(b => b.type === 'free_gift' && b.enabled)

if (freeGiftBadge && safeProduct.free_gift_product_id) {
  // Add free gift to cart
}
```

If either the badge is missing or the free gift fields aren't set, the free gift won't be added.

## 🛠️ Solutions

### Solution 1: Run the Migration (Recommended)

First, ensure the database has the required fields:

```bash
node run-badge-migration.js
```

This will add:
- `badges` JSONB field to products table
- `free_gift_product_id` UUID field to products table  
- `free_gift_enabled` BOOLEAN field to products table
- `free_gifts` table for relationship tracking

### Solution 2: Use the Fix Script

Run the automated fix script:

```bash
node fix-free-gift.js
```

This will:
1. Find available products
2. Set up a test free gift relationship
3. Configure badges and free gift fields
4. Verify the setup

### Solution 3: Manual Configuration

1. **Go to Admin Dashboard**
2. **Edit a product** that should have a free gift
3. **Enable "Free Gift Badge"** checkbox
4. **Click "Select Product"** to choose the gift product
5. **Save the product**

## 🔧 Code Changes Made

### 1. Enhanced Product Card Logic

Updated `components/product-card.tsx` to check for free gifts in multiple ways:

```typescript
// Check if this product has a free gift - multiple ways to detect
const freeGiftBadge = safeProduct.badges?.find(b => b.type === 'free_gift' && b.enabled)
const hasFreeGiftFromFields = safeProduct.free_gift_product_id && safeProduct.free_gift_enabled

// Add free gift details if available - check both badge and direct fields
if ((freeGiftBadge || hasFreeGiftFromFields) && safeProduct.free_gift_product_id) {
  // Add free gift to cart
}
```

### 2. Better Debugging

Added comprehensive logging to help diagnose issues:

```typescript
console.log('No free gift details available - reasons:', {
  hasFreeGiftBadge: !!freeGiftBadge,
  hasFreeGiftFields: hasFreeGiftFromFields,
  hasFreeGiftProductId: !!safeProduct.free_gift_product_id,
  badges: safeProduct.badges,
  free_gift_enabled: safeProduct.free_gift_enabled
})
```

## 🧪 Testing

### 1. Run the Test Script

```bash
node test-free-gift.js
```

This will check:
- Database schema
- Products with free gifts
- Products with free_gift badges
- Free_gifts table
- Provide recommendations

### 2. Browser Console

Check the browser console when adding products to cart. You should see:
- Product being added to cart
- Free gift detection logic
- Whether free gift is being added

### 3. Cart State

Verify that both the main product and free gift appear in the cart:
- Main product with normal price
- Free gift with £0.00 price
- Free gift notification

## 📋 Required Database Fields

### Products Table
```sql
badges JSONB DEFAULT '[]'  -- Array of badge objects
free_gift_product_id UUID REFERENCES products(id)  -- Reference to gift product
free_gift_enabled BOOLEAN DEFAULT FALSE  -- Whether free gift is enabled
```

### Badge Structure
```json
[
  {
    "type": "free_gift",
    "enabled": true
  }
]
```

### Free Gifts Table
```sql
CREATE TABLE free_gifts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  gift_product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, gift_product_id)
);
```

## 🚀 Quick Fix Steps

1. **Run migration**: `node run-badge-migration.js`
2. **Run fix script**: `node fix-free-gift.js`
3. **Test on website**: Add product with free gift to cart
4. **Check console**: Look for debug information
5. **Verify cart**: Both products should appear

## 🔍 Troubleshooting

### Free Gift Not Appearing

1. **Check database fields**:
   ```bash
   node test-free-gift.js
   ```

2. **Verify badge configuration**:
   - Badge type: `free_gift`
   - Badge enabled: `true`
   - `free_gift_product_id` set
   - `free_gift_enabled` set to `true`

3. **Check browser console**:
   - Look for "Product being added to cart" log
   - Check "No free gift details available" reasons

### Common Issues

1. **Migration not run**: Database missing required fields
2. **Badge not enabled**: `free_gift` badge disabled or missing
3. **Gift product not selected**: `free_gift_product_id` is null
4. **API not returning data**: Check if fields are included in API response

## 📞 Support

If the issue persists after following this guide:

1. Run `node test-free-gift.js` and share the output
2. Check browser console for error messages
3. Verify database fields exist and contain data
4. Ensure the migration has been run successfully

## 🎯 Expected Behavior

After fixing:

1. **Product with free gift badge** displays blue "Free Gift" badge
2. **Adding to cart** automatically includes the free gift
3. **Cart shows both items**: main product + free gift (£0.00)
4. **Free gift notification** appears
5. **Checkout includes** both products

The free gift system should work seamlessly once properly configured!
