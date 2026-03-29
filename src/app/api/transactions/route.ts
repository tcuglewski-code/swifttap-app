export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Nicht authentifiziert" }, { status: 401 })
    }

    // Get merchant for this user
    const merchant = await prisma.merchant.findUnique({
      where: { userId: session.user.id },
    })

    if (!merchant) {
      return NextResponse.json({ error: "Merchant nicht gefunden" }, { status: 404 })
    }

    // Parse query params
    const { searchParams } = new URL(req.url)
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20")))
    const status = searchParams.get("status")
    const dateFrom = searchParams.get("dateFrom")
    const dateTo = searchParams.get("dateTo")

    // Build where clause
    const where: any = {
      merchantId: merchant.id,
    }

    if (status && ["pending", "succeeded", "failed", "refunded"].includes(status)) {
      where.status = status
    }

    if (dateFrom) {
      where.createdAt = { ...where.createdAt, gte: new Date(dateFrom) }
    }

    if (dateTo) {
      where.createdAt = { ...where.createdAt, lte: new Date(dateTo) }
    }

    // Get total count
    const total = await prisma.payment.count({ where })

    // Get paginated transactions
    const transactions = await prisma.payment.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        qrCode: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return NextResponse.json({
      transactions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Transactions fetch error:", error)
    return NextResponse.json(
      { error: "Fehler beim Laden der Transaktionen" },
      { status: 500 }
    )
  }
}
