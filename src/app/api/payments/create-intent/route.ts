export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"

export async function POST(req: NextRequest) {
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

    // Create a PaymentIntent with the specified amount
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // amount in cents
      currency: "eur",
      receipt_email: email,
      description: description || "Zipayo Zahlung",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        source: "zipayo",
      },
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    })
  } catch (error: any) {
    console.error("Payment Intent Error:", error)
    return NextResponse.json(
      { error: error.message || "Zahlung konnte nicht initialisiert werden" },
      { status: 500 }
    )
  }
}
