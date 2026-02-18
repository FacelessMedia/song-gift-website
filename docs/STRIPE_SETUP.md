# Stripe Setup & Environment Switching Guide

This document explains how Stripe is configured in SongGift and how to switch between **Test Mode** and **Live Mode**.

---

## Required Environment Variables

| Variable | Where Used | Example |
|----------|-----------|---------|
| `STRIPE_SECRET_KEY` | Server-side (API routes) | `sk_test_...` or `sk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | Webhook signature verification | `whsec_...` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Client-side (if needed) | `pk_test_...` or `pk_live_...` |

> **Security:** Secret keys (`sk_*`, `whsec_*`) are server-side only and never exposed to the browser. Only `NEXT_PUBLIC_*` variables are accessible client-side.

---

## Where Keys Are Used

| File | What It Uses |
|------|-------------|
| `/src/lib/stripe.ts` | `STRIPE_SECRET_KEY` — initializes Stripe client |
| `/src/app/api/stripe/webhook/route.ts` | `STRIPE_WEBHOOK_SECRET` — verifies webhook signatures |
| `/src/app/api/stripe/create-checkout-session/route.ts` | Imports `stripe` from `/src/lib/stripe.ts` |

**No keys are hardcoded anywhere.** All Stripe configuration is driven entirely by environment variables.

---

## How to Switch from Test to Live Mode

### Step 1 — Get Live Keys from Stripe Dashboard

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Make sure the **"Test mode"** toggle (top-right) is **OFF** (showing Live mode)
3. Go to **Developers → API Keys**
4. Copy:
   - **Publishable key** → starts with `pk_live_`
   - **Secret key** → starts with `sk_live_` (click "Reveal" to see it)

### Step 2 — Create a Live Webhook Endpoint

1. In Stripe Dashboard, go to **Developers → Webhooks**
2. Click **"Add endpoint"**
3. Set the endpoint URL to:
   ```
   https://your-domain.com/api/stripe/webhook
   ```
   (Replace `your-domain.com` with your actual production domain, e.g., `songgift.app`)
4. Under **"Select events to listen to"**, add:
   - `checkout.session.completed`
5. Click **"Add endpoint"**
6. On the endpoint page, click **"Reveal"** under Signing secret
7. Copy the signing secret → starts with `whsec_`

### Step 3 — Update Vercel Environment Variables

1. Go to [Vercel Dashboard](https://vercel.com) → Your Project → **Settings → Environment Variables**
2. Update these variables for the **Production** environment:

   | Variable | New Value |
   |----------|-----------|
   | `STRIPE_SECRET_KEY` | `sk_live_...` (from Step 1) |
   | `STRIPE_WEBHOOK_SECRET` | `whsec_...` (from Step 2) |
   | `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_live_...` (from Step 1) |

3. Click **Save** for each variable

### Step 4 — Redeploy

1. In Vercel, go to **Deployments**
2. Click the **three dots** on the latest deployment → **"Redeploy"**
3. Wait for the build to complete

### Step 5 — Verify

1. Check the Vercel **Function Logs** (Vercel Dashboard → Logs)
2. You should see:
   ```
   [Stripe] Running in LIVE mode
   [Stripe] ⚠️  LIVE MODE — real charges will be processed
   ```
3. Make a small test purchase to confirm the full flow works

---

## How to Switch Back to Test Mode

Reverse the process — replace the Live keys with Test keys in Vercel:

| Variable | Test Value |
|----------|-----------|
| `STRIPE_SECRET_KEY` | `sk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` (from your Test webhook endpoint) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_test_...` |

Then redeploy.

---

## Local Development

For local development, keys are stored in `.env.local` (gitignored):

```bash
# Copy the example file
cp env.example .env.local

# Edit with your Test mode keys
nano .env.local
```

To test webhooks locally, use the [Stripe CLI](https://stripe.com/docs/stripe-cli):

```bash
# Forward webhooks to your local server
stripe listen --forward-to localhost:3000/api/stripe/webhook

# The CLI will output a webhook signing secret (whsec_...)
# Use that as STRIPE_WEBHOOK_SECRET in .env.local
```

---

## Runtime Mode Detection

The server automatically logs which mode Stripe is running in on startup:

- **Test mode:** `[Stripe] Running in TEST mode`
- **Live mode:** `[Stripe] Running in LIVE mode` + warning

This is determined by the `sk_test_` vs `sk_live_` prefix of `STRIPE_SECRET_KEY`.

The mode is also exported as `STRIPE_MODE` from `/src/lib/stripe.ts` if needed programmatically.

---

## Checklist Before Going Live

- [ ] Live Stripe keys set in Vercel Production environment
- [ ] Live webhook endpoint created in Stripe Dashboard pointing to production URL
- [ ] Webhook signing secret updated in Vercel
- [ ] Test and Live keys are **never mixed** (e.g., `sk_live_` with `pk_test_`)
- [ ] Redeployed after updating environment variables
- [ ] Verified `[Stripe] Running in LIVE mode` appears in logs
- [ ] Made a successful test purchase in Live mode
- [ ] Confirmed order appears in Supabase and n8n webhook fires
