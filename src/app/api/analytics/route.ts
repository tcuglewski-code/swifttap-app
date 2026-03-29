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
    const period = searchParams.get("period") || "week" // day, week, month

    // Calculate date range
    const now = new Date()
    let startDate: Date

    switch (period) {
      case "day":
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        break
      case "month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        break
      case "week":
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
    }

    // Get successful payments in period
    const payments = await prisma.payment.findMany({
      where: {
        merchantId: merchant.id,
        status: "succeeded",
        createdAt: {
          gte: startDate,
        },
      },
      select: {
        amount: true,
        createdAt: true,
      },
    })

    // Calculate totals
    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0)
    const transactionCount = payments.length
    const avgTransaction = transactionCount > 0 ? Math.round(totalRevenue / transactionCount) : 0

    // Group by day for chart
    const revenueByDay: { date: string; revenue: number; count: number }[] = []
    const dayMap = new Map<string, { revenue: number; count: number }>()

    payments.forEach((p) => {
      const dateStr = p.createdAt.toISOString().split("T")[0]
      const existing = dayMap.get(dateStr) || { revenue: 0, count: 0 }
      dayMap.set(dateStr, {
        revenue: existing.revenue + p.amount,
        count: existing.count + 1,
      })
    })

    // Fill in missing days
    const currentDate = new Date(startDate)
    while (currentDate <= now) {
      const dateStr = currentDate.toISOString().split("T")[0]
      const data = dayMap.get(dateStr) || { revenue: 0, count: 0 }
      revenueByDay.push({
        date: dateStr,
        revenue: data.revenue,
        count: data.count,
      })
      currentDate.setDate(currentDate.getDate() + 1)
    }

    // Get all-time stats
    const allTimePayments = await prisma.payment.aggregate({
      where: {
        merchantId: merchant.id,
        status: "succeeded",
      },
      _sum: { amount: true },
      _count: true,
    })

    return NextResponse.json({
      period,
      totalRevenue, // in cents
      transactionCount,
      avgTransaction, // in cents
      revenueByDay,
      allTime: {
        totalRevenue: allTimePayments._sum.amount || 0,
        transactionCount: allTimePayments._count || 0,
      },
    })
  } catch (error) {
    console.error("Analytics fetch error:", error)
    return NextResponse.json(
      { error: "Fehler beim Laden der Analytics" },
      { status: 500 }
    )
  }
}
