import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { resend, isResendConfigured } from '@/lib/resend'
import { generateReceiptHtml, generateReceiptSubject } from '@/lib/email-templates'

export async function POST(req: NextRequest) {
  try {
    // Session check
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 })
    }

    // Check if Resend is configured
    if (!isResendConfigured() || !resend) {
      console.log('Resend not configured - skipping email send')
      return NextResponse.json({ 
        success: false, 
        warning: 'resend_not_configured',
        message: 'Email-Dienst nicht konfiguriert' 
      })
    }

    const { paymentId } = await req.json()

    if (!paymentId) {
      return NextResponse.json({ error: 'paymentId erforderlich' }, { status: 400 })
    }

    // Get payment with merchant info
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        merchant: {
          include: {
            user: true
          }
        }
      }
    })

    if (!payment) {
      return NextResponse.json({ error: 'Zahlung nicht gefunden' }, { status: 404 })
    }

    // Verify ownership
    if (payment.merchant.userId !== session.user.id) {
      return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 403 })
    }

    // Check if customer email exists
    if (!payment.customerEmail) {
      return NextResponse.json({ error: 'Keine Kunden-E-Mail vorhanden' }, { status: 400 })
    }

    // Send email
    const merchantName = payment.merchant.businessName
    const html = generateReceiptHtml({
      merchantName,
      amount: payment.amount,
      currency: payment.currency,
      transactionId: payment.id,
      customerEmail: payment.customerEmail,
      date: payment.createdAt,
      description: payment.description,
    })

    const { data, error } = await resend.emails.send({
      from: 'SwiftTap <noreply@swifttap.app>',
      to: payment.customerEmail,
      subject: generateReceiptSubject(merchantName),
      html,
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json({ error: 'Email konnte nicht gesendet werden' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      emailId: data?.id,
      message: `Quittung an ${payment.customerEmail} gesendet` 
    })

  } catch (error) {
    console.error('Email receipt error:', error)
    return NextResponse.json({ error: 'Interner Serverfehler' }, { status: 500 })
  }
}
