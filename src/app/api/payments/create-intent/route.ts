export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { checkRateLimit, getClientIP, RATE_LIMITS } from "@/lib/rate-limit"

export async function POST(req: NextRequest) {
  // Rate limiting - 5 payment creates per minute per IP
  const clientIP = getClientIP(req.headers)
  const rateLimitKey = `payment-intent:${clientIP}`
  const rateLimit = checkRateLimit(rateLimitKey, RATE_LIMITS.paymentCreate)
  
  if (!rateLimit.success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { 
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((rateLimit.resetAt - Date.now()) / 1000)),
          'X-RateLimit-Limit': String(rateLimit.limit),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(rateLimit.resetAt),
        }
      }
    )
  }

  try {
    if (!stripe) {
      return NextResponse.json(
        { error: "Stripe ist noch nicht konfiguriert. Bitte STRIPE_SECRET_KEY setzen." },
        { status: 503 }
      )
    }

    const { amount, email, description } = await req.json()

    if (!amount || amount < 50) {
      return NextResponse.json(
        { error: "Mindestbetrag ist 0,50 €" },
        { status: 400 }
      )
    }

    // Validate email format if provided
    if (email && !isValidEmail(email)) {
      return NextResponse.json(
        { error: "Ungültige E-Mail-Adresse" },
        { status: 400 }
      )
    }

    // Sanitize description (prevent potential XSS in receipts)
    const sanitizedDescription = description 
      ? String(description).slice(0, 500).replace(/<[^>]*>/g, '') 
      : "Zipayo Zahlung"

    // Create a PaymentIntent with the specified amount
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // amount in cents
      currency: "eur",
      receipt_email: email || undefined,
      description: sanitizedDescription,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        source: "zipayo",
        clientIP, // Track for fraud detection
      },
    })

    return NextResponse.json(
      { clientSecret: paymentIntent.client_secret },
      {
        headers: {
          'X-RateLimit-Limit': String(rateLimit.limit),
          'X-RateLimit-Remaining': String(rateLimit.remaining),
          'X-RateLimit-Reset': String(rateLimit.resetAt),
        }
      }
    )
  } catch (error: any) {
    console.error("Payment Intent Error:", error)
    return NextResponse.json(
      { error: error.message || "Zahlung konnte nicht initialisiert werden" },
      { status: 500 }
    )
  }
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 254
}
