export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { validateApiKey } from "@/lib/api-auth"
import { checkRateLimit, getClientIP, RATE_LIMITS } from "@/lib/rate-limit"

export async function POST(request: NextRequest) {
  // Rate limiting by API key (if authenticated) or IP (if not)
  const clientIP = getClientIP(request.headers)
  const apiKey = request.headers.get("X-Zipayo-Key")
  const rateLimitKey = `payment-request:${apiKey || clientIP}`
  const rateLimit = checkRateLimit(rateLimitKey, RATE_LIMITS.paymentCreate)
  
  if (!rateLimit.success) {
    return NextResponse.json(
      { error: "Rate Limit Exceeded", message: "Too many requests. Please try again later." },
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
    const auth = await validateApiKey(request)
    if (!auth) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Invalid or missing API key" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { amount, description, customerEmail, expiresInMinutes } = body

    // Validate amount
    if (!amount || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json(
        { error: "Bad Request", message: "Amount must be a positive number (in cents)" },
        { status: 400 }
      )
    }

    // Validate maximum amount (prevent abuse - 100,000€ max)
    if (amount > 10000000) {
      return NextResponse.json(
        { error: "Bad Request", message: "Amount exceeds maximum allowed (100,000€)" },
        { status: 400 }
      )
    }

    // Validate email if provided
    if (customerEmail && !isValidEmail(customerEmail)) {
      return NextResponse.json(
        { error: "Bad Request", message: "Invalid customer email format" },
        { status: 400 }
      )
    }

    // Sanitize description (prevent XSS)
    const sanitizedDescription = description 
      ? String(description).slice(0, 500).replace(/<[^>]*>/g, '') 
      : null

    // Calculate expiration (max 24 hours)
    let expiresAt: Date | null = null
    if (expiresInMinutes && typeof expiresInMinutes === "number") {
      const maxMinutes = 24 * 60 // 24 hours max
      const clampedMinutes = Math.min(Math.max(1, expiresInMinutes), maxMinutes)
      expiresAt = new Date(Date.now() + clampedMinutes * 60 * 1000)
    }

    // Create payment
    const payment = await prisma.payment.create({
      data: {
        merchantId: auth.merchantId,
        amount: Math.round(amount),
        description: sanitizedDescription,
        customerEmail: customerEmail || null,
        expiresAt,
        status: "pending"
      }
    })

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://zipayo-app.vercel.app"
    const payUrl = `${baseUrl}/pay/${payment.id}`
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(payUrl)}`

    return NextResponse.json(
      {
        paymentId: payment.id,
        qrUrl,
        payUrl,
        amount: payment.amount,
        expiresAt: payment.expiresAt
      },
      {
        headers: {
          'X-RateLimit-Limit': String(rateLimit.limit),
          'X-RateLimit-Remaining': String(rateLimit.remaining),
          'X-RateLimit-Reset': String(rateLimit.resetAt),
        }
      }
    )
  } catch (error) {
    console.error("Payment request error:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 254
}
