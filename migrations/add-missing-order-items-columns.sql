-- Add missing variant property columns to order_items table
ALTER TABLE public.order_items
ADD COLUMN IF NOT EXISTS product_depth TEXT,
ADD COLUMN IF NOT EXISTS product_firmness TEXT,
ADD COLUMN IF NOT EXISTS product_length TEXT,
ADD COLUMN IF NOT EXISTS product_width TEXT,
ADD COLUMN IF NOT EXISTS product_height TEXT,
ADD COLUMN IF NOT EXISTS product_weight TEXT,
ADD COLUMN IF NOT EXISTS product_material TEXT,
ADD COLUMN IF NOT EXISTS product_brand TEXT;

-- Add comments for documentation
COMMENT ON COLUMN public.order_items.product_depth IS 'Depth variant of the product';
COMMENT ON COLUMN public.order_items.product_firmness IS 'Firmness variant of the product';
COMMENT ON COLUMN public.order_items.product_length IS 'Length dimension of the product';
COMMENT ON COLUMN public.order_items.product_width IS 'Width dimension of the product';
COMMENT ON COLUMN public.order_items.product_height IS 'Height dimension of the product';
COMMENT ON COLUMN public.order_items.product_weight IS 'Weight of the product';
COMMENT ON COLUMN public.order_items.product_material IS 'Material of the product';
COMMENT ON COLUMN public.order_items.product_brand IS 'Brand of the product';

