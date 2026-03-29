export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { randomBytes } from "crypto"

// GET - List team members
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Nicht authentifiziert" }, { status: 401 })
    }

    const merchant = await prisma.merchant.findUnique({
      where: { userId: session.user.id },
    })

    if (!merchant) {
      return NextResponse.json({ error: "Merchant nicht gefunden" }, { status: 404 })
    }

    const teamMembers = await prisma.teamMember.findMany({
      where: { merchantId: merchant.id },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        email: true,
        role: true,
        accepted: true,
        createdAt: true,
      },
    })

    return NextResponse.json({ teamMembers })
  } catch (error) {
    console.error("Team fetch error:", error)
    return NextResponse.json(
      { error: "Fehler beim Laden des Teams" },
      { status: 500 }
    )
  }
}

// POST - Invite team member
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Nicht authentifiziert" }, { status: 401 })
    }

    const merchant = await prisma.merchant.findUnique({
      where: { userId: session.user.id },
    })

    if (!merchant) {
      return NextResponse.json({ error: "Merchant nicht gefunden" }, { status: 404 })
    }

    const { email, role } = await req.json()

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Gültige Email erforderlich" }, { status: 400 })
    }

    // Check if already invited
    const existing = await prisma.teamMember.findFirst({
      where: {
        merchantId: merchant.id,
        email: email.toLowerCase(),
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: "Diese Email ist bereits eingeladen" },
        { status: 400 }
      )
    }

    // Generate invite token
    const inviteToken = randomBytes(32).toString("hex")

    // Create team member
    const teamMember = await prisma.teamMember.create({
      data: {
        merchantId: merchant.id,
        email: email.toLowerCase(),
        role: role || "member",
        inviteToken,
        accepted: false,
      },
    })

    // TODO: Send email with invite link
    // For now, just return the token (in production, send via email)
    const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL || ""}/invite/${inviteToken}`
    console.log(`Team invite created for ${email}: ${inviteLink}`)

    return NextResponse.json({
      success: true,
      teamMember: {
        id: teamMember.id,
        email: teamMember.email,
        role: teamMember.role,
        accepted: teamMember.accepted,
      },
      // Only include invite link in development/testing
      inviteLink: process.env.NODE_ENV !== "production" ? inviteLink : undefined,
      message: "Einladung erstellt. In Produktion wird eine Email gesendet.",
    })
  } catch (error) {
    console.error("Team invite error:", error)
    return NextResponse.json(
      { error: "Fehler beim Einladen" },
      { status: 500 }
    )
  }
}
