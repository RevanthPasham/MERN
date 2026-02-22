# Razorpay Payment Setup

You only need to configure keys on the **backend**. The frontend gets the Key ID from the API when you click Pay.

---

## 1. Backend: Add Razorpay keys

In the **backend** folder, create or edit `.env` with:

```env
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
```

- Get these from [Razorpay Dashboard](https://dashboard.razorpay.com/) → **Settings** → **API Keys**.
- For testing, use **Test Mode** and create **Test Keys** (they start with `rzp_test_`).
- **Do not** put the Key Secret in the frontend or in git.

---

## 2. Restart the backend

After changing `.env`, restart the backend server so it loads the new keys.

---

## 3. Check that payment is configured

Open in browser (or use Postman):

```text
GET http://localhost:4000/api/orders/payment-status
```

You should see:

```json
{
  "success": true,
  "data": {
    "paymentConfigured": true,
    "message": "Razorpay is configured. You can accept payments."
  }
}
```

If `paymentConfigured` is `false`, the backend is not reading the keys. Check:

- `.env` is in the **backend** folder (same folder as `package.json`).
- Variable names are exactly: `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`.
- No quotes around the values (or use double quotes if you need them).
- You restarted the backend after saving `.env`.

---

## 4. Frontend: No keys needed

The frontend does **not** need any Razorpay keys in its `.env`. When you click **Pay**, the app:

1. Calls the backend `POST /api/orders/create`.
2. Backend creates a Razorpay order and returns `orderId`, `amount`, `currency`, and `key` (Key ID).
3. Frontend opens the Razorpay checkout using that `key`.

So the Key ID is sent from backend to frontend in the API response; you don’t need `VITE_RAZORPAY_KEY_ID` or anything else in the frontend for payments to work.

---

## 5. Make sure the frontend can reach the backend

- If the frontend runs on a different port (e.g. `http://localhost:5174`) and the backend on `http://localhost:4000`, the app uses `VITE_API_URL` or defaults to `http://localhost:4000/api`. That’s correct for local dev.
- If you use a different backend URL, set in **frontend** `.env`:

```env
VITE_API_URL=http://localhost:4000/api
```

(Replace with your actual backend API base URL.)

---

## 6. Test the full flow

1. Backend running with correct `.env` and `payment-status` returns `paymentConfigured: true`.
2. Frontend running and using the same backend URL.
3. Add a product to cart → Checkout → **Pay**.
4. Razorpay test payment modal should open; use [Razorpay test cards](https://razorpay.com/docs/payments/payments/test-card-details/) to complete payment.

If the modal doesn’t open, check the browser console and the Network tab for the `/orders/create` request and its response. If you see `503` or “Payment is not configured”, the backend still doesn’t have the keys loaded.
