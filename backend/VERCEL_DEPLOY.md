# Deploy Backend to Vercel

## 1. Project settings

- **Root Directory:** Set to `backend` (so Vercel uses this folder as the project root).
- **Framework Preset:** Other (or Node.js).
- **Build Command:** `npm run build` (or leave default).
- **Output Directory:** Leave empty (this is a serverless API, not a static site).
- **Install Command:** `npm install`.

## 2. Environment variables

In Vercel → Project → Settings → Environment Variables, add:

| Name            | Value                    | Notes                    |
|-----------------|--------------------------|--------------------------|
| `DATABASE_URL`  | Your PostgreSQL URL      | **Required** for DB      |
| `JWT_SECRET`    | A long random string     | **Required** for auth    |
| `RAZORPAY_KEY_ID` | Your Razorpay key     | Optional, for payments  |
| `RAZORPAY_KEY_SECRET` | Your Razorpay secret | Optional, for payments  |

Apply to **Production**, **Preview**, and **Development** as needed.

## 3. Deploy

Push to your repo and let Vercel build, or run:

```bash
cd backend
npx vercel
```

## 4. API base URL

After deploy, your API base URL will be:

- `https://<your-project>.vercel.app/api`

So the frontend should use:

- `VITE_API_URL=https://<your-project>.vercel.app/api`

Example: `GET https://<your-project>.vercel.app/api/products`, `POST https://<your-project>.vercel.app/api/auth/login`, etc.

## 5. Database migration

Run the migration against your production DB **before** or right after first deploy (from your machine or a one-off script):

```bash
cd backend
npm run db:migrate
```

Use the same `DATABASE_URL` as in Vercel (or your production DB URL).

## 6. If you see 503 "Database not configured"

- Add `DATABASE_URL` in Vercel Environment Variables.
- Redeploy so the new env is picked up.
