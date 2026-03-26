# WhatsApp Admin Backend

A Node.js + TypeScript backend that integrates with WhatsApp Cloud API (Meta) to manage ecommerce products via WhatsApp messages. The system receives WhatsApp messages, interprets them as admin commands, and performs operations on a Neon PostgreSQL database.

## ⚠️ Quick Start

**See [QUICK_START.md](./QUICK_START.md) for common mistakes and correct message format!**

**Important:** Messages must start with the command name (e.g., `add_product`) and use `key=value` format, NOT `Key: value` format.

## Features

- ✅ WhatsApp webhook integration (Meta Cloud API)
- ✅ Product management (Add, Update, Delete)
- ✅ Product reports (Top products, Low stock)
- ✅ Excel export for sales data
- ✅ Real-time WhatsApp message replies

## Prerequisites

- Node.js 18+ and npm
- Neon PostgreSQL database
- Meta WhatsApp Business Account with Cloud API access
- ngrok (for local development)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```env
DATABASE_URL=postgresql://user:password@host.neon.tech/dbname?sslmode=require
WHATSAPP_TOKEN=your_whatsapp_access_token
WHATSAPP_PHONE_ID=your_phone_number_id
WHATSAPP_VERIFY_TOKEN=your_custom_verify_token
PORT=3000
```

3. Build the project:
```bash
npm run build
```

4. Start the server:
```bash
npm start
# or for development
npm run dev
```

## WhatsApp Webhook Setup

### 1. Local Development with ngrok

**📖 See [NGROK_SETUP.md](./NGROK_SETUP.md) for detailed instructions on finding your callback URL!**

1. Start your server:
```bash
npm run dev
```

2. In another terminal, start ngrok:
```bash
ngrok http 3000
```

3. **Find your callback URL:**
   - Look at ngrok output for: `Forwarding https://xxx.ngrok-free.app -> http://localhost:3000`
   - Or open ngrok dashboard: http://127.0.0.1:4040
   - Copy the HTTPS URL (e.g., `https://abc123.ngrok-free.app`)
   - **Add `/webhook` at the end:** `https://abc123.ngrok-free.app/webhook`

### 2. Configure Meta Developer Console

1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Select your WhatsApp app
3. Go to **Configuration** → **Webhooks**
4. Click **Edit** on the webhook subscription
5. Set **Callback URL**: `https://your-ngrok-url.ngrok.io/webhook`
6. Set **Verify Token**: (same as `WHATSAPP_VERIFY_TOKEN` in your `.env`)
7. Subscribe to `messages` field
8. Save changes

### 3. Test Webhook

The webhook should verify automatically. Check your server logs for:
```
✅ Webhook verified successfully
```

## How to Send WhatsApp Messages

### Option 1: Send from Your Phone (Recommended)

1. Add the WhatsApp Business number to your contacts
2. Send messages directly from your WhatsApp app
3. The system will automatically process and reply

### Option 2: Test via Meta Graph API Explorer

