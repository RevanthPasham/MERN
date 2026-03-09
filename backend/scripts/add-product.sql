-- Add a product via SQL (PostgreSQL)
-- Run this in your DB client (psql, pgAdmin, DBeaver, etc.)
-- Replace the placeholder values with your own.

-- 1) Insert product (slug must be unique)
INSERT INTO products (
  id,
  title,
  slug,
  description,
  category_id,
  brand,
  material,
  is_active,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'My Product Title',
  'my-product-slug',           -- must be unique, URL-friendly (e.g. lowercase, hyphens)
  'Optional product description.',
  NULL,                         -- or a UUID from: SELECT id FROM categories LIMIT 1;
  'Brand Name',
  'Cotton',
  true,
  NOW(),
  NOW()
)
RETURNING id;
-- Copy the returned id for the next steps (or use the slug to look it up).

-- 2) Insert one variant (required). Use the product id from step 1.
-- Replace <PRODUCT_ID> with the actual UUID from RETURNING id above.
INSERT INTO product_variants (
  id,
  product_id,
  sku,
  price,
  compare_at_price,
  cost_price,
  stock_quantity,
  weight,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  '<PRODUCT_ID>',               -- e.g. 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
  'my-product-slug-S-1',        -- must be unique (e.g. slug-S-timestamp)
  999.00,                       -- price in INR (or your currency)
  NULL,                         -- optional compare-at price
  NULL,                         -- optional cost price
  10,                           -- stock
  NULL,
  NOW(),
  NOW()
)
RETURNING id;
-- Copy this variant id if you add images in step 3.

-- 3) Optional: add images for the variant. Replace <VARIANT_ID> with variant id from step 2.
-- INSERT INTO product_images (id, variant_id, url, sort_order, alt_text)
-- VALUES
--   (gen_random_uuid(), '<VARIANT_ID>', 'https://example.com/image1.jpg', 0, 'Alt text 1'),
--   (gen_random_uuid(), '<VARIANT_ID>', 'https://example.com/image2.jpg', 1, 'Alt text 2');


-- ========== One-shot example (all in one go with CTEs) ==========
-- Use this if you want to add product + variant in one run without copying IDs.

/*
WITH new_product AS (
  INSERT INTO products (id, title, slug, description, category_id, brand, material, is_active, created_at, updated_at)
  VALUES (
    gen_random_uuid(),
    'Another Product',
    'another-product-slug',
    'Description here.',
    NULL,
    'Brand',
    NULL,
    true,
    NOW(),
    NOW()
  )
  RETURNING id
),
new_variant AS (
  INSERT INTO product_variants (id, product_id, sku, price, stock_quantity, created_at, updated_at)
  SELECT
    gen_random_uuid(),
    id,
    'another-product-slug-S-' || extract(epoch from now())::bigint,
    599.00,
    5,
    NOW(),
    NOW()
  FROM new_product
  RETURNING id, product_id
)
SELECT * FROM new_variant;
*/
