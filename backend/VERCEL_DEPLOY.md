# Backend Deployment (Vercel)

This backend is deployed as a **serverless API on Vercel**.

---

## 🚀 Overview

- Runtime: Node.js (Serverless Functions)
- Deployment: Vercel
- Database: PostgreSQL
- Auth: JWT
- Payments: Razorpay (optional)

---

## 📁 Project Structure

backend/
├── api/                # Serverless functions (routes)
│   ├── auth.ts
│   ├── products.ts
│   └── health.ts
├── package.json
├── vercel.json
└── ...

### Important
Each file inside `/api` becomes an endpoint:
- `/api/auth` → auth routes
- `/api/products` → product routes

---

## ⚙️ Vercel Configuration

### Project Settings

| Setting             | Value              |
|--------------------|-------------------|
| Root Directory      | `backend`         |
| Framework Preset    | Node.js / Other   |
| Build Command       | `npm run build`   |
| Install Command     | `npm install`     |
| Output Directory    | (leave empty)     |

---

## 🔐 Environment Variables

Add these in **Vercel → Settings → Environment Variables**

| Name                     | Required | Description                         |
|--------------------------|----------|-------------------------------------|
| DATABASE_URL             | ✅       | PostgreSQL connection string        |
| JWT_SECRET               | ✅       | Secret key for authentication       |
| RAZORPAY_KEY_ID          | ❌       | Razorpay public key                 |
| RAZORPAY_KEY_SECRET      | ❌       | Razorpay secret key                 |

### Notes
- Apply variables to **Production, Preview, Development**
- Redeploy after any change

---

## 🧪 Local Development

cd backend  
npm install  
npm run dev  

Create `.env` file:

DATABASE_URL=your_db_url  
JWT_SECRET=your_secret  

---

## 🚀 Deployment

### Option 1 (Recommended)
Push to GitHub → Vercel auto-deploys

### Option 2 (CLI)

cd backend  
npx vercel  

---

## 🌐 API Base URL

https://<your-project>.vercel.app/api

### Example Endpoints

GET    /api/products  
POST   /api/auth/login  
GET    /api/health  

---

## 🗄️ Database Setup

Run migrations before or after first deploy:

cd backend  
npm run db:migrate  

### Critical
- Use the same `DATABASE_URL` as production
- Prefer connection pooling (Neon/Supabase)

---

## 🧠 Common Issues

### 1. 503: Database not configured
Cause: Missing `DATABASE_URL`  

Fix:
- Add environment variable
- Redeploy

---

### 2. CORS Errors
Cause: Frontend blocked  

Fix: