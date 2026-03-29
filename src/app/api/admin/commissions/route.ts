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
    const period = searchParams.get("period") || "all"

    // Calculate date range
    const now = new Date()
    let startDate: Date | undefined

    switch (period) {
      case "day":
        startDate = new Date(now)
        startDate.setHours(0, 0, 0, 0)
        break
      case "week":
        startDate = new Date(now)
        startDate.setDate(startDate.getDate() - 7)
        break
      case "month":
        startDate = new Date(now)
        startDate.setMonth(startDate.getMonth() - 1)
        break
      default:
        startDate = undefined
    }

    const whereClause: any = {
      status: "succeeded",
      platformFee: { not: null }
    }

    if (startDate) {
      whereClause.createdAt = { gte: startDate }
    }

    // Get all payments with fees
    const payments = await prisma.payment.findMany({
      where: whereClause,
      include: {
        merchant: {
          select: { id: true, businessName: true }
        }
      },
      orderBy: { createdAt: "desc" }
    })

    // Calculate total fees
    const totalFees = payments.reduce((sum, p) => sum + (p.platformFee || 0), 0)

    // Group by merchant
    const feesByMerchant: Record<string, { merchantId: string; businessName: string; fees: number; count: number }> = {}
    for (const payment of payments) {
      const key = payment.merchantId
      if (!feesByMerchant[key]) {
        feesByMerchant[key] = {
          merchantId: payment.merchantId,
          businessName: payment.merchant.businessName,
          fees: 0,
          count: 0
        }
      }
      feesByMerchant[key].fees += payment.platformFee || 0
      feesByMerchant[key].count += 1
    }

    // Group by day
    const feesByDay: Record<string, { date: string; fees: number; count: number }> = {}
    for (const payment of payments) {
      const dateKey = payment.createdAt.toISOString().split("T")[0]
      if (!feesByDay[dateKey]) {
        feesByDay[dateKey] = { date: dateKey, fees: 0, count: 0 }
      }
      feesByDay[dateKey].fees += payment.platformFee || 0
      feesByDay[dateKey].count += 1
    }

    return NextResponse.json({
      period,
      totalFees,
      totalTransactions: payments.length,
      feesByMerchant: Object.values(feesByMerchant).sort((a, b) => b.fees - a.fees),
      feesByDay: Object.values(feesByDay).sort((a, b) => b.date.localeCompare(a.date))
    })
  } catch (error) {
    console.error("Admin commissions error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
