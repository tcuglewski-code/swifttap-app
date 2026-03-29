"use client"

import Link from "next/link"
import { Smartphone, ArrowLeft } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Impressum — Zipayo",
  description: "Impressum und rechtliche Informationen zu Zipayo gemäß § 5 TMG.",
}

export default function ImpressumPage() {
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
          <h1 className="text-3xl font-bold text-primary mb-8">Impressum</h1>
          
          <p className="text-gray-600 mb-6">Angaben gemäß § 5 TMG</p>

          <h2 className="text-xl font-semibold text-primary mt-8 mb-4">Anbieter</h2>
          <p className="text-gray-700 mb-4">
            [Firmenname]<br />
            [Straße und Hausnummer]<br />
            [PLZ Ort]<br />
            Deutschland
          </p>

          <h2 className="text-xl font-semibold text-primary mt-8 mb-4">Kontakt</h2>
          <p className="text-gray-700 mb-4">
            E-Mail:{" "}
            <a href="mailto:info@zipayo.de" className="text-accent hover:underline">info@zipayo.de</a>
          </p>

          <h2 className="text-xl font-semibold text-primary mt-8 mb-4">Vertretungsberechtigte Person</h2>
          <p className="text-gray-700 mb-4">
            [Geschäftsführer/Inhaber Name]
          </p>

          <h2 className="text-xl font-semibold text-primary mt-8 mb-4">Registereintrag</h2>
          <p className="text-gray-700 mb-4">
            Registergericht: [Amtsgericht]<br />
            Registernummer: [HRB XXXXX]
          </p>

          <h2 className="text-xl font-semibold text-primary mt-8 mb-4">Umsatzsteuer-ID</h2>
          <p className="text-gray-700 mb-4">
            Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz:<br />
            [DE XXXXXXXXX]
          </p>

          <h2 className="text-xl font-semibold text-primary mt-8 mb-4">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
          <p className="text-gray-700 mb-4">
            [Name]<br />
            [Adresse]
          </p>

          <h2 className="text-xl font-semibold text-primary mt-8 mb-4">EU-Streitschlichtung</h2>
          <p className="text-gray-700 mb-4">
            Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{" "}
            <a 
              href="https://ec.europa.eu/consumers/odr/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-accent hover:underline"
            >
              https://ec.europa.eu/consumers/odr/
            </a>
          </p>
          <p className="text-gray-700 mb-4">
            Unsere E-Mail-Adresse finden Sie oben im Impressum.
          </p>

          <h2 className="text-xl font-semibold text-primary mt-8 mb-4">Verbraucherstreitbeilegung / Universalschlichtungsstelle</h2>
          <p className="text-gray-700 mb-4">
            Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer 
            Verbraucherschlichtungsstelle teilzunehmen.
          </p>

          <h2 className="text-xl font-semibold text-primary mt-8 mb-4">Haftung für Inhalte</h2>
          <p className="text-gray-700 mb-4">
            Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach den 
            allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht 
            verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen 
            zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
          </p>
          <p className="text-gray-700 mb-4">
            Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen 
            Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt 
            der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden 
            Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
          </p>

          <h2 className="text-xl font-semibold text-primary mt-8 mb-4">Haftung für Links</h2>
          <p className="text-gray-700 mb-4">
            Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. 
            Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der 
            verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
          </p>
          <p className="text-gray-700 mb-4">
            Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. 
            Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente 
            inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer 
            Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige 
            Links umgehend entfernen.
          </p>

          <h2 className="text-xl font-semibold text-primary mt-8 mb-4">Urheberrecht</h2>
          <p className="text-gray-700 mb-4">
            Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem 
            deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung 
            außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen 
            Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht 
            kommerziellen Gebrauch gestattet.
          </p>
          <p className="text-gray-700 mb-4">
            Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte 
            Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie 
            trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden 
            Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
          </p>

          <div className="mt-12 pt-8 border-t border-gray-200 bg-yellow-50 -mx-4 px-4 py-4 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Hinweis:</strong> Die Platzhalter [in eckigen Klammern] müssen vor der Veröffentlichung 
              durch die tatsächlichen Unternehmensdaten ersetzt werden.
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
            <Link href="/impressum" className="hover:text-white text-accent">Impressum</Link>
            <Link href="/datenschutz" className="hover:text-white">Datenschutz</Link>
            <Link href="/agb" className="hover:text-white">AGB</Link>
          </div>
          <p className="text-sm">© 2026 Zipayo. Alle Rechte vorbehalten.</p>
        </div>
      </footer>
    </div>
  )
}
