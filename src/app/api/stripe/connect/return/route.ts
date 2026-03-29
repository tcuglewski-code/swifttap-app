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
      // Redirect to login if not authenticated
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
                      process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 
                      "http://localhost:3000"
      return NextResponse.redirect(`${baseUrl}/login?callbackUrl=/dashboard/connect`)
    }

    // Get merchant
    const merchant = await prisma.merchant.findUnique({
      where: { userId: session.user.id },
    })

    if (!merchant?.stripeAccountId) {
      return NextResponse.redirect("/dashboard/connect?error=no_account")
    }

    // Check account status with Stripe
    let isOnboarded = false
    if (stripe) {
      try {
        const account = await stripe.accounts.retrieve(merchant.stripeAccountId)
        isOnboarded = account.details_submitted === true && 
                      account.charges_enabled === true
      } catch (e) {
        console.error("Error retrieving Stripe account:", e)
      }
    }

    // Update merchant onboarding status
    await prisma.merchant.update({
      where: { id: merchant.id },
      data: { stripeOnboarded: isOnboarded },
    })

    // Get base URL for redirect
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
                    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 
                    "http://localhost:3000"

    // Redirect to dashboard with status
    const status = isOnboarded ? "success" : "pending"
    return NextResponse.redirect(`${baseUrl}/dashboard/connect?status=${status}`)
  } catch (error) {
    console.error("Stripe Connect return error:", error)
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
                    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 
                    "http://localhost:3000"
    return NextResponse.redirect(`${baseUrl}/dashboard/connect?error=unknown`)
  }
}
