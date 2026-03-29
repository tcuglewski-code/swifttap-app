"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkAdmin() {
      if (status === "loading") return

      if (!session) {
        router.push("/login")
        return
      }

      // Check admin status via API
      try {
        const res = await fetch("/api/admin/stats")
        if (res.status === 401) {
          router.push("/dashboard")
          return
        }
        setIsAdmin(true)
      } catch {
        router.push("/dashboard")
      } finally {
        setLoading(false)
      }
    }
    checkAdmin()
  }, [session, status, router])

  if (loading || !isAdmin) {
    return (
      <div className="min-h-screen bg-[#1A2744] flex items-center justify-center">
        <div className="text-white">Lade...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-[#1A2744] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link href="/admin/dashboard" className="font-bold text-xl">
                Zipayo Admin
              </Link>
              <Link href="/admin/dashboard" className="hover:text-[#00C9B1] transition-colors">
                Dashboard
              </Link>
              <Link href="/admin/merchants" className="hover:text-[#00C9B1] transition-colors">
                Merchants
              </Link>
              <Link href="/admin/commissions" className="hover:text-[#00C9B1] transition-colors">
                Commissions
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-sm hover:text-[#00C9B1]">
                ← Merchant Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
