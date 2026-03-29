import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(req: NextRequest) {
  try {
    const { email, password, name, businessName } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email und Passwort erforderlich" },
        { status: 400 }
      )
    }

    // Check if user exists
    const existingUser = await prisma.swiftTapUser.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "Ein Konto mit dieser E-Mail existiert bereits" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await prisma.swiftTapUser.create({
      data: {
        email,
        password: hashedPassword,
        name,
        businessName,
      },
    })

    return NextResponse.json(
      { message: "Konto erfolgreich erstellt", userId: user.id },
      { status: 201 }
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Registrierung fehlgeschlagen" },
      { status: 500 }
    )
  }
}
