import Stripe from "stripe"

const stripeSecretKey = process.env.STRIPE_SECRET_KEY

// Only initialize Stripe if we have a real API key
export const stripe = stripeSecretKey && stripeSecretKey !== 'sk_test_placeholder'
  ? new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
      typescript: true,
    })
  : null as unknown as Stripe
