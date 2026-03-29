import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL('https://zipayo-app.vercel.app'),
  title: {
    default: "Zipayo - Bezahlen so einfach wie ein Tipp",
    template: "%s — Zipayo"
  },
  description: "Bargeldloses Bezahlen via QR Code + Stripe. Die moderne Zahlungsplattform für Händler. Sofort einsatzbereit, keine Hardware nötig.",
  keywords: [
    "Zahlung",
    "QR Code",
    "Stripe",
    "POS",
    "Bezahlen",
    "Händler",
    "Payment",
    "Zahlungsplattform",
    "bargeldlos",
    "Kartenzahlung",
    "NFC",
    "Tap to Pay",
    "Mobile Payment"
  ],
  authors: [{ name: "Zipayo" }],
  creator: "Zipayo",
  publisher: "Zipayo",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: "https://zipayo-app.vercel.app",
    siteName: "Zipayo",
    title: "Zipayo - Bezahlen so einfach wie ein Tipp",
    description: "Bargeldloses Bezahlen via QR Code + Stripe. Die moderne Zahlungsplattform für Händler.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Zipayo - Die moderne Zahlungsplattform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zipayo - Bezahlen so einfach wie ein Tipp",
    description: "Bargeldloses Bezahlen via QR Code + Stripe. Die moderne Zahlungsplattform für Händler.",
    images: ["/og-image.png"],
    creator: "@zipayo",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
  alternates: {
    canonical: "https://zipayo-app.vercel.app",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="de">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1A2744" />
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
