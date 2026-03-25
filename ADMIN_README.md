# Admin Guide: Products, Collections, Banners & Address/Order Setup

This guide explains how **products**, **collections**, and **banners** relate, and how to add them via API or SQL. It also covers the **address and order** schema added for checkout and order history.

---

## 1. How products, collections, and banners work together

### Products
- Stored in `products` (title, slug, description, category_id, brand, material, is_active).
- Each product has one or more **variants** in `product_variants` (sku, price, stock_quantity, etc.).
- Each variant can have **images** in `product_images` (url, alt_text, sort_order).
- Products can belong to a **category** (optional) via `category_id`.
- Products are linked to **collections** via the **many-to-many** table `product_collections` (product_id, collection_id).

### Collections
- Stored in `collections` (name, slug, description, banner_image, is_active).
- A collection is a grouping of products (e.g. "Summer Sale", "New Arrivals").
- The **slug** is used in URLs (e.g. `/collections/summer-sale`) and is what **banners** use to link to a collection.

### Banners
- Stored in `banners` (title, highlight, subtitle, cta, **collection_slug**, image_url, sort_order, is_active).
- **collection_slug** must match the `slug` of an existing **collection**. When a user clicks the banner CTA, they are taken to that collection page (e.g. `/collections/summer-sale`).
- So: **Banner → collection_slug → Collection (by slug) → Products (via product_collections)**.

### Flow summary
1. Create a **collection** (e.g. slug `summer-sale`).
2. Create **products** and **product_variants** (and optionally **product_images**).
3. Link products to the collection by inserting into **product_collections** (product_id, collection_id).
4. Create a **banner** with `collection_slug = 'summer-sale'`. The banner will direct users to the collection page, which lists all products in that collection.

---

## 2. Adding products (overview)

- **API:** `POST /api/products` with body (title, slug, description, categoryId, brand, material, isActive). You still need to add variants and images (e.g. via separate logic or SQL).
- Products appear in listing and search when `is_active = true`. Product listing uses the **lowest variant price** and first variant image.

To have a product show with prices and image you need at least one **product_variant** and optionally **product_images** for that variant.

---

## 3. Adding collections

- **API:** `POST /api/collections` with body: `{ "name": "Summer Sale", "slug": "summer-sale", "description": "...", "bannerImage": null, "isActive": true }`.
- **SQL:**

```sql
INSERT INTO collections (id, name, slug, description, banner_image, is_active, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'Summer Sale',
  'summer-sale',
  'Best summer styles',
  NULL,
  true,
  NOW(),
  NOW()
);
```

To get the new collection’s id (for linking products):

```sql
SELECT id, slug FROM collections WHERE slug = 'summer-sale';
```

---

## 4. Linking products to a collection (related products)

Products are linked to collections only through **product_collections**. A product can be in many collections.

- **SQL:** Use the `id` of the collection and the `id` of the product.

```sql
-- Replace COLLECTION_ID and PRODUCT_ID with actual UUIDs from your DB.
INSERT INTO product_collections (id, product_id, collection_id)
VALUES (gen_random_uuid(), 'PRODUCT_ID', 'COLLECTION_ID');
```

Example: add product to "summer-sale" collection by slug:

```sql
INSERT INTO product_collections (id, product_id, collection_id)
SELECT gen_random_uuid(), p.id, c.id
FROM products p, collections c
WHERE p.slug = 'my-product-slug'
  AND c.slug = 'summer-sale'
  AND NOT EXISTS (
    SELECT 1 FROM product_collections pc
    WHERE pc.product_id = p.id AND pc.collection_id = c.id
  );
```

---

## 5. Adding banners

Banners are shown on the home page. Each banner has a **collection_slug** that must match a collection’s **slug**. Clicking the banner takes the user to that collection.

- **SQL:**

```sql
INSERT INTO banners (
  id, title, highlight, subtitle, cta, collection_slug, image_url, sort_order, is_active, created_at, updated_at
)
VALUES (
  gen_random_uuid(),
  'Summer Sale',
  'Up to 50% off',
  'Limited time only',
  'Shop now',
  'summer-sale',   -- must match collections.slug
  'https://example.com/banner.jpg',
  0,
  true,
  NOW(),
  NOW()
);
```