1. Go to [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
2. Select your app
3. Use POST method with endpoint: `/{PHONE_ID}/messages`
4. Add your access token
5. Use this body:
```json
{
  "messaging_product": "whatsapp",
  "recipient_type": "individual",
  "to": "YOUR_PHONE_NUMBER",
  "type": "text",
  "text": {
    "body": "add_product\ntitle=Test Product\nslug=test-product\nprice=999\nstock=10"
  }
}
```

### Option 3: Use cURL

```bash
curl -X POST "https://graph.facebook.com/v21.0/{PHONE_ID}/messages" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "messaging_product": "whatsapp",
    "recipient_type": "individual",
    "to": "YOUR_PHONE_NUMBER",
    "type": "text",
    "text": {
      "body": "add_product\ntitle=Test Product\nslug=test-product\nprice=999\nstock=10"
    }
  }'
```

## Command Reference

All commands are case-insensitive. Use newlines to separate command and parameters.

### 1. Add Product

**⚠️ IMPORTANT:** The first line MUST be the command name (`add_product`), then use `key=value` format (NOT `Key: value`)

**Format:**
```
add_product
title=<product-title>
slug=<product-slug>
brand=<brand-name>
material=<material>
price=<price>
stock=<stock-quantity>
image_url=<image-url>
```

**Example (Copy this exact format):**
```
add_product
title=Cotton T-Shirt
slug=cotton-tshirt
brand=Nike
material=Cotton
price=599.99
stock=50
image_url=https://example.com/image.jpg
```

**❌ WRONG Format (Don't do this):**
```
Title: Cotton T-Shirt
Slug: cotton-tshirt
Price: ₹599.99
```

**✅ CORRECT Format:**
```
add_product
title=Cotton T-Shirt
slug=cotton-tshirt
price=599.99
```

**Required Fields:**
- `title` - Product title
- `slug` - Unique URL-friendly slug
- `price` - Product price (number)
- `stock` - Stock quantity (number)

**Optional Fields:**
- `brand` - Brand name
- `material` - Material type
- `image_url` - Product image URL (can also use `imageurl` or `image`)

**Response:**
```
✅ Product Added Successfully

Title: Cotton T-Shirt
Slug: cotton-tshirt
Brand: Nike
Material: Cotton
Price: ₹599.99
Stock: 50
Image: https://example.com/image.jpg
```

---

### 2. Update Product

**Format:**
```
update_product
slug=<product-slug>
price=<new-price>
```

or

```
update_product
slug=<product-slug>
stock=<new-stock>
```

or

```
update_product
slug=<product-slug>
image_url=<new-image-url>
```

or any combination:

```
update_product
slug=<product-slug>
price=<new-price>
stock=<new-stock>
image_url=<new-image-url>
```

**Example:**
```
update_product
slug=cotton-tshirt
price=699.99
```

or

```
update_product
slug=cotton-tshirt
stock=75
```

or

```
update_product
slug=cotton-tshirt
image_url=https://example.com/new-image.jpg
```

**Required Fields:**
- `slug` - Product slug to update
- At least one of: `price`, `stock`, or `image_url`

**Optional Fields:**
- `price` - New product price
- `stock` - New stock quantity
- `image_url` - New product image URL (can also use `imageurl` or `image`)

**Response:**
```
✅ Product Updated Successfully

Title: Cotton T-Shirt
Slug: cotton-tshirt
Price: ₹699.99
Stock: 75
Image: https://example.com/new-image.jpg
```

---

### 3. Delete Product

**Format:**
```
delete_product
slug=<product-slug>
```

**Example:**
```
delete_product
slug=cotton-tshirt
```

**Required Fields:**
- `slug` - Product slug to delete

**Response:**
```
✅ Product with slug "cotton-tshirt" deleted successfully.
```

---

### 4. Report Top Products

**Format:**
```
report_top_products
```

**Example:**
```
report_top_products
```

**Response:**
```
📊 *Top Products (Highest Stock)*

1. *Cotton T-Shirt*
   Slug: cotton-tshirt
   Price: ₹599.99
   Stock: 50
   Brand: Nike

2. *Denim Jeans*
   Slug: denim-jeans
   Price: ₹1299.99
   Stock: 30
   Brand: Levi's

...
```

---

### 5. Report Low Stock Products

**Format:**
```
report_low_products
```

**Example:**
```
report_low_products
```

**Response:**
```
⚠️ *Low Stock Products*

1. *Running Shoes*
   Slug: running-shoes
   Price: ₹2999.99
   Stock: 3
   Brand: Adidas

2. *Baseball Cap*
   Slug: baseball-cap
   Price: ₹499.99
   Stock: 5
   Brand: Nike

...
```

**Note:** Shows products with stock ≤ 10 units.

---

### 6. Export Sales Excel

**Format:**
```
export_sales_excel
```

**Example:**
```
export_sales_excel
```

**Response:**
```
✅ Sales report generated successfully!

File: sales-report-2024-01-15.xlsx
Size: 45.23 KB

⚠️ Note: Document upload requires media storage configuration. 
Please contact administrator to set up document delivery.
```

**Note:** Excel file generation is implemented. Document upload via WhatsApp requires additional media storage setup (S3, Cloudinary, etc.).

---

## Quick Test Messages

Copy and paste these messages in WhatsApp to test:

### Test Add Product
```
add_product
title=Test Product
slug=test-product-123
brand=Test Brand
material=Cotton
price=999.99
stock=25
image_url=https://example.com/test-image.jpg
```

### Test Update Product
```
update_product
slug=test-product-123
price=1199.99
```

### Test Update Stock
```
update_product
slug=test-product-123
stock=50
```

### Test Delete Product
```
delete_product
slug=test-product-123
```

### Test Reports
```
report_top_products
```

```
report_low_products
```

```
export_sales_excel
```

---

## Error Messages

The system will send error messages if something goes wrong:

- `❌ Invalid message format.` - Message format is incorrect (sends when message can't be parsed)
- `❌ Invalid message: <error>` - Command validation failed
- `❌ Missing required parameter: <field>` - Required field is missing
- `❌ Product with slug "<slug>" already exists.` - Duplicate slug
- `❌ Product with slug "<slug>" not found.` - Product doesn't exist
- `❌ Unknown command: <command>` - Command not recognized
- `❌ Error: <error-message>` - General error with details

**Note:** When you send an invalid message, the system will respond with "❌ Invalid message format" and show available commands.

---

## Project Structure

```
omnivisio/
├── src/
│   ├── config/
│   │   ├── neon.ts              # Database connection
│   │   └── whatsapp.config.ts   # WhatsApp configuration
│   ├── controllers/
│   │   └── whatsapp.controller.ts  # Webhook handlers
│   ├── services/
│   │   ├── whatsapp.service.ts  # Message processing & replies
│   │   ├── product.service.ts   # Product CRUD operations
│   │   └── report.service.ts    # Reports & Excel export
│   ├── routes/
│   │   └── whatsapp.routes.ts   # Webhook routes
│   ├── utils/
│   │   └── messageParser.ts     # Command parser
│   ├── db/
│   │   └── init.ts              # Database initialization
│   ├── app.ts                   # Express app setup
│   └── server.ts                # Server entry point
├── package.json
├── tsconfig.json
└── README.md
```

---

## Database Schema

The system uses existing tables from your database:

### `products` table
- `id` (UUID)
- `title` (VARCHAR)
- `slug` (VARCHAR, unique)
- `brand` (VARCHAR, nullable)
- `material` (VARCHAR, nullable)
- `is_active` (BOOLEAN)
- `created_at`, `updated_at`

### `product_variants` table
- `id` (UUID)
- `product_id` (UUID, foreign key)
- `sku` (VARCHAR, unique)
- `price` (DECIMAL)
- `stock_quantity` (INTEGER)
- `created_at`, `updated_at`

---

## SQL Queries to Verify Data

### Check if Product Was Added (by slug)

```sql
-- Check product details
SELECT 
  id,
  title,
  slug,
  brand,
  material,
  is_active,
  created_at,
  updated_at
FROM products
WHERE slug = 'cotton-tshirt';
```

### Check Product with Variant (Combined Query)

```sql
-- Check product with its variant details
SELECT 
  p.id as product_id,
  p.title,
  p.slug,
  p.brand,
  p.material,
  p.is_active,
  pv.id as variant_id,
  pv.sku,
  pv.price,
  pv.stock_quantity,
  p.created_at as product_created,
  pv.created_at as variant_created
FROM products p
LEFT JOIN product_variants pv ON pv.product_id = p.id
WHERE p.slug = 'cotton-tshirt';
```

### Check All Recent Products (Last 10)

```sql
-- View all recently added products with variants
SELECT 
  p.title,
  p.slug,
  p.brand,
  p.material,
  pv.price,
  pv.stock_quantity,
  pv.sku,
  p.created_at
FROM products p
LEFT JOIN product_variants pv ON pv.product_id = p.id
ORDER BY p.created_at DESC
LIMIT 10;
```

### Check Variant Details Only

```sql
-- Check variant details for a specific product
SELECT 
  pv.id,
  pv.product_id,
  pv.sku,
  pv.price,
  pv.stock_quantity,
  p.title as product_title,
  p.slug as product_slug
FROM product_variants pv
JOIN products p ON p.id = pv.product_id
WHERE p.slug = 'cotton-tshirt';
```

### Verify Expected Data for "Cotton T-Shirt"

```sql
-- Complete verification query - should return 1 row if added correctly
SELECT 
  p.title,
  p.slug,
  p.brand,
  p.material,
  p.is_active,
  pv.price,
  pv.stock_quantity,
  pv.sku,
  CASE 
    WHEN p.title = 'Cotton T-Shirt' THEN '✅ Title matches'
    ELSE '❌ Title mismatch'
  END as title_check,
  CASE 
    WHEN p.slug = 'cotton-tshirt' THEN '✅ Slug matches'
    ELSE '❌ Slug mismatch'
  END as slug_check,
  CASE 
    WHEN p.brand = 'Nike' THEN '✅ Brand matches'
    ELSE '❌ Brand mismatch'
  END as brand_check,
  CASE 
    WHEN p.material = 'Cotton' THEN '✅ Material matches'
    ELSE '❌ Material mismatch'
  END as material_check,
  CASE 
    WHEN pv.price = 599.99 THEN '✅ Price matches'
    ELSE '❌ Price mismatch'
  END as price_check,
  CASE 
    WHEN pv.stock_quantity = 50 THEN '✅ Stock matches'
    ELSE '❌ Stock mismatch'
  END as stock_check
FROM products p
LEFT JOIN product_variants pv ON pv.product_id = p.id
WHERE p.slug = 'cotton-tshirt';
```

### Count Total Products

```sql
-- Count total products in database
SELECT COUNT(*) as total_products FROM products;
```

### Count Products with Variants

```sql
-- Count products that have variants
SELECT 
  COUNT(DISTINCT p.id) as products_with_variants,
  COUNT(pv.id) as total_variants
FROM products p
LEFT JOIN product_variants pv ON pv.product_id = p.id;
```

---

## Troubleshooting

### Webhook not receiving messages
1. Check ngrok is running and URL is correct
2. Verify webhook URL in Meta Developer Console
3. Check `WHATSAPP_VERIFY_TOKEN` matches in both places
4. Ensure server is running and accessible

### Database connection errors
1. Verify `DATABASE_URL` in `.env` is correct
2. Check Neon database is accessible
3. Ensure SSL mode is set correctly for Neon

### Messages not being processed
1. Check server logs for errors
2. Verify WhatsApp token has correct permissions
3. Ensure phone number format is correct (with country code, no +)

### Excel export not working
- Excel generation works, but document upload requires media storage setup
- For now, the system sends a message with file details
- To enable document upload, implement media storage (S3/Cloudinary) and update `uploadMediaToWhatsApp` function

---

## Development

### Run in development mode:
```bash
npm run dev
```

### Build for production:
```bash
npm run build
npm start
```

### Console Logging

All operations are logged to the console with detailed information. Watch your backend console to verify operations:

#### Add Product Logs:
```
📦 [ADD PRODUCT] Starting product creation: { title, slug, brand, ... }
✅ [ADD PRODUCT] Product created with ID: <uuid>
✅ [ADD PRODUCT] Variant created with ID: <uuid>, SKU: <sku>
✅ [ADD PRODUCT] Image added: <url> (if image provided)
✅ [ADD PRODUCT] Transaction committed successfully for product: <title> (<slug>)
```

#### Update Product Logs:
```
🔄 [UPDATE PRODUCT] Starting product update: { slug, price, stock, ... }
✅ [UPDATE PRODUCT] Product found: <title> (ID: <uuid>)
🔄 [UPDATE PRODUCT] Updating price to: <price>
🔄 [UPDATE PRODUCT] Updating stock to: <stock>
✅ [UPDATE PRODUCT] Variant updated successfully
✅ [UPDATE PRODUCT] Image updated: <url> (if image provided)
✅ [UPDATE PRODUCT] Transaction committed successfully for product: <slug>
```

#### Delete Product Logs:
```
🗑️ [DELETE PRODUCT] Attempting to delete product with slug: <slug>
📋 [DELETE PRODUCT] Found product: <title> (ID: <uuid>)
✅ [DELETE PRODUCT] Product deleted successfully: <title> (<slug>)
```

#### Error Logs:
```
❌ [ADD PRODUCT] Error: <error message>
❌ [UPDATE PRODUCT] Product with slug "<slug>" not found
❌ Invalid message format - sending error response
```

### Check logs:
All operations are logged to console with emoji indicators:
- ✅ Success
- ❌ Error
- ⚠️ Warning
- 📊 Report/Data
- 📦 Add Product
- 🔄 Update Product
- 🗑️ Delete Product

---

## Security Notes

- Never commit `.env` file to version control
- Keep `WHATSAPP_TOKEN` secure
- Use strong `WHATSAPP_VERIFY_TOKEN`
- Validate all inputs before database operations
- Use HTTPS in production (ngrok provides this for development)

---

## Support

For issues or questions:
1. Check server logs for detailed error messages
2. Verify all environment variables are set correctly
3. Ensure database tables exist and are accessible
4. Test webhook with Meta's webhook tester

---

## License

ISC
