import { getServerSession } from "next-auth"
import { authOptions } from "./auth"
import { prisma } from "./prisma"

export async function isAdmin(): Promise<boolean> {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return false
  
  const user = await prisma.swiftTapUser.findUnique({
    where: { id: session.user.id },
    select: { email: true, role: true }
  })
  
  if (!user) return false
  
  // Admin wenn role="admin" ODER email=admin@zipayo.de
  return user.role === "admin" || user.email === "admin@zipayo.de"
}

export async function requireAdmin() {
  const admin = await isAdmin()
  if (!admin) {
    throw new Error("Unauthorized: Admin access required")
  }
  return true
}
