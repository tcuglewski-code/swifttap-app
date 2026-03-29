export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"
import { resend, isResendConfigured } from "@/lib/resend"
import { generateReceiptHtml, generateReceiptSubject } from "@/lib/email-templates"
import Stripe from "stripe"

export async function POST(req: NextRequest) {
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get("stripe-signature")
  
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  // Graceful if webhook secret not configured
  if (!webhookSecret) {
    console.log("STRIPE_WEBHOOK_SECRET not set - skipping webhook verification")
    return NextResponse.json({ received: true, warning: "webhook_secret_not_configured" })
  }

  if (!stripe) {
    console.log("Stripe not configured - skipping webhook")
    return NextResponse.json({ received: true, warning: "stripe_not_configured" })
  }

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error("Webhook signature verification failed:", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded":
        await handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent)
        break

      case "payment_intent.payment_failed":
        await handlePaymentFailed(event.data.object as Stripe.PaymentIntent)
        break

      case "account.updated":
        await handleAccountUpdated(event.data.object as Stripe.Account)
        break

      case "charge.refunded":
        await handleChargeRefunded(event.data.object as Stripe.Charge)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook handler error:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}

async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  const stripePaymentId = paymentIntent.id

  // Find and update payment
  const payment = await prisma.payment.findUnique({
    where: { stripePaymentId },
    include: {
      merchant: true
    }
  })

  if (payment) {
    // Calculate platform fee based on merchant's platformFeePercent
    const platformFee = Math.round(payment.amount * payment.merchant.platformFeePercent / 100)
    const paidAt = new Date()

    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: "succeeded",
        platformFee,
        paidAt,
        updatedAt: new Date(),
      },
    })
    console.log(`Payment ${payment.id} marked as succeeded. Platform fee: ${platformFee} cents`)

    // Send receipt email if configured and customer email exists
    if (isResendConfigured() && resend && payment.customerEmail) {
      try {
        const merchantName = payment.merchant.businessName
        const html = generateReceiptHtml({
          merchantName,
          amount: payment.amount,
          currency: payment.currency,
          transactionId: payment.id,
          customerEmail: payment.customerEmail,
          date: paidAt,
          description: payment.description,
        })

        await resend.emails.send({
          from: 'SwiftTap <noreply@swifttap.app>',
          to: payment.customerEmail,
          subject: generateReceiptSubject(merchantName),
          html,
        })

        console.log(`Receipt email sent to ${payment.customerEmail}`)
      } catch (emailError) {
        // Don't fail the webhook if email fails
        console.error('Failed to send receipt email:', emailError)
      }
    } else {
      console.log('Resend not configured or no customer email - skipping receipt email')
    }
  } else {
    console.log(`Payment with stripePaymentId ${stripePaymentId} not found`)
  }
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  const stripePaymentId = paymentIntent.id

  // Find and update payment
  const payment = await prisma.payment.findUnique({
    where: { stripePaymentId },
  })

  if (payment) {
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: "failed",
        updatedAt: new Date(),
      },
    })
    console.log(`Payment ${payment.id} marked as failed`)
  } else {
    console.log(`Payment with stripePaymentId ${stripePaymentId} not found`)
  }
}

async function handleChargeRefunded(charge: Stripe.Charge) {
  const stripePaymentId = charge.payment_intent as string

  if (!stripePaymentId) return

  const payment = await prisma.payment.findUnique({
    where: { stripePaymentId },
  })

  if (payment) {
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: "refunded",
        refundedAt: new Date(),
        updatedAt: new Date(),
      },
    })
    console.log(`Payment ${payment.id} marked as refunded`)
  }
}

async function handleAccountUpdated(account: Stripe.Account) {
  const stripeAccountId = account.id

  // Find merchant by Stripe account ID
  const merchant = await prisma.merchant.findFirst({
    where: { stripeAccountId },
  })

  if (merchant) {
    const isOnboarded = account.details_submitted === true && 
                        account.charges_enabled === true

    await prisma.merchant.update({
      where: { id: merchant.id },
      data: {
        stripeOnboarded: isOnboarded,
        updatedAt: new Date(),
      },
    })
    console.log(`Merchant ${merchant.id} stripeOnboarded updated to ${isOnboarded}`)
  } else {
    console.log(`Merchant with stripeAccountId ${stripeAccountId} not found`)
  }
}
