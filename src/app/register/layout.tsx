import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Kostenlos registrieren",
  description: "Erstellen Sie Ihr kostenloses Zipayo-Konto und akzeptieren Sie in Minuten bargeldlose Zahlungen. Keine Kreditkarte erforderlich.",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Kostenlos registrieren — Zipayo",
    description: "Erstellen Sie Ihr kostenloses Zipayo-Konto und akzeptieren Sie in Minuten bargeldlose Zahlungen.",
    type: "website",
  },
}

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
