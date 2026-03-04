# Admin Panel

Separate frontend for store admins. Login with email/password (OTP can be added later).

## Setup

1. **Backend** must be running and have:
   - Migration run (`npm run db:migrate` in backend), including `admins` table.
   - At least one admin user. Create one:
     ```bash
     cd backend
     ADMIN_EMAIL=your@email.com ADMIN_PASSWORD=yourpassword npm run create-admin
     ```

2. **Environment**
   - Create `.env` in `admin-frontend` with:
     ```
     VITE_API_URL=http://localhost:4000/api
     ```
   - For production, set `VITE_API_URL` to your backend API base (e.g. `https://your-api.vercel.app/api`).

3. **Install and run**
   ```bash
   cd admin-frontend
   npm install
   npm run dev
   ```
   Opens at http://localhost:5174 (or next free port).

## Features

- **Orders**: Filter new vs completed, see user + address + items, update status (Processing → Shipped → Delivered).
- **Products**: List all (including inactive), add product, edit (e.g. name, slug, active).
- **Collections**: List, add, edit; link products to a collection (which collection a product appears in).
- **Banners**: List, add, edit; each banner has a **collection slug** — that slug must match a collection so the banner links to the right collection page.
- **Carts**: See which users have items in cart (email, name, items).
- **Analytics**: Total revenue, total orders, orders by status, top/least selling products, **Download CSV** (orders export).

## Flow: Collections & Banners

- **Collections** group products. A product can be in many collections (set in Collections → select collection → check products → Save).
- **Banners** show on the homepage. Each banner has `collectionSlug`. When a user clicks the banner, they go to `/collections/{collectionSlug}`. So create the collection first, then create a banner with that collection’s slug.
