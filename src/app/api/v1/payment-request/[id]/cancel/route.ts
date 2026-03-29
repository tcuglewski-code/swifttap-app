export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { validateApiKey } from "@/lib/api-auth"

export async function POST(
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

    // Only cancel pending payments
    if (payment.status !== "pending") {
      return NextResponse.json(
        { error: "Conflict", message: `Cannot cancel payment with status: ${payment.status}` },
        { status: 409 }
      )
    }

    const updated = await prisma.payment.update({
      where: { id },
      data: { status: "cancelled" }
    })

    return NextResponse.json({
      paymentId: updated.id,
      status: updated.status,
      message: "Payment cancelled successfully"
    })
  } catch (error) {
    console.error("Payment cancel error:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
