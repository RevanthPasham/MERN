-- Run this migration against your PostgreSQL database.
-- Addresses table (new)
CREATE TABLE IF NOT EXISTS addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  full_name VARCHAR(120) NOT NULL,
  phone_number VARCHAR(24) NOT NULL,
  country VARCHAR(80) NOT NULL,
  state VARCHAR(80) NOT NULL,
  city VARCHAR(80) NOT NULL,
  area VARCHAR(120) NOT NULL,
  street_address VARCHAR(255) NOT NULL,
  landmark VARCHAR(120),
  postal_code VARCHAR(20) NOT NULL,
  address_type VARCHAR(20) NOT NULL DEFAULT 'Home',
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP(6) NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP(6) NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_addresses_user_default ON addresses(user_id, is_default);

-- Orders: add new columns (if table already exists)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'address_id') THEN
    ALTER TABLE orders ADD COLUMN address_id UUID REFERENCES addresses(id) ON DELETE SET NULL;
    CREATE INDEX IF NOT EXISTS idx_orders_address_id ON orders(address_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'total_amount') THEN
    ALTER TABLE orders ADD COLUMN total_amount DECIMAL(12,2) NOT NULL DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'payment_method') THEN
    ALTER TABLE orders ADD COLUMN payment_method VARCHAR(40) NOT NULL DEFAULT 'razorpay';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'payment_status') THEN
    ALTER TABLE orders ADD COLUMN payment_status VARCHAR(20) NOT NULL DEFAULT 'paid';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'order_status') THEN
    ALTER TABLE orders ADD COLUMN order_status VARCHAR(20) NOT NULL DEFAULT 'Processing';
  END IF;
END $$;

-- Order items: add product snapshot columns
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'order_items' AND column_name = 'product_name') THEN
    ALTER TABLE order_items ADD COLUMN product_name VARCHAR(255) NOT NULL DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'order_items' AND column_name = 'product_price') THEN
    ALTER TABLE order_items ADD COLUMN product_price DECIMAL(12,2) NOT NULL DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'order_items' AND column_name = 'subtotal') THEN
    ALTER TABLE order_items ADD COLUMN subtotal DECIMAL(12,2) NOT NULL DEFAULT 0;
  END IF;
END $$;

-- Backfill order_items: set product_name, product_price, subtotal from products/product_variants (optional)
-- UPDATE order_items oi SET product_name = p.title, product_price = COALESCE((SELECT price FROM product_variants WHERE product_id = p.id ORDER BY price ASC LIMIT 1), 0), subtotal = quantity * COALESCE((SELECT price FROM product_variants WHERE product_id = p.id ORDER BY price ASC LIMIT 1), 0) FROM products p WHERE oi.product_id = p.id AND (oi.product_name = '' OR oi.product_name IS NULL);
