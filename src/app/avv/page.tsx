import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AVV — Auftragsverarbeitungsvertrag | Zipayo",
  description:
    "Auftragsverarbeitungsvertrag gemäß Art. 28 DSGVO für Zipayo-Händler",
};

export default function AVVPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12 text-gray-800">
      <h1 className="text-3xl font-bold mb-2">Auftragsverarbeitungsvertrag (AVV)</h1>
      <p className="text-sm text-gray-500 mb-8">
        gemäß Art. 28 Datenschutz-Grundverordnung (DSGVO)
      </p>

      <section className="space-y-6 text-sm leading-relaxed">
        <div>
          <h2 className="text-lg font-semibold mb-2">§ 1 Parteien</h2>
          <p>
            Dieser Vertrag wird geschlossen zwischen dem <strong>Händler</strong> (nachfolgend
            &quot;Verantwortlicher&quot;), der die Zipayo-Plattform nutzt, und der{" "}
            <strong>Feldhub UG (haftungsbeschränkt)</strong>, Tarnowitzer Str. 2, 81929 München
            (nachfolgend &quot;Auftragsverarbeiter&quot; bzw. &quot;Zipayo&quot;).
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">§ 2 Gegenstand und Dauer</h2>
          <p>
            Der Auftragsverarbeiter verarbeitet im Auftrag des Verantwortlichen
            personenbezogene Daten im Rahmen der Zahlungsabwicklung über die
            Zipayo-Plattform. Die Verarbeitung erfolgt für die Dauer der
            Geschäftsbeziehung.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">§ 3 Art und Zweck der Verarbeitung</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Abwicklung von Zahlungstransaktionen via Stripe</li>
            <li>Erstellung und Versand digitaler Quittungen (E-Mail via Resend)</li>
            <li>Bereitstellung des Händler-Dashboards mit Transaktionsübersichten</li>
            <li>Webhook-basierte Statusbenachrichtigungen</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">§ 4 Kategorien betroffener Personen</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Kunden des Händlers (Zahlende)</li>
            <li>Händler und deren Mitarbeiter</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">§ 5 Art der personenbezogenen Daten</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Zahlungsdaten (Betrag, Zeitstempel, Transaktions-ID)</li>
            <li>E-Mail-Adresse (nur bei Quittungsversand, optional)</li>
            <li>Stripe Payment Intent ID und Kundendaten (Stripe-seitig)</li>
            <li>IP-Adresse und Geräteinformationen (technisch bedingt)</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">§ 6 Pflichten des Auftragsverarbeiters</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              Verarbeitung der Daten ausschließlich auf dokumentierte Weisung des
              Verantwortlichen (Art. 28 Abs. 3 lit. a DSGVO)
            </li>
            <li>
              Verpflichtung aller mit der Verarbeitung befassten Personen zur
              Vertraulichkeit
            </li>
            <li>
              Ergreifung aller erforderlichen technischen und organisatorischen
              Maßnahmen gemäß Art. 32 DSGVO
            </li>
            <li>
              Unterstützung des Verantwortlichen bei Betroffenenanfragen und
              Meldepflichten
            </li>
            <li>
              Löschung oder Rückgabe aller personenbezogenen Daten nach Beendigung
              der Auftragsverarbeitung
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">
            § 7 Technische und organisatorische Maßnahmen (TOMs)
          </h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Verschlüsselung:</strong> TLS/SSL-Verschlüsselung aller
              Datenübertragungen
            </li>
            <li>
              <strong>Zahlungssicherheit:</strong> Stripe PCI-DSS Level 1
              zertifiziert — keine Kreditkartendaten auf Zipayo-Servern
            </li>
            <li>
              <strong>Zugangskontrolle:</strong> Authentifizierung via NextAuth.js
              mit verschlüsselten Sessions
            </li>
            <li>
              <strong>Hosting:</strong> Vercel (EU/US, ISO 27001, SOC 2 Type II)
            </li>
            <li>
              <strong>Datenbank:</strong> Neon PostgreSQL mit verschlüsselten
              Verbindungen (sslmode=require)
            </li>
            <li>
              <strong>Datenlöschung:</strong> Automatische Löschung
              personenbezogener Daten auf Anfrage innerhalb von 30 Tagen
            </li>
            <li>
              <strong>Monitoring:</strong> Logging ohne personenbezogene Daten
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">§ 8 Unterauftragsverarbeiter</h2>
          <p className="mb-2">
            Der Auftragsverarbeiter setzt folgende Unterauftragsverarbeiter ein:
          </p>
          <table className="w-full text-xs border border-gray-200 rounded">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left p-2 border-b">Dienstleister</th>
                <th className="text-left p-2 border-b">Zweck</th>
                <th className="text-left p-2 border-b">Standort</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2 border-b">Stripe, Inc.</td>
                <td className="p-2 border-b">Zahlungsabwicklung</td>
                <td className="p-2 border-b">USA/EU (SCCs)</td>
              </tr>
              <tr>
                <td className="p-2 border-b">Vercel, Inc.</td>
                <td className="p-2 border-b">Hosting & Deployment</td>
                <td className="p-2 border-b">USA/EU (SCCs)</td>
              </tr>
              <tr>
                <td className="p-2 border-b">Neon, Inc.</td>
                <td className="p-2 border-b">Datenbank</td>
                <td className="p-2 border-b">EU (Frankfurt)</td>
              </tr>
              <tr>
                <td className="p-2 border-b">Resend, Inc.</td>
                <td className="p-2 border-b">E-Mail-Versand (Quittungen)</td>
                <td className="p-2 border-b">USA (SCCs)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">§ 9 Rechte der betroffenen Personen</h2>
          <p>
            Der Auftragsverarbeiter unterstützt den Verantwortlichen bei der
            Erfüllung der Betroffenenrechte (Auskunft, Berichtigung, Löschung,
            Einschränkung, Datenübertragbarkeit, Widerspruch) gemäß Art. 12–23
            DSGVO.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">§ 10 Kontakt</h2>
          <p>
            Für Fragen zu diesem AVV wenden Sie sich an:{" "}
            <a
              href="mailto:datenschutz@feldhub.com"
              className="text-emerald-600 underline"
            >
              datenschutz@feldhub.com
            </a>
          </p>
        </div>

        <div className="pt-4 border-t text-xs text-gray-400">
          <p>Stand: April 2026 | Feldhub UG (haftungsbeschränkt)</p>
        </div>
      </section>
    </main>
  );
}
