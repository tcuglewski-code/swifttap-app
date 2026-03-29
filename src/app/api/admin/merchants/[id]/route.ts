export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { isAdmin } from "@/lib/admin"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await isAdmin()
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const merchant = await prisma.merchant.findUnique({
      where: { id },
      include: {
        user: { select: { email: true, name: true } },
        payments: {
          orderBy: { createdAt: "desc" },
          take: 100
        },
        teamMembers: true,
        qrCodes: true
      }
    })

    if (!merchant) {
      return NextResponse.json({ error: "Merchant not found" }, { status: 404 })
    }

    const totalRevenue = merchant.payments
      .filter(p => p.status === "succeeded")
      .reduce((sum, p) => sum + p.amount, 0)

    const totalFees = merchant.payments
      .filter(p => p.status === "succeeded" && p.platformFee)
      .reduce((sum, p) => sum + (p.platformFee || 0), 0)

    return NextResponse.json({
      merchant: {
        id: merchant.id,
        businessName: merchant.businessName,
        businessType: merchant.businessType,
        email: merchant.user.email,
        name: merchant.user.name,
        stripeOnboarded: merchant.stripeOnboarded,
        stripeAccountId: merchant.stripeAccountId,
        active: merchant.active,
        platformFeePercent: merchant.platformFeePercent,
        totalRevenue,
        totalFees,
        createdAt: merchant.createdAt
      },
      transactions: merchant.payments,
      team: merchant.teamMembers,
      qrCodes: merchant.qrCodes
    })
  } catch (error) {
    console.error("Admin merchant detail error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await isAdmin()
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()

    const updateData: any = {}
    if (typeof body.active === "boolean") {
      updateData.active = body.active
    }
    if (typeof body.platformFeePercent === "number") {
      updateData.platformFeePercent = body.platformFeePercent
    }

    const merchant = await prisma.merchant.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json({ merchant })
  } catch (error) {
    console.error("Admin merchant update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
