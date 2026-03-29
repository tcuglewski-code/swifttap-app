export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { isAdmin } from "@/lib/admin"

export async function GET(request: NextRequest) {
  try {
    const admin = await isAdmin()
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") // "onboarded" | "pending" | null

    const whereClause: any = {}
    if (status === "onboarded") {
      whereClause.stripeOnboarded = true
    } else if (status === "pending") {
      whereClause.stripeOnboarded = false
    }

    const merchants = await prisma.merchant.findMany({
      where: whereClause,
      include: {
        user: { select: { email: true, name: true } },
        payments: {
          where: { status: "succeeded" },
          select: { amount: true }
        },
        teamMembers: { select: { id: true } },
        qrCodes: { select: { id: true } }
      },
      orderBy: { createdAt: "desc" }
    })

    const result = merchants.map(m => ({
      id: m.id,
      businessName: m.businessName,
      businessType: m.businessType,
      email: m.user.email,
      name: m.user.name,
      stripeOnboarded: m.stripeOnboarded,
      stripeStatus: m.stripeOnboarded ? "onboarded" : "pending",
      active: m.active,
      platformFeePercent: m.platformFeePercent,
      revenue: m.payments.reduce((sum, p) => sum + p.amount, 0),
      teamCount: m.teamMembers.length,
      qrCount: m.qrCodes.length,
      createdAt: m.createdAt
    }))

    return NextResponse.json({ merchants: result })
  } catch (error) {
    console.error("Admin merchants error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
