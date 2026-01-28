import Stripe from 'stripe';

// Server-side Stripe client
// ⚠️ NEVER use this in client components - server-side only!

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error('Missing required environment variable: STRIPE_SECRET_KEY');
}

// Initialize Stripe with secret key
export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-12-15.clover', // Use latest API version
  typescript: true,
});

// Pricing constants
export const PRICING = {
  BASE_PRICE: 7900, // $79.00 in cents
  RUSH_DELIVERY: 3900, // $39.00 in cents
  CURRENCY: 'usd',
} as const;

// Helper function to calculate total price
export function calculateTotal(deliverySpeed: 'standard' | 'rush'): number {
  return deliverySpeed === 'rush' 
    ? PRICING.BASE_PRICE + PRICING.RUSH_DELIVERY 
    : PRICING.BASE_PRICE;
}

// Helper function to format price for display
export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}
