# Database (Sequelize + PostgreSQL / Neon)

## First-time setup

1. Set `DATABASE_URL` in `.env`.
2. Start the server — **tables are created automatically** when the backend runs: `npm run dev`
3. (Optional) Seed sample data: `npm run seed`

Note: `sync({ force: true })` drops and recreates all tables on every startup so you never need to run SQL by hand. For production, switch to migrations and remove `force: true`.

## Postman

- **Categories:** `GET/POST /api/categories`, `GET /api/categories/:id`
- **Collections:** `GET/POST /api/collections`, `GET /api/collections/:id`
- **Products:** `GET/POST /api/products`, `GET /api/products/:id`

After seeding, use GET to list and verify data.
