"use client"

import Link from "next/link"
import { Smartphone, ArrowLeft } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Allgemeine Geschäftsbedingungen — Zipayo",
  description: "AGB für die Nutzung von Zipayo. Informieren Sie sich über die Vertragsbedingungen unserer Zahlungsplattform.",
}

export default function AGBPage() {
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
          <h1 className="text-3xl font-bold text-primary mb-8">Allgemeine Geschäftsbedingungen</h1>
          
          <p className="text-gray-600 mb-6">Stand: März 2026</p>

          <h2 className="text-xl font-semibold text-primary mt-8 mb-4">§ 1 Geltungsbereich</h2>
          <p className="text-gray-700 mb-4">
            (1) Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Verträge über die Nutzung der 
            SaaS-Plattform „Zipayo" zwischen dem Anbieter (nachfolgend „Zipayo") und dem Kunden 
            (nachfolgend „Händler").
          </p>
          <p className="text-gray-700 mb-4">
            (2) Abweichende Bedingungen des Händlers werden nicht anerkannt, es sei denn, Zipayo stimmt 
            ihrer Geltung ausdrücklich schriftlich zu.
          </p>

          <h2 className="text-xl font-semibold text-primary mt-8 mb-4">§ 2 Vertragsgegenstand</h2>
          <p className="text-gray-700 mb-4">
            (1) Zipayo stellt dem Händler eine webbasierte Zahlungsplattform zur Verfügung, die folgende 
            Funktionen umfasst:
          </p>
          <ul className="list-disc pl-6 text-gray-700 mb-4">
            <li>Annahme von Zahlungen via QR-Code</li>
            <li>Tap-to-Pay-Funktionalität (sofern vom Gerät unterstützt)</li>
            <li>Dashboard zur Überwachung von Transaktionen</li>
            <li>API-Zugang für Integrationen</li>
            <li>Team-Management (je nach Tarif)</li>
          </ul>
          <p className="text-gray-700 mb-4">
            (2) Die Zahlungsabwicklung erfolgt über den externen Zahlungsdienstleister Stripe. Der Händler 
            schließt hierzu einen separaten Vertrag mit Stripe ab.
          </p>

          <h2 className="text-xl font-semibold text-primary mt-8 mb-4">§ 3 Vertragsschluss</h2>
          <p className="text-gray-700 mb-4">
            (1) Die Registrierung bei Zipayo stellt ein verbindliches Angebot zum Vertragsschluss dar.
          </p>
          <p className="text-gray-700 mb-4">
            (2) Der Vertrag kommt mit der Freischaltung des Händlerkontos zustande.
          </p>
          <p className="text-gray-700 mb-4">
            (3) Voraussetzung für die vollständige Nutzung ist die Verbindung eines Stripe-Kontos (Stripe Connect).
          </p>

          <h2 className="text-xl font-semibold text-primary mt-8 mb-4">§ 4 Preise und Zahlungsbedingungen</h2>
          <p className="text-gray-700 mb-4">
            (1) Zipayo bietet folgende Tarife an:
          </p>
          
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-medium text-primary mb-4">Tarifübersicht</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Tarif</th>
                  <th className="text-left py-2">Monatspreis</th>
                  <th className="text-left py-2">Inklusivleistungen</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 font-medium">Starter</td>
                  <td className="py-3">0,00 €</td>
                  <td className="py-3">Bis 1.000 € Umsatz/Monat, QR-Zahlungen</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 font-medium">Pro</td>
                  <td className="py-3">29,00 €</td>
                  <td className="py-3">Unbegrenzter Umsatz, Tap-to-Pay, API, Branding</td>
                </tr>
                <tr>
                  <td className="py-3 font-medium">Business</td>
                  <td className="py-3">79,00 €</td>
                  <td className="py-3">Alles aus Pro + Multi-Standorte, Team-Management</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-gray-700 mb-4">
            (2) Zusätzlich fallen pro Transaktion Gebühren an: <strong>1,4% + 0,25 €</strong> des Transaktionsbetrags.
          </p>
          <p className="text-gray-700 mb-4">
            (3) Alle Preise verstehen sich netto zzgl. der gesetzlichen Mehrwertsteuer.
          </p>
          <p className="text-gray-700 mb-4">
            (4) Die monatlichen Gebühren werden im Voraus per Lastschrift über Stripe eingezogen.
          </p>

          <h2 className="text-xl font-semibold text-primary mt-8 mb-4">§ 5 Stripe als Zahlungsabwickler</h2>
          <p className="text-gray-700 mb-4">
            (1) Die Verarbeitung von Zahlungen erfolgt ausschließlich durch Stripe Payments Europe, Ltd.
          </p>
          <p className="text-gray-700 mb-4">
            (2) Der Händler verpflichtet sich, die Nutzungsbedingungen von Stripe einzuhalten. Zipayo ist 
            nicht Vertragspartner des Zahlungsvertrags zwischen Händler und Stripe.
          </p>
          <p className="text-gray-700 mb-4">
            (3) Auszahlungen an den Händler erfolgen gemäß den Stripe-Auszahlungsrichtlinien, in der Regel 
            innerhalb von 2-7 Werktagen.
          </p>

          <h2 className="text-xl font-semibold text-primary mt-8 mb-4">§ 6 Pflichten des Händlers</h2>
          <p className="text-gray-700 mb-4">
            Der Händler verpflichtet sich:
          </p>
          <ul className="list-disc pl-6 text-gray-700 mb-4">
            <li>Wahre und vollständige Angaben bei der Registrierung zu machen</li>
            <li>Zugangsdaten geheim zu halten und vor unbefugtem Zugriff zu schützen</li>
            <li>Zipayo unverzüglich über Änderungen relevanter Daten zu informieren</li>
            <li>Die Plattform nicht für illegale Zwecke zu nutzen</li>
            <li>Die geltenden Gesetze und Vorschriften einzuhalten, insbesondere Steuer- und Handelsrecht</li>
          </ul>

          <h2 className="text-xl font-semibold text-primary mt-8 mb-4">§ 7 Verfügbarkeit und Support</h2>
          <p className="text-gray-700 mb-4">
            (1) Zipayo strebt eine Verfügbarkeit von 99,5% im Jahresmittel an. Geplante Wartungsarbeiten 
            werden vorab angekündigt.
          </p>
          <p className="text-gray-700 mb-4">
            (2) Support ist je nach Tarif verfügbar:
          </p>
          <ul className="list-disc pl-6 text-gray-700 mb-4">
            <li><strong>Starter:</strong> E-Mail-Support</li>
            <li><strong>Pro:</strong> Prioritäts-Support per E-Mail</li>
            <li><strong>Business:</strong> Dedizierter Account Manager</li>
          </ul>

          <h2 className="text-xl font-semibold text-primary mt-8 mb-4">§ 8 Haftung</h2>
          <p className="text-gray-700 mb-4">
            (1) Zipayo haftet unbeschränkt für Schäden aus der Verletzung des Lebens, des Körpers oder 
            der Gesundheit sowie für Vorsatz und grobe Fahrlässigkeit.
          </p>
          <p className="text-gray-700 mb-4">
            (2) Bei leichter Fahrlässigkeit haftet Zipayo nur für die Verletzung wesentlicher 
            Vertragspflichten, begrenzt auf den vorhersehbaren, vertragstypischen Schaden.
          </p>
          <p className="text-gray-700 mb-4">
            (3) Zipayo haftet nicht für:
          </p>
          <ul className="list-disc pl-6 text-gray-700 mb-4">
            <li>Störungen oder Ausfälle bei Stripe</li>
            <li>Datenverlust durch mangelnde Sicherungsmaßnahmen des Händlers</li>
            <li>Inhalte oder Transaktionen zwischen Händler und dessen Kunden</li>
            <li>Fehlerhafte Preisangaben durch den Händler</li>
          </ul>

          <h2 className="text-xl font-semibold text-primary mt-8 mb-4">§ 9 Vertragslaufzeit und Kündigung</h2>
          <p className="text-gray-700 mb-4">
            (1) Der Vertrag wird auf unbestimmte Zeit geschlossen.
          </p>
          <p className="text-gray-700 mb-4">
            (2) Beide Parteien können den Vertrag mit einer Frist von 30 Tagen zum Monatsende kündigen.
          </p>
          <p className="text-gray-700 mb-4">
            (3) Das Recht zur außerordentlichen Kündigung aus wichtigem Grund bleibt unberührt. Ein wichtiger 
            Grund liegt insbesondere vor bei:
          </p>
          <ul className="list-disc pl-6 text-gray-700 mb-4">
            <li>Verstoß gegen diese AGB</li>
            <li>Zahlungsverzug von mehr als 14 Tagen</li>
            <li>Missbrauch der Plattform</li>
          </ul>
          <p className="text-gray-700 mb-4">
            (4) Nach Vertragsende werden Daten gemäß den gesetzlichen Aufbewahrungspflichten gespeichert.
          </p>

          <h2 className="text-xl font-semibold text-primary mt-8 mb-4">§ 10 Datenschutz</h2>
          <p className="text-gray-700 mb-4">
            Die Verarbeitung personenbezogener Daten erfolgt gemäß unserer{" "}
            <Link href="/datenschutz" className="text-accent hover:underline">Datenschutzerklärung</Link>.
          </p>

          <h2 className="text-xl font-semibold text-primary mt-8 mb-4">§ 11 Änderungen der AGB</h2>
          <p className="text-gray-700 mb-4">
            (1) Zipayo behält sich vor, diese AGB mit angemessener Frist zu ändern.
          </p>
          <p className="text-gray-700 mb-4">
            (2) Änderungen werden dem Händler per E-Mail angekündigt. Widerspricht der Händler nicht innerhalb 
            von 30 Tagen, gelten die geänderten AGB als akzeptiert.
          </p>

          <h2 className="text-xl font-semibold text-primary mt-8 mb-4">§ 12 Schlussbestimmungen</h2>
          <p className="text-gray-700 mb-4">
            (1) Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts.
          </p>
          <p className="text-gray-700 mb-4">
            (2) Ist der Händler Kaufmann, juristische Person des öffentlichen Rechts oder öffentlich-rechtliches 
            Sondervermögen, ist ausschließlicher Gerichtsstand der Sitz von Zipayo.
          </p>
          <p className="text-gray-700 mb-4">
            (3) Sollten einzelne Bestimmungen dieser AGB unwirksam sein, bleibt die Wirksamkeit der übrigen 
            Bestimmungen unberührt.
          </p>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Bei Fragen zu den AGB erreichen Sie uns unter:{" "}
              <a href="mailto:info@zipayo.de" className="text-accent hover:underline">info@zipayo.de</a>
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
            <Link href="/datenschutz" className="hover:text-white">Datenschutz</Link>
            <Link href="/agb" className="hover:text-white text-accent">AGB</Link>
          </div>
          <p className="text-sm">© 2026 Zipayo. Alle Rechte vorbehalten.</p>
        </div>
      </footer>
    </div>
  )
}
