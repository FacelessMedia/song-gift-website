# Production Test Checklist

Complete this checklist before going live. Each section validates a critical system.

> **Tip:** Enable `DEBUG_LOGGING=true` in `.env.local` to see verbose server-side payload logs during testing. **Disable before production.**

---

## Section A — Intake Form Validation (6 Steps)

### Step 1: Recipient Info
- [ ] Recipient name field shows red asterisk (required)
- [ ] Recipient relationship dropdown shows red asterisk (required)
- [ ] Cannot proceed to Step 2 without filling required fields
- [ ] Song perspective selector works correctly

### Step 2: Song Details
- [ ] Primary language text input accepts free-form text
- [ ] Music style checkboxes work (can select multiple)
- [ ] Selecting "Other" in music style shows custom text input
- [ ] Custom text is **required** when "Other" is selected — cannot proceed without it
- [ ] Emotional vibe checkboxes work (can select multiple)
- [ ] Selecting "Other" in emotional vibe shows custom text input
- [ ] Custom text is **required** when "Other" is selected — cannot proceed without it
- [ ] Voice preference selector works

### Step 3: Story & Message
- [ ] Core message textarea shows red asterisk (required)
- [ ] Cannot proceed without entering core message
- [ ] Character count or guidance visible (if applicable)

### Step 4: Faith & Values
- [ ] Faith expression level is **optional** — can skip entirely
- [ ] Toggling faith off clears the selection
- [ ] Helper text indicates this step is optional

### Step 5: Gender
- [ ] Gender selector works (male/female/other)
- [ ] Selecting "Other" shows custom text input
- [ ] Custom gender text stored properly when "Other" selected
- [ ] Gender stored as resolved value in Supabase (custom text replaces "other")

### Step 6: Contact Details
- [ ] Full name field shows red asterisk (required)
- [ ] Email field shows red asterisk (required)
- [ ] Email validation rejects invalid formats (e.g., `test@`, `@gmail.com`, `no-at-sign`)
- [ ] Phone field shows red asterisk (required)
- [ ] Phone field includes country code selector
- [ ] Phone stored in E.164 format (e.g., `+14155551234`)
- [ ] Cannot proceed to checkout without all contact fields filled

---

## Section B — Stripe Payment Flow

### Pre-Checkout
- [ ] Delivery speed selection works (Standard / Rush)
- [ ] Order summary shows correct pricing:
  - Standard: $79.00
  - Rush: $79.00 + $39.00 = $118.00
- [ ] "Proceed to Payment" button is disabled until intake is complete

### Checkout
- [ ] Clicking payment button redirects to Stripe Checkout page
- [ ] Stripe Checkout shows correct line items and total
- [ ] Customer email is pre-filled on Stripe Checkout
- [ ] Cancel button returns to `/checkout?canceled=1`

### Test Payment (use Stripe test card)
| Card Number | Scenario |
|-------------|----------|
| `4242 4242 4242 4242` | Successful payment |
| `4000 0000 0000 0002` | Declined card |
| `4000 0000 0000 3220` | 3D Secure required |

- [ ] Successful payment redirects to `/checkout/success?session_id=...`
- [ ] Success page shows personalized confirmation with tracking ID
- [ ] Declined card shows appropriate error on Stripe Checkout

