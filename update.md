# Setup Verification Checklist

## ✅ Step-by-Step Verification

### 1. Check Server is Running

```bash
npm run dev
```

**Expected output:**
```
🌐 Server will run on port 3000
✅ Database connection successful
✅ Database tables initialized successfully
🚀 Server running on port 3000
```

**If you see errors:**
- ❌ Database connection failed → Check `DATABASE_URL` in `.env`
- ❌ Missing environment variables → Check all required vars are set

---

### 2. Test Health Endpoint

Open browser or run:
```bash
curl http://localhost:3000/health
```

**Expected response:**
```json
{
  "status": "ok",
  "timestamp": "2024-...",
  "port": 3000
}
```

**If it fails:**
- Server is not running → Start with `npm run dev`
- Port mismatch → Check PORT in `.env` matches ngrok

---

### 3. Check ngrok Configuration

**Check ngrok dashboard:** http://127.0.0.1:4040

**Should show:**
```
Forwarding: https://xxx.ngrok.io -> http://localhost:3000
```

**If wrong:**
- Stop ngrok (Ctrl+C)
- Run: `ngrok http 3000` (or whatever port your server uses)

---

### 4. Test Webhook Verification

```bash
# Replace YOUR_VERIFY_TOKEN with your actual token from .env
curl "http://localhost:3000/webhook?hub.mode=subscribe&hub.verify_token=YOUR_VERIFY_TOKEN&hub.challenge=test123"
```

**Expected response:**
```
test123
```

**If it fails:**
- 403 Forbidden → Verify token doesn't match
- 500 Error → Check server logs for config errors

---

### 5. Meta Cloud API Configuration

**In Meta Developer Console:**

1. **Webhook URL:** `https://your-ngrok-url.ngrok.io/webhook`
   - ✅ Must include `/webhook` at the end
   - ✅ Must use HTTPS (ngrok provides this)
   - ❌ Don't use `http://localhost:3000` (won't work)

2. **Verify Token:** Must match `WHATSAPP_VERIFY_TOKEN` in your `.env`
   - ✅ Copy exact value from `.env`
   - ✅ Paste in Meta Console
   - ❌ Don't add spaces or quotes

3. **Webhook Fields:** Subscribe to `messages`
   - ✅ Check the `messages` checkbox
   - ✅ Save changes

4. **Test Webhook:**
   - Click "Test" button in Meta Console
   - Should show ✅ Success
   - Check your server console for verification logs

---

### 6. Environment Variables Check

**Required in `.env` file:**
```env
DATABASE_URL=postgresql://user:password@host.neon.tech/dbname?sslmode=require
WHATSAPP_TOKEN=your_token_here
WHATSAPP_PHONE_ID=your_phone_id_here
WHATSAPP_VERIFY_TOKEN=your_verify_token_here
PORT=3000
```

**Verify all are set:**
```bash
# Check if variables are loaded
node -e "require('dotenv').config(); console.log('DATABASE_URL:', !!process.env.DATABASE_URL); console.log('WHATSAPP_TOKEN:', !!process.env.WHATSAPP_TOKEN);"
```

---

### 7. Test with End-to-End Script

```bash
# Set webhook URL (or add to .env)
export WEBHOOK_URL=http://localhost:3000/webhook

# Run test
node test-end-to-end.js
```

**Expected output:**
```
✅ Test 1: Health Check - PASS
✅ Test 2: Webhook Verification - PASS
✅ Test 3: Add Product Command - PASS
✅ Test 4: Invalid Message Format - PASS
🎉 All tests passed!
```

---

### 8. Test with Real WhatsApp Message

**Send this EXACT format:**
```
add_product
title=Test Product
slug=test-123
price=100
stock=10
```

**Check server console for:**
```
📥 [WEBHOOK] Received webhook request
📥 [WEBHOOK] Response sent (200 OK)
📨 [MESSAGE] Processing incoming message...
✅ [MESSAGE] Message saved to DB
📦 [ADD PRODUCT] Starting product creation...
✅ [ADD PRODUCT] Product created with ID: ...
```

**Check database:**
```sql
SELECT * FROM whatsapp_messages ORDER BY created_at DESC LIMIT 1;
SELECT * FROM products ORDER BY created_at DESC LIMIT 1;
```

---

## Common Issues & Fixes

### Issue: 502 Bad Gateway

**Causes:**
1. Server not running
2. Port mismatch (ngrok on 30000, server on 3000)
3. Server crashing on webhook
4. Missing environment variables

**Fix:**
1. Check server is running: `npm run dev`
2. Verify ports match
3. Check server console for errors
4. Verify all env vars in `.env`

### Issue: No Console Logs

**Causes:**
1. Webhook not reaching server
2. ngrok not forwarding correctly
3. Wrong webhook URL in Meta

**Fix:**
1. Check ngrok dashboard: http://127.0.0.1:4040
2. Verify webhook URL includes `/webhook`
3. Test health endpoint first

### Issue: Webhook Verification Fails

**Causes:**
1. Verify token mismatch
2. Wrong webhook URL
3. Server not accessible

**Fix:**
1. Copy exact token from `.env` to Meta Console
2. Verify webhook URL is correct
3. Test locally first with curl

---

## Quick Test Commands

```bash
# 1. Test server
curl http://localhost:3000/health

# 2. Test webhook verification
curl "http://localhost:3000/webhook?hub.mode=subscribe&hub.verify_token=YOUR_TOKEN&hub.challenge=test"

# 3. Test webhook reception
curl -X POST http://localhost:3000/webhook \
  -H "Content-Type: application/json" \
  -d '{"entry":[{"changes":[{"value":{"messages":[{"id":"test","from":"123","type":"text","text":{"body":"test"}}]}}]}]}'

# 4. Run full test suite
node test-end-to-end.js
```

---

## Still Having Issues?

1. **Check server logs** - Look for error messages
2. **Check ngrok logs** - http://127.0.0.1:4040
3. **Verify .env file** - All variables set correctly
4. **Test locally first** - Use curl before testing with WhatsApp
5. **Check Meta Console** - Webhook status and test results
