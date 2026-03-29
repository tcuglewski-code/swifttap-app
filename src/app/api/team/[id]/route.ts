export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Nicht authentifiziert" }, { status: 401 })
    }

    const { id } = await params

    const merchant = await prisma.merchant.findUnique({
      where: { userId: session.user.id },
    })

    if (!merchant) {
      return NextResponse.json({ error: "Merchant nicht gefunden" }, { status: 404 })
    }

    // Find team member
    const teamMember = await prisma.teamMember.findUnique({
      where: { id },
    })

    if (!teamMember) {
      return NextResponse.json({ error: "Team-Mitglied nicht gefunden" }, { status: 404 })
    }

    // Check ownership
    if (teamMember.merchantId !== merchant.id) {
      return NextResponse.json({ error: "Keine Berechtigung" }, { status: 403 })
    }

    // Cannot remove owner
    if (teamMember.role === "owner") {
      return NextResponse.json(
        { error: "Der Besitzer kann nicht entfernt werden" },
        { status: 400 }
      )
    }

    // Delete team member
    await prisma.teamMember.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Team member delete error:", error)
    return NextResponse.json(
      { error: "Fehler beim Entfernen" },
      { status: 500 }
    )
  }
}
