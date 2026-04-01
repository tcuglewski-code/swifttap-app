import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Anmelden",
  description: "Melden Sie sich in Ihrem Zipayo Händler-Konto an. Zugang zu Ihrem Dashboard, Transaktionen und Einstellungen.",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Anmelden — Zipayo",
    description: "Melden Sie sich in Ihrem Zipayo Händler-Konto an.",
    type: "website",
  },
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
