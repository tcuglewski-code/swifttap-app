import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SwiftTap - Bezahlen so einfach wie ein Tipp",
  description: "Bargeldloses Bezahlen via QR Code + Stripe. Die moderne Zahlungsplattform für Händler.",
  keywords: ["Zahlung", "QR Code", "Stripe", "POS", "Bezahlen", "Händler"],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="de">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
