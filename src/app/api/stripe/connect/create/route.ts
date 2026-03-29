export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { stripe } from "@/lib/stripe"

export async function POST(req: NextRequest) {
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

    const { businessName, businessType } = await req.json()

    if (!businessName) {
      return NextResponse.json(
        { error: "businessName erforderlich" },
        { status: 400 }
      )
    }

    // Check if merchant already exists
    let merchant = await prisma.merchant.findUnique({
      where: { userId: session.user.id },
    })

    if (merchant?.stripeAccountId) {
      return NextResponse.json({
        success: true,
        merchantId: merchant.id,
        stripeAccountId: merchant.stripeAccountId,
        message: "Stripe Connect Account existiert bereits",
      })
    }

    // Create Stripe Connect Express Account
    const account = await stripe.accounts.create({
      type: "express",
      country: "DE",
      email: session.user.email || undefined,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_type: businessType === "individual" ? "individual" : "company",
      business_profile: {
        name: businessName,
        mcc: "5812", // Restaurants - general merchant category
      },
    })

    // Create or update merchant record
    if (merchant) {
      merchant = await prisma.merchant.update({
        where: { id: merchant.id },
        data: {
          stripeAccountId: account.id,
          businessName,
          businessType,
        },
      })
    } else {
      merchant = await prisma.merchant.create({
        data: {
          userId: session.user.id,
          businessName,
          businessType,
          stripeAccountId: account.id,
          platformFeePercent: 0.5,
        },
      })
    }

    return NextResponse.json({
      success: true,
      merchantId: merchant.id,
      stripeAccountId: account.id,
    })
  } catch (error) {
    console.error("Stripe Connect create error:", error)
    return NextResponse.json(
      { error: "Fehler beim Erstellen des Stripe Accounts" },
      { status: 500 }
    )
  }
}