### Stripe Dashboard Verification
- [ ] Payment appears in [Stripe Dashboard → Payments](https://dashboard.stripe.com/test/payments)
- [ ] Payment metadata contains `session_id` and `delivery_speed`
- [ ] Webhook event `checkout.session.completed` shows in [Webhooks](https://dashboard.stripe.com/test/webhooks)
- [ ] Webhook delivery status is `200 OK`

### Mode Verification
- [ ] Server logs show `[Stripe] Running in TEST mode` (or LIVE if switched)
- [ ] No hardcoded keys in codebase (run: `grep -r "sk_test\|sk_live\|pk_test\|pk_live\|whsec_" src/`)

---

## Section C — Supabase Data Validation

After a successful test purchase, verify the `orders` table:

### Order Record
- [ ] New row created in `orders` table
- [ ] `tracking_id` format is `SG-XXXXXXXX`
- [ ] `customer_name` matches intake Step 6 input
- [ ] `customer_email` matches intake Step 6 input
- [ ] `customer_phone` stored in E.164 format
- [ ] `gender` stored as resolved value (not "other" if custom was entered)
- [ ] `gender_custom` contains custom text when gender was "other"
- [ ] `session_id` matches the frontend session ID
- [ ] `stripe_checkout_session_id` starts with `cs_test_` (or `cs_live_`)
- [ ] `stripe_payment_intent_id` starts with `pi_`
- [ ] `amount_paid` matches expected total in cents (7900 or 11800)
- [ ] `currency` is `usd`
- [ ] `delivery_speed` is `standard` or `express`
- [ ] `order_status` is `Paid`
- [ ] `paid_at` timestamp is recent
- [ ] `expected_delivery_at` is correct (+1 day for express, +2 for standard)

### Intake Payload (JSONB column)
- [ ] `intake_payload` contains complete form data
- [ ] `recipient_name` extracted correctly
- [ ] `recipient_relationship` extracted correctly
- [ ] `music_style` array has "Other" resolved to custom text
- [ ] `emotional_vibe` array has "Other" resolved to custom text
- [ ] `voice_preference` present
- [ ] `faith_expression_level` is `null` when skipped, value when set
- [ ] `core_message` present and matches input
- [ ] `primary_language` present

### Newsletter Subscribers Table
- [ ] After subscribing via popup, new row in `newsletter_subscribers`
- [ ] `email` stored lowercase and trimmed
- [ ] `source` is `songgift.app`
- [ ] `session_id` present
- [ ] `page_path` matches the page where popup appeared
- [ ] `created_at` timestamp is recent
- [ ] Duplicate email submission returns success (not error) but doesn't create duplicate row

### SQL Queries for Verification
```sql
-- Check latest order
SELECT id, tracking_id, customer_name, customer_email, customer_phone,
       gender, gender_custom, session_id, amount_paid, delivery_speed,
       order_status, paid_at, music_style, emotional_vibe, faith_expression_level
FROM orders
ORDER BY created_at DESC
LIMIT 1;

-- Check intake payload fields
SELECT tracking_id, 
       intake_payload->>'recipientName' as recipient,
       intake_payload->>'musicStyle' as music_style_raw,
       intake_payload->>'musicStyleCustom' as music_custom,
       intake_payload->>'emotionalVibe' as vibe_raw,
       intake_payload->>'emotionalVibeCustom' as vibe_custom,
       intake_payload->>'gender' as gender_raw,
       intake_payload->>'genderCustom' as gender_custom_raw
FROM orders
ORDER BY created_at DESC
LIMIT 1;

-- Check newsletter subscribers
SELECT * FROM newsletter_subscribers ORDER BY created_at DESC LIMIT 5;
```

---

## Section D — n8n Webhook Validation

### Order Webhook
- [ ] n8n workflow receives webhook after successful payment
- [ ] Webhook payload contains `order` section:
  - `tracking_id`, `delivery_type`, `amount_paid`, `currency`, `paid_at`
- [ ] Webhook payload contains `customer` section:
  - `name`, `email`, `phone`, `gender`, `gender_custom`
- [ ] Webhook payload contains `song_details` section:
  - `recipient_name`, `recipient_relationship`, `music_style` (resolved), `emotional_vibe` (resolved), `voice_preference`, `faith_expression_level`, `core_message`
- [ ] Webhook payload contains `intake` section (complete raw form data)
- [ ] If n8n is not configured, server logs: `n8n webhook not configured, skipping`

### Newsletter Webhook
- [ ] n8n workflow receives webhook after newsletter signup
- [ ] Payload contains: `event`, `email`, `source`, `session_id`, `page_path`, `subscribed_at`
- [ ] Duplicate subscription still triggers webhook (for tracking)

### Debug Logging Verification
With `DEBUG_LOGGING=true` in `.env.local`:
- [ ] Server logs show `[DEBUG ...]` prefixed entries
- [ ] Stripe webhook logs show full session data, intake data, and order record
- [ ] Checkout session logs show request params and created session ID
- [ ] Newsletter logs show subscription data and Supabase insert result
- [ ] No sensitive card data appears in any log
- [ ] Disabling `DEBUG_LOGGING` (set to `false` or remove) silences all debug output

---

## Section E — Multi-User Session Isolation

### Test Setup
1. Open **Browser Window A** (normal)
2. Open **Browser Window B** (incognito / private)
3. Both navigate to `/create`

### Test Procedure
- [ ] In Window A: Enter recipient name "Alice" and proceed through steps
- [ ] In Window B: Enter recipient name "Bob" and proceed through steps
- [ ] In Window A: Verify recipient name still shows "Alice" (not "Bob")
- [ ] In Window B: Verify recipient name still shows "Bob" (not "Alice")

### Tab Isolation
- [ ] Open two tabs in the same browser
- [ ] Each tab gets its own session (different `sess_` IDs)
- [ ] Data entered in Tab 1 does not appear in Tab 2

### Session Persistence
- [ ] Refresh the page mid-intake — data is preserved
- [ ] Navigate away and back — data is preserved within same tab
- [ ] Close tab and reopen — data is cleared (fresh session)

### Post-Payment Cleanup
- [ ] After successful payment, session data is cleared
- [ ] Navigating back to `/create` shows a fresh empty form
- [ ] No stale data from previous purchase appears

### Session ID Format
- [ ] Session IDs follow format: `sess_[timestamp]_[random]`
- [ ] Each tab generates a unique session ID
- [ ] Session ID is passed through to Supabase `session_id` column

---

## Final Pre-Launch Checklist

- [ ] All Section A checks pass
- [ ] All Section B checks pass
- [ ] All Section C checks pass
- [ ] All Section D checks pass
- [ ] All Section E checks pass
- [ ] `DEBUG_LOGGING` is set to `false` (or removed) in production
- [ ] Stripe is in correct mode (TEST for testing, LIVE for launch)
- [ ] Server logs confirm: `[Stripe] Running in TEST mode` or `[Stripe] Running in LIVE mode`
- [ ] Production build succeeds: `npm run build` exits with code 0
- [ ] No TypeScript errors
- [ ] No console errors in browser DevTools on any page
- [ ] All pages load correctly: `/`, `/create`, `/checkout`, `/reviews`, `/faq`, `/contact`
- [ ] SEO pages load: `/custom-song-for-wife`, `/custom-song-for-husband`, `/custom-song-for-girlfriend`, `/anniversary-song-gift`, `/birthday-song-gift`, `/valentines-day-song-gift`
- [ ] Mobile responsive — test on phone or DevTools mobile view
