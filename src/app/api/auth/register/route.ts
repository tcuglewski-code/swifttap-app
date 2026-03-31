export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { checkRateLimit, getClientIP, RATE_LIMITS } from "@/lib/rate-limit"

export async function POST(req: NextRequest) {
  // Strict rate limiting for registration (brute-force + spam protection)
  const clientIP = getClientIP(req.headers)
  const rateLimit = checkRateLimit(`register:${clientIP}`, RATE_LIMITS.register)
  
  if (!rateLimit.success) {
    return NextResponse.json(
      { error: "Zu viele Registrierungsversuche. Bitte versuchen Sie es später erneut." },
      { 
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((rateLimit.resetAt - Date.now()) / 1000)),
        }
      }
    )
  }

  try {
    const { email, password, name, businessName } = await req.json()

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email und Passwort erforderlich" },
        { status: 400 }
      )
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Ungültige E-Mail-Adresse" },
        { status: 400 }
      )
    }

    // Validate password strength (min 8 chars, 1 number, 1 special)
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: passwordValidation.message },
        { status: 400 }
      )
    }

    // Sanitize name and businessName
    const sanitizedName = name ? String(name).slice(0, 100).replace(/<[^>]*>/g, '') : null
    const sanitizedBusinessName = businessName ? String(businessName).slice(0, 200).replace(/<[^>]*>/g, '') : null

    // Check if user exists (use timing-safe comparison concept)
    const existingUser = await prisma.swiftTapUser.findUnique({
      where: { email: email.toLowerCase().trim() },
    })

    if (existingUser) {
      // Don't reveal if email exists (security through obscurity for enum attacks)
      // But for UX, we still tell them - this is a tradeoff
      return NextResponse.json(
        { error: "Ein Konto mit dieser E-Mail existiert bereits" },
        { status: 400 }
      )
    }

    // Hash password with cost factor 12
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await prisma.swiftTapUser.create({
      data: {
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        name: sanitizedName,
        businessName: sanitizedBusinessName,
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

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 254
}

function validatePassword(password: string): { valid: boolean; message: string } {
  if (password.length < 8) {
    return { valid: false, message: "Passwort muss mindestens 8 Zeichen lang sein" }
  }
  if (!/\d/.test(password)) {
    return { valid: false, message: "Passwort muss mindestens eine Zahl enthalten" }
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { valid: false, message: "Passwort muss mindestens ein Sonderzeichen enthalten" }
  }
  if (password.length > 128) {
    return { valid: false, message: "Passwort darf maximal 128 Zeichen lang sein" }
  }
  return { valid: true, message: "" }
}
