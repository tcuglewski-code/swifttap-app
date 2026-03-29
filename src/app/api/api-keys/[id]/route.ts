export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const merchant = await prisma.merchant.findUnique({
      where: { userId: session.user.id }
    })

    if (!merchant) {
      return NextResponse.json({ error: "Merchant not found" }, { status: 404 })
    }

    // Verify key belongs to merchant
    const apiKey = await prisma.apiKey.findFirst({
      where: {
        id,
        merchantId: merchant.id
      }
    })

    if (!apiKey) {
      return NextResponse.json({ error: "API key not found" }, { status: 404 })
    }

    await prisma.apiKey.delete({
      where: { id }
    })

    return NextResponse.json({ message: "API key deleted" })
  } catch (error) {
    console.error("API key delete error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
