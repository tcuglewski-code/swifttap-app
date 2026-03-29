export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { stripe } from "@/lib/stripe"

export async function GET(req: NextRequest) {
  try {
    // Session check
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Nicht authentifiziert" }, { status: 401 })
    }

    // Stripe availability check
    if (!stripe) {
      return NextResponse.json(
        { error: "Stripe nicht konfiguriert" },
        { status: 503 }
      )
    }

    // Get merchant
    const merchant = await prisma.merchant.findUnique({
      where: { userId: session.user.id },
    })

    if (!merchant?.stripeAccountId) {
      return NextResponse.json(
        { error: "Kein Stripe Account gefunden. Bitte zuerst erstellen." },
        { status: 400 }
      )
    }

    // Get base URL for return/refresh
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
                    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 
                    "http://localhost:3000"

    // Create account link for onboarding
    const accountLink = await stripe.accountLinks.create({
      account: merchant.stripeAccountId,
      refresh_url: `${baseUrl}/api/stripe/connect/link`,
      return_url: `${baseUrl}/api/stripe/connect/return`,
      type: "account_onboarding",
    })

    // Redirect to Stripe onboarding
    return NextResponse.redirect(accountLink.url)
  } catch (error) {
    console.error("Stripe Connect link error:", error)
    return NextResponse.json(
      { error: "Fehler beim Erstellen des Onboarding-Links" },
      { status: 500 }
    )
  }
}
