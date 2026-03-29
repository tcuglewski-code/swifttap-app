export const dynamic = 'force-dynamic'

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { isAdmin } from "@/lib/admin"

export async function GET() {
  try {
    const admin = await isAdmin()
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Parallel queries
    const [
      totalRevenue,
      activeMerchants,
      transactionsToday,
      transactionsTotal,
      topMerchants,
      allMerchants
    ] = await Promise.all([
      // Gesamt-Umsatz (succeeded payments)
      prisma.payment.aggregate({
        where: { status: "succeeded" },
        _sum: { amount: true }
      }),
      // Aktive Merchants
      prisma.merchant.count({
        where: { active: true }
      }),
      // Transaktionen heute
      prisma.payment.count({
        where: {
          createdAt: { gte: today },
          status: "succeeded"
        }
      }),
      // Transaktionen gesamt
      prisma.payment.count({
        where: { status: "succeeded" }
      }),
      // Top 5 Merchants nach Umsatz
      prisma.merchant.findMany({
        include: {
          user: { select: { email: true, name: true } },
          payments: {
            where: { status: "succeeded" },
            select: { amount: true }
          }
        },
        take: 100 // Get all, then sort
      }),
      // Alle Merchants mit Details
      prisma.merchant.findMany({
        include: {
          user: { select: { email: true, name: true } },
          payments: {
            where: { status: "succeeded" },
            select: { amount: true }
          }
        },
        orderBy: { createdAt: "desc" }
      })
    ])

    // Calculate revenue per merchant and sort for top 5
    const merchantsWithRevenue = topMerchants.map(m => ({
      id: m.id,
      businessName: m.businessName,
      email: m.user.email,
      name: m.user.name,
      stripeOnboarded: m.stripeOnboarded,
      active: m.active,
      revenue: m.payments.reduce((sum, p) => sum + p.amount, 0),
      createdAt: m.createdAt
    })).sort((a, b) => b.revenue - a.revenue)

    const top5 = merchantsWithRevenue.slice(0, 5)
    
    const merchantsList = allMerchants.map(m => ({
      id: m.id,
      businessName: m.businessName,
      email: m.user.email,
      name: m.user.name,
      stripeOnboarded: m.stripeOnboarded,
      stripeStatus: m.stripeOnboarded ? "onboarded" : "pending",
      active: m.active,
      revenue: m.payments.reduce((sum, p) => sum + p.amount, 0),
      createdAt: m.createdAt
    }))

    return NextResponse.json({
      totalRevenue: totalRevenue._sum.amount || 0,
      activeMerchants,
      transactionsToday,
      transactionsTotal,
      topMerchants: top5,
      merchants: merchantsList
    })
  } catch (error) {
    console.error("Admin stats error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
