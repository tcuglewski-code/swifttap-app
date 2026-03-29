import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  QrCode, 
  Smartphone, 
  Terminal, 
  Layers, 
  Check,
  Zap,
  Shield,
  BarChart3
} from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-primary">SwiftTap</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-gray-600 hover:text-primary">
                Anmelden
              </Link>
              <Link href="/register">
                <Button variant="accent">Jetzt starten</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-b from-primary-50 to-white">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-primary mb-6">
            Bezahlen so einfach<br />
            <span className="text-accent">wie ein Tipp</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Akzeptieren Sie bargeldlose Zahlungen in Sekunden. QR-Code scannen, 
            bezahlen, fertig. Keine teure Hardware, keine komplizierten Verträge.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" variant="accent" className="text-lg px-8">
                Jetzt kostenlos starten
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Mehr erfahren
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            Keine Kreditkarte erforderlich • Kostenlos bis 1.000€/Monat
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-primary mb-12">
            Alles was Sie für Zahlungen brauchen
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-2 hover:border-accent transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-accent-50 rounded-lg flex items-center justify-center mb-4">
                  <QrCode className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="text-lg">QR-Zahlung</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Generieren Sie QR-Codes für Zahlungen. Kunden scannen und bezahlen direkt mit dem Smartphone.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-accent transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-accent-50 rounded-lg flex items-center justify-center mb-4">
                  <Smartphone className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="text-lg">Tap to Pay</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Nutzen Sie Ihr Smartphone als Zahlungsterminal. NFC-fähige Geräte akzeptiert.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-accent transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-accent-50 rounded-lg flex items-center justify-center mb-4">
                  <Terminal className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="text-lg">Terminal-Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Verbinden Sie bestehende Terminals oder nutzen Sie unsere Hardware-Partner.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-accent transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-accent-50 rounded-lg flex items-center justify-center mb-4">
                  <Layers className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="text-lg">FELDWERK-Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Nahtlose Integration in FELDWERK-Systeme für Außendienst-Unternehmen.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-primary-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-primary mb-8">
                Warum SwiftTap?
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-primary">Sofort einsatzbereit</h3>
                    <p className="text-gray-600">In 5 Minuten angemeldet und erste Zahlung empfangen.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-primary">Sicher & PCI-konform</h3>
                    <p className="text-gray-600">Powered by Stripe. Höchste Sicherheitsstandards garantiert.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-primary">Transparente Übersicht</h3>
                    <p className="text-gray-600">Echtzeit-Dashboard mit allen Transaktionen und Umsätzen.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-xl">
              <div className="text-center">
                <div className="w-32 h-32 mx-auto bg-primary-50 rounded-2xl flex items-center justify-center mb-6">
                  <QrCode className="w-16 h-16 text-primary" />
                </div>
                <p className="text-gray-500">Beispiel QR-Code für Zahlung</p>
                <p className="text-2xl font-bold text-primary mt-2">25,00 €</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-primary mb-4">
            Einfache, faire Preise
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Keine versteckten Kosten. Nur 1,4% + 0,25€ pro Transaktion.
          </p>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter */}
            <Card className="border-2">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-xl">Starter</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-primary">€0</span>
                  <span className="text-gray-500">/Monat</span>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-accent" />
                    <span>Bis 1.000€ Umsatz/Monat</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-accent" />
                    <span>QR-Code Zahlungen</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-accent" />
                    <span>Dashboard & Reports</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-accent" />
                    <span>E-Mail Support</span>
                  </li>
                </ul>
                <Link href="/register" className="block mt-6">
                  <Button className="w-full" variant="outline">
                    Kostenlos starten
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Pro */}
            <Card className="border-2 border-accent relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-accent text-white text-sm px-4 py-1 rounded-full">
                  Beliebt
                </span>
              </div>
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-xl">Pro</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-primary">€29</span>
                  <span className="text-gray-500">/Monat</span>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-accent" />
                    <span>Unbegrenzter Umsatz</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-accent" />
                    <span>Tap to Pay</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-accent" />
                    <span>Eigenes Branding</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-accent" />
                    <span>Prioritäts-Support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-accent" />
                    <span>API-Zugang</span>
                  </li>
                </ul>
                <Link href="/register" className="block mt-6">
                  <Button className="w-full" variant="accent">
                    Jetzt upgraden
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Business */}
            <Card className="border-2">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-xl">Business</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-primary">€79</span>
                  <span className="text-gray-500">/Monat</span>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-accent" />
                    <span>Alles aus Pro</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-accent" />
                    <span>Mehrere Standorte</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-accent" />
                    <span>Team-Management</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-accent" />
                    <span>FELDWERK Integration</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-accent" />
                    <span>Dedizierter Account Manager</span>
                  </li>
                </ul>
                <Link href="/register" className="block mt-6">
                  <Button className="w-full" variant="outline">
                    Kontaktieren
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Bereit für moderne Zahlungen?
          </h2>
          <p className="text-primary-200 mb-8 text-lg">
            Starten Sie noch heute kostenlos und akzeptieren Sie Ihre erste Zahlung in Minuten.
          </p>
          <Link href="/register">
            <Button size="lg" variant="accent" className="text-lg px-8">
              Jetzt kostenlos starten
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-primary-800 text-primary-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">SwiftTap</span>
              </div>
              <p className="text-sm">
                Die moderne Zahlungsplattform für Händler. Ein Produkt von FELDWERK.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Produkt</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#features" className="hover:text-white">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-white">Preise</Link></li>
                <li><Link href="/login" className="hover:text-white">Anmelden</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Unternehmen</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="https://feldwerk.de" className="hover:text-white">Über FELDWERK</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Karriere</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Rechtliches</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Impressum</a></li>
                <li><a href="#" className="hover:text-white">Datenschutz</a></li>
                <li><a href="#" className="hover:text-white">AGB</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-primary-700 mt-8 pt-8 text-sm text-center">
            © 2026 SwiftTap by FELDWERK. Alle Rechte vorbehalten.
          </div>
        </div>
      </footer>
    </div>
  )
}
