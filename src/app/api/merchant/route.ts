export const dynamic = 'force-dynamic'

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Nicht authentifiziert" }, { status: 401 })
    }

    const merchant = await prisma.merchant.findUnique({
      where: { userId: session.user.id },
      select: {
        id: true,
        businessName: true,
        businessType: true,
        stripeAccountId: true,
        stripeOnboarded: true,
        platformFeePercent: true,
        createdAt: true,
      },
    })

    return NextResponse.json({ merchant })
  } catch (error) {
    console.error("Merchant fetch error:", error)
    return NextResponse.json(
      { error: "Fehler beim Laden des Merchants" },
      { status: 500 }
    )
  }
}
