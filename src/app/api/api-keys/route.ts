export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import crypto from "crypto"

function generateApiKey(): string {
  return `st_live_${crypto.randomBytes(32).toString("hex")}`
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const merchant = await prisma.merchant.findUnique({
      where: { userId: session.user.id },
      include: {
        apiKeys: {
          orderBy: { createdAt: "desc" }
        }
      }
    })

    if (!merchant) {
      return NextResponse.json({ error: "Merchant not found" }, { status: 404 })
    }

    // Mask keys for display (show first 8 chars + last 4)
    const keys = merchant.apiKeys.map(k => ({
      id: k.id,
      name: k.name,
      keyPreview: `${k.key.substring(0, 12)}...${k.key.substring(k.key.length - 4)}`,
      lastUsed: k.lastUsed,
      createdAt: k.createdAt
    }))

    return NextResponse.json({ apiKeys: keys })
  } catch (error) {
    console.error("API keys list error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name } = body

    if (!name || typeof name !== "string" || name.length < 1) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      )
    }

    const merchant = await prisma.merchant.findUnique({
      where: { userId: session.user.id }
    })

    if (!merchant) {
      return NextResponse.json({ error: "Merchant not found" }, { status: 404 })
    }

    const key = generateApiKey()

    const apiKey = await prisma.apiKey.create({
      data: {
        merchantId: merchant.id,
        key,
        name
      }
    })

    // Return full key only once at creation
    return NextResponse.json({
      id: apiKey.id,
      name: apiKey.name,
      key: apiKey.key, // Full key, only shown once
      createdAt: apiKey.createdAt,
      message: "Store this key securely. It will only be shown once."
    })
  } catch (error) {
    console.error("API key create error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
