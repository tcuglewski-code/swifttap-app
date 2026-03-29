export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { validateApiKey } from "@/lib/api-auth"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await validateApiKey(request)
    if (!auth) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Invalid or missing API key" },
        { status: 401 }
      )
    }

    const { id } = await params

    const payment = await prisma.payment.findUnique({
      where: { id }
    })

    if (!payment) {
      return NextResponse.json(
        { error: "Not Found", message: "Payment not found" },
        { status: 404 }
      )
    }

    // Security: Only allow access to own payments
    if (payment.merchantId !== auth.merchantId) {
      return NextResponse.json(
        { error: "Forbidden", message: "Access denied" },
        { status: 403 }
      )
    }

    return NextResponse.json({
      paymentId: payment.id,
      status: payment.status,
      amount: payment.amount,
      currency: payment.currency,
      description: payment.description,
      customerEmail: payment.customerEmail,
      paidAt: payment.paidAt,
      refundedAt: payment.refundedAt,
      expiresAt: payment.expiresAt,
      createdAt: payment.createdAt
    })
  } catch (error) {
    console.error("Payment status error:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
