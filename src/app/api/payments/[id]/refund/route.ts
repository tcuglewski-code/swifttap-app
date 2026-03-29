import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Session check
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 })
    }

    const paymentId = params.id

    // Check if Stripe is configured
    if (!stripe) {
      console.log('Stripe not configured - cannot process refund')
      return NextResponse.json({ 
        error: 'Stripe nicht konfiguriert',
        details: 'Zahlungsanbieter ist derzeit nicht verfügbar' 
      }, { status: 503 })
    }

    // Get payment with merchant info
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        merchant: true
      }
    })

    if (!payment) {
      return NextResponse.json({ error: 'Zahlung nicht gefunden' }, { status: 404 })
    }

    // Verify ownership
    if (payment.merchant.userId !== session.user.id) {
      return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 403 })
    }

    // Check if payment can be refunded
    if (payment.status !== 'succeeded') {
      return NextResponse.json({ 
        error: 'Zahlung kann nicht erstattet werden',
        details: `Status ist "${payment.status}", nur erfolgreiche Zahlungen können erstattet werden`
      }, { status: 400 })
    }

    // Check if payment is too old (Stripe limit: 180 days)
    const paymentAge = Date.now() - new Date(payment.createdAt).getTime()
    const maxAge = 180 * 24 * 60 * 60 * 1000 // 180 days in ms
    if (paymentAge > maxAge) {
      return NextResponse.json({ 
        error: 'Zahlung zu alt für Erstattung',
        details: 'Zahlungen können nur innerhalb von 180 Tagen erstattet werden'
      }, { status: 400 })
    }

    // Check if Stripe payment ID exists
    if (!payment.stripePaymentId) {
      return NextResponse.json({ 
        error: 'Keine Stripe-Zahlung verknüpft',
        details: 'Diese Zahlung hat keine Stripe-Referenz'
      }, { status: 400 })
    }

    // Create refund in Stripe
    const refund = await stripe.refunds.create({
      payment_intent: payment.stripePaymentId,
      reason: 'requested_by_customer',
    })

    // Update payment status
    await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: 'refunded',
        updatedAt: new Date(),
      }
    })

    return NextResponse.json({ 
      success: true,
      refundId: refund.id,
      amount: refund.amount,
      message: 'Zahlung wurde erfolgreich erstattet'
    })

  } catch (error: any) {
    console.error('Refund error:', error)

    // Handle Stripe errors
    if (error.type === 'StripeInvalidRequestError') {
      return NextResponse.json({ 
        error: 'Erstattung fehlgeschlagen',
        details: error.message
      }, { status: 400 })
    }

    return NextResponse.json({ error: 'Interner Serverfehler' }, { status: 500 })
  }
}
