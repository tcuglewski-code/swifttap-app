export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { validateApiKey } from "@/lib/api-auth"

export async function POST(request: NextRequest) {
  try {
    const auth = await validateApiKey(request)
    if (!auth) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Invalid or missing API key" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { amount, description, customerEmail, expiresInMinutes } = body

    if (!amount || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json(
        { error: "Bad Request", message: "Amount must be a positive number (in cents)" },
        { status: 400 }
      )
    }

    // Calculate expiration
    let expiresAt: Date | null = null
    if (expiresInMinutes && typeof expiresInMinutes === "number") {
      expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000)
    }

    // Create payment
    const payment = await prisma.payment.create({
      data: {
        merchantId: auth.merchantId,
        amount: Math.round(amount),
        description: description || null,
        customerEmail: customerEmail || null,
        expiresAt,
        status: "pending"
      }
    })

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://zipayo-app.vercel.app"
    const payUrl = `${baseUrl}/pay/${payment.id}`
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(payUrl)}`

    return NextResponse.json({
      paymentId: payment.id,
      qrUrl,
      payUrl,
      amount: payment.amount,
      expiresAt: payment.expiresAt
    })
  } catch (error) {
    console.error("Payment request error:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