- **Matching rule:** `banners.collection_slug` = `collections.slug`. So create the collection first, then create the banner with that slug.

---

## 6. End-to-end SQL example: new collection + product + link + banner

```sql
-- 1) Create collection
INSERT INTO collections (id, name, slug, description, banner_image, is_active, created_at, updated_at)
VALUES (gen_random_uuid(), 'New Arrivals', 'new-arrivals', 'Latest products', NULL, true, NOW(), NOW());

-- 2) Get collection id (use in step 4)
-- SELECT id FROM collections WHERE slug = 'new-arrivals';

-- 3) Create category if needed (optional)
-- INSERT INTO categories (id, name, slug, parent_id, created_at, updated_at)
-- VALUES (gen_random_uuid(), 'Apparel', 'apparel', NULL, NOW(), NOW());

-- 4) Create product (use category_id from step 3 or NULL)
INSERT INTO products (id, title, slug, description, category_id, brand, material, is_active, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'Classic T-Shirt',
  'classic-tshirt',
  'A comfortable cotton tee',
  NULL,
  'Houseof',
  'Cotton',
  true,
  NOW(),
  NOW()
);

-- 5) Add variant (use product id from step 4)
INSERT INTO product_variants (id, product_id, sku, price, compare_at_price, stock_quantity, created_at, updated_at)
SELECT gen_random_uuid(), id, 'TSHIRT-001', 999.00, 1299.00, 100, NOW(), NOW()
FROM products WHERE slug = 'classic-tshirt';

-- 6) Link product to collection (product_id and collection_id from above)
INSERT INTO product_collections (id, product_id, collection_id)
SELECT gen_random_uuid(), p.id, c.id
FROM products p, collections c
WHERE p.slug = 'classic-tshirt' AND c.slug = 'new-arrivals';

-- 7) Add banner that links to this collection
INSERT INTO banners (id, title, highlight, subtitle, cta, collection_slug, image_url, sort_order, is_active, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'New Arrivals',
  'Just landed',
  'Fresh styles this season',
  'Shop now',
  'new-arrivals',
  'https://example.com/new-arrivals-banner.jpg',
  0,
  true,
  NOW(),
  NOW()
);
```

---

## 7. Address and order system (migrations)

The app includes:

- **Addresses:** `addresses` table (user_id, full_name, phone_number, country, state, city, area, street_address, landmark, postal_code, address_type, is_default, etc.).
- **Orders:** `orders` has `address_id`, `total_amount`, `payment_method`, `payment_status`, `order_status`; `order_items` has `product_name`, `product_price`, `subtotal` (snapshot at order time).

Run the migration once (PostgreSQL). **Note:** The migration assumes `orders` and `order_items` tables already exist (e.g. from a previous backend run or sync). If you use a completely fresh DB, run the backend once so those tables are created, then run this migration.

```bash
psql "$DATABASE_URL" -f backend/src/db/migrations/001_address_and_order_updates.sql
```

Or run the SQL file contents in your DB client. This creates `addresses` and adds new columns to `orders` and `order_items` if they already exist.

---

## 8. Quick reference: table relationships

| Entity     | Table                | Links to                          |
|-----------|----------------------|------------------------------------|
| Product   | products             | categories (category_id)          |
| Variant   | product_variants     | products (product_id)             |
| Image     | product_images       | product_variants (variant_id)      |
| Collection| collections          | — (identified by slug)             |
| Product–Collection | product_collections | products, collections (many-to-many) |
| Banner    | banners              | collections via collection_slug (slug) |
| Address   | addresses            | users (user_id)                    |
| Order     | orders               | users (user_id), addresses (address_id) |
| Order item| order_items          | orders (order_id), products (product_id) |

---

## 9. Creating a new collection and related products (summary)

1. Create the collection (API or SQL) and note its `slug` and `id`.
2. Create or select products. Link them to the collection with `product_collections` (product_id, collection_id).
3. Optionally add a banner with `collection_slug` = that collection’s slug so the homepage links to it.

Products in a collection are shown on the collection page (e.g. `/collections/summer-sale`). Banners do not store product IDs—they only store the collection slug; the frontend loads the collection by slug and then shows its products.
