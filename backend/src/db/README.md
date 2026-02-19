# Database (Sequelize + PostgreSQL / Neon)

## First-time setup

1. Set `DATABASE_URL` in `.env`.
2. If you had an **old `collections` table** (from the previous raw-SQL setup), drop it so the new schema can be applied:
   ```sql
   DROP TABLE IF EXISTS product_collections CASCADE;
   DROP TABLE IF EXISTS collections CASCADE;
   ```
   Or drop all app tables and let Sequelize recreate them.
3. Start the server (creates/alters tables): `npm run dev`
4. Seed sample data: `npm run seed`

## Postman

- **Categories:** `GET/POST /api/categories`, `GET /api/categories/:id`
- **Collections:** `GET/POST /api/collections`, `GET /api/collections/:id`
- **Products:** `GET/POST /api/products`, `GET /api/products/:id`

After seeding, use GET to list and verify data.
