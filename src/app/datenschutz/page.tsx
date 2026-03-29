"use client"

import Link from "next/link"
import { Smartphone, ArrowLeft } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Datenschutzerklärung — Zipayo",
  description: "Informationen zum Datenschutz bei Zipayo. Erfahren Sie, wie wir Ihre Daten schützen und verarbeiten.",
}

export default function DatenschutzPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-primary">Zipayo</span>
            </Link>
            <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-primary">
              <ArrowLeft className="w-4 h-4" />
              Zurück
            </Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto prose prose-slate">
          <h1 className="text-3xl font-bold text-primary mb-8">Datenschutzerklärung</h1>
          
          <p className="text-gray-600 mb-6">Stand: März 2026</p>

          <h2 className="text-xl font-semibold text-primary mt-8 mb-4">1. Verantwortlicher</h2>
          <p className="text-gray-700 mb-4">
            Verantwortlicher im Sinne der Datenschutz-Grundverordnung (DSGVO) ist:
          </p>
          <p className="text-gray-700 mb-4">
            [Firmenname]<br />
            [Straße und Hausnummer]<br />
            [PLZ Ort]<br />
            E-Mail: <a href="mailto:datenschutz@zipayo.de" className="text-accent hover:underline">datenschutz@zipayo.de</a>
          </p>

          <h2 className="text-xl font-semibold text-primary mt-8 mb-4">2. Erhebung und Verarbeitung personenbezogener Daten</h2>
          <p className="text-gray-700 mb-4">
            Bei der Nutzung von Zipayo erheben und verarbeiten wir folgende Kategorien personenbezogener Daten:
          </p>
          <h3 className="text-lg font-medium text-primary mt-6 mb-3">2.1 Kontodaten (Händler)</h3>
          <ul className="list-disc pl-6 text-gray-700 mb-4">
            <li>Name und Firmenbezeichnung</li>
            <li>E-Mail-Adresse</li>
            <li>Telefonnummer (optional)</li>
            <li>Anschrift</li>
            <li>Steuernummer / USt-ID</li>
          </ul>
          
          <h3 className="text-lg font-medium text-primary mt-6 mb-3">2.2 Zahlungsdaten</h3>
          <ul className="list-disc pl-6 text-gray-700 mb-4">
            <li>Transaktionsdaten (Betrag, Währung, Zeitpunkt)</li>
            <li>Stripe-Kontoinformationen (über Stripe Connect)</li>
            <li>Bankverbindung für Auszahlungen</li>
          </ul>
          <p className="text-gray-700 mb-4">
            <strong>Hinweis:</strong> Kreditkarten- und Bankdaten von Endkunden werden ausschließlich von Stripe 
            verarbeitet und nie auf unseren Servern gespeichert.
          </p>

          <h3 className="text-lg font-medium text-primary mt-6 mb-3">2.3 Technische Daten</h3>
          <ul className="list-disc pl-6 text-gray-700 mb-4">
            <li>IP-Adresse</li>
            <li>Browser-Typ und Version</li>
            <li>Gerätetyp und Betriebssystem</li>
            <li>Datum und Uhrzeit des Zugriffs</li>
          </ul>

          <h2 className="text-xl font-semibold text-primary mt-8 mb-4">3. Rechtsgrundlagen der Verarbeitung</h2>
          <p className="text-gray-700 mb-4">
            Wir verarbeiten Ihre personenbezogenen Daten auf folgenden Rechtsgrundlagen:
          </p>
          <ul className="list-disc pl-6 text-gray-700 mb-4">
            <li><strong>Art. 6 Abs. 1 lit. b DSGVO:</strong> Erfüllung des Vertrags über die Nutzung von Zipayo</li>
            <li><strong>Art. 6 Abs. 1 lit. c DSGVO:</strong> Erfüllung rechtlicher Verpflichtungen (z.B. steuerrechtliche Aufbewahrung)</li>
            <li><strong>Art. 6 Abs. 1 lit. f DSGVO:</strong> Berechtigte Interessen (z.B. Betrugsprävention, Systemsicherheit)</li>
          </ul>

          <h2 className="text-xl font-semibold text-primary mt-8 mb-4">4. Stripe als Auftragsverarbeiter</h2>
          <p className="text-gray-700 mb-4">
            Wir nutzen Stripe (Stripe Payments Europe, Ltd., Dublin, Irland) als Zahlungsdienstleister. Stripe verarbeitet 
            Zahlungsdaten in unserem Auftrag gemäß Art. 28 DSGVO.
          </p>
          <p className="text-gray-700 mb-4">
            Stripe ist nach PCI-DSS Level 1 zertifiziert und erfüllt höchste Sicherheitsstandards. 
            Datenschutzinformationen von Stripe finden Sie unter:{" "}
            <a href="https://stripe.com/de/privacy" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
              https://stripe.com/de/privacy
            </a>
          </p>

          <h2 className="text-xl font-semibold text-primary mt-8 mb-4">5. Datenaufbewahrung</h2>
          <p className="text-gray-700 mb-4">
            Wir speichern Ihre Daten wie folgt:
          </p>
          <ul className="list-disc pl-6 text-gray-700 mb-4">
            <li><strong>Transaktionsdaten:</strong> 10 Jahre (gemäß GoBD und §147 AO für handels- und steuerrechtliche Aufbewahrungspflichten)</li>
            <li><strong>Kontodaten:</strong> Bis zur Löschung des Kontos, danach 10 Jahre für Abrechnungszwecke</li>
            <li><strong>Technische Logs:</strong> 90 Tage</li>
          </ul>

          <h2 className="text-xl font-semibold text-primary mt-8 mb-4">6. Ihre Rechte als Betroffener</h2>
          <p className="text-gray-700 mb-4">
            Sie haben folgende Rechte bezüglich Ihrer personenbezogenen Daten:
          </p>
          <ul className="list-disc pl-6 text-gray-700 mb-4">
            <li><strong>Auskunftsrecht (Art. 15 DSGVO):</strong> Sie können Auskunft über Ihre gespeicherten Daten verlangen.</li>
            <li><strong>Berichtigungsrecht (Art. 16 DSGVO):</strong> Sie können die Berichtigung unrichtiger Daten verlangen.</li>
            <li><strong>Löschungsrecht (Art. 17 DSGVO):</strong> Sie können die Löschung Ihrer Daten verlangen, sofern keine gesetzlichen Aufbewahrungspflichten entgegenstehen.</li>
            <li><strong>Einschränkungsrecht (Art. 18 DSGVO):</strong> Sie können die Einschränkung der Verarbeitung verlangen.</li>
            <li><strong>Datenübertragbarkeit (Art. 20 DSGVO):</strong> Sie können die Herausgabe Ihrer Daten in einem maschinenlesbaren Format verlangen.</li>
            <li><strong>Widerspruchsrecht (Art. 21 DSGVO):</strong> Sie können der Verarbeitung Ihrer Daten widersprechen.</li>
          </ul>
          <p className="text-gray-700 mb-4">
            Zur Ausübung Ihrer Rechte wenden Sie sich bitte an:{" "}
            <a href="mailto:datenschutz@zipayo.de" className="text-accent hover:underline">datenschutz@zipayo.de</a>
          </p>

          <h2 className="text-xl font-semibold text-primary mt-8 mb-4">7. Beschwerderecht</h2>
          <p className="text-gray-700 mb-4">
            Sie haben das Recht, sich bei einer Aufsichtsbehörde zu beschweren, wenn Sie der Ansicht sind, dass 
            die Verarbeitung Ihrer Daten gegen die DSGVO verstößt.
          </p>

          <h2 className="text-xl font-semibold text-primary mt-8 mb-4">8. Datensicherheit</h2>
          <p className="text-gray-700 mb-4">
            Wir setzen technische und organisatorische Sicherheitsmaßnahmen ein, um Ihre Daten zu schützen:
          </p>
          <ul className="list-disc pl-6 text-gray-700 mb-4">
            <li>SSL/TLS-Verschlüsselung aller Datenübertragungen</li>
            <li>Verschlüsselte Speicherung sensibler Daten</li>
            <li>Regelmäßige Sicherheitsupdates</li>
            <li>Zugriffskontrolle und Protokollierung</li>
          </ul>

          <h2 className="text-xl font-semibold text-primary mt-8 mb-4">9. Cookies</h2>
          <p className="text-gray-700 mb-4">
            Zipayo verwendet nur technisch notwendige Cookies für:
          </p>
          <ul className="list-disc pl-6 text-gray-700 mb-4">
            <li>Authentifizierung und Session-Management</li>
            <li>Sicherheitsfunktionen (CSRF-Schutz)</li>
          </ul>
          <p className="text-gray-700 mb-4">
            Wir verwenden keine Tracking- oder Werbe-Cookies.
          </p>

          <h2 className="text-xl font-semibold text-primary mt-8 mb-4">10. Änderungen dieser Datenschutzerklärung</h2>
          <p className="text-gray-700 mb-4">
            Wir behalten uns vor, diese Datenschutzerklärung anzupassen, um sie an geänderte Rechtslagen oder 
            Änderungen unseres Dienstes anzupassen. Die aktuelle Version finden Sie stets auf dieser Seite.
          </p>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Bei Fragen zum Datenschutz erreichen Sie uns unter:{" "}
              <a href="mailto:datenschutz@zipayo.de" className="text-accent hover:underline">datenschutz@zipayo.de</a>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 bg-primary-800 text-primary-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-accent rounded-lg flex items-center justify-center">
              <Smartphone className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white">Zipayo</span>
          </div>
          <div className="flex gap-6 text-sm">
            <Link href="/impressum" className="hover:text-white">Impressum</Link>
            <Link href="/datenschutz" className="hover:text-white text-accent">Datenschutz</Link>
            <Link href="/agb" className="hover:text-white">AGB</Link>
          </div>
          <p className="text-sm">© 2026 Zipayo. Alle Rechte vorbehalten.</p>
        </div>
      </footer>
    </div>
  )
}
