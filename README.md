# Zipayo 💳

**Bezahlen so einfach wie ein Tipp** — Die moderne Zahlungsplattform für Händler.

![Zipayo](https://swifttap-app.vercel.app/og-image.png)

## 🚀 Was ist Zipayo?

Zipayo ist eine SaaS-Zahlungsplattform, die es Händlern ermöglicht, bargeldlose Zahlungen via QR-Code und Tap-to-Pay zu akzeptieren. Keine teure Hardware, keine komplizierten Verträge — einfach registrieren, Stripe verbinden und Zahlungen empfangen.

**Live-Demo:** [https://swifttap-app.vercel.app](https://swifttap-app.vercel.app)

## ✨ Features

### Für Händler
- **QR-Code Zahlungen** — Generiere Zahlungs-QR-Codes, Kunden scannen und bezahlen
- **Tap to Pay** — Nutze dein Smartphone als Zahlungsterminal (NFC)
- **Echtzeit-Dashboard** — Alle Transaktionen und Umsätze auf einen Blick
- **Team-Management** — Lade Teammitglieder ein und verwalte Berechtigungen
- **API-Zugang** — Integriere Zipayo in deine bestehende Software
- **Multi-Standorte** — Verwalte mehrere Filialen in einem Account
- **Custom Branding** — Dein Logo auf Zahlungsseiten (Pro+)

### Für Entwickler
- **REST API v1** — Vollständige API für Integrationen
- **Webhook-Events** — Echtzeit-Benachrichtigungen über Zahlungen
- **Sandbox-Modus** — Teste mit Stripe Test-Keys
- **TypeScript SDK** — (Coming Soon)

### Sicherheit
- **PCI-DSS konform** — Powered by Stripe
- **DSGVO-konform** — Datenschutz nach EU-Standards
- **Rate Limiting** — Schutz vor API-Missbrauch
- **Security Headers** — HSTS, CSP, XSS-Protection

## 💰 Preise

| Plan | Preis | Features |
|------|-------|----------|
| **Starter** | 0€/Monat | Bis 1.000€ Umsatz, QR-Zahlungen, E-Mail Support |
| **Pro** | 29€/Monat | Unbegrenzter Umsatz, Tap-to-Pay, API, Branding |
| **Business** | 79€/Monat | + Multi-Standorte, Team-Management, Account Manager |

**Transaktionsgebühren:** 1,4% + 0,25€ pro Transaktion

## 🛠 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Sprache:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Datenbank:** PostgreSQL (Neon)
- **ORM:** Prisma
- **Auth:** NextAuth.js v5
- **Zahlungen:** Stripe Connect
- **E-Mail:** Resend
- **Hosting:** Vercel

## 📚 Documentation

- 📋 [Staging Setup & Testing](docs/STAGING-SETUP.md) - Stripe Test-Keys, Webhooks, End-to-End Tests

## 🚀 Schnellstart

### Voraussetzungen

- Node.js 18+
- npm oder pnpm
- PostgreSQL Datenbank (oder Neon Account)
- Stripe Account
- Resend Account (optional, für E-Mails)

### Installation

```bash
# Repository klonen
git clone https://github.com/tcuglewski-code/swifttap-app.git
cd swifttap-app

# Dependencies installieren
npm install

# Umgebungsvariablen kopieren
cp .env.example .env.local

# .env.local mit deinen Werten ausfüllen (siehe unten)

# Datenbank initialisieren
npx prisma db push

# Entwicklungsserver starten
npm run dev
```

Öffne [http://localhost:3000](http://localhost:3000) im Browser.

## ⚙️ Umgebungsvariablen

| Variable | Beschreibung | Pflicht |
|----------|--------------|---------|
| `DATABASE_URL` | PostgreSQL Connection String | ✅ |
| `NEXTAUTH_SECRET` | Secret für JWT-Signierung (min. 32 Zeichen) | ✅ |
| `NEXTAUTH_URL` | URL deiner App (z.B. http://localhost:3000) | ✅ |
| `STRIPE_SECRET_KEY` | Stripe API Secret Key (sk_...) | ✅ |
| `STRIPE_PUBLISHABLE_KEY` | Stripe Publishable Key (pk_...) | ✅ |
| `STRIPE_WEBHOOK_SECRET` | Stripe Webhook Signing Secret (whsec_...) | ✅ |
| `RESEND_API_KEY` | Resend API Key für E-Mails | ❌ |
| `ZIPAYO_PLATFORM_FEE_PERCENT` | Plattformgebühr in % (default: 1.4) | ❌ |

### Stripe Keys erhalten

1. Erstelle einen [Stripe Account](https://dashboard.stripe.com/register)
2. Gehe zu [API Keys](https://dashboard.stripe.com/apikeys)
3. Kopiere Publishable Key und Secret Key
4. Für Webhooks: [Webhooks](https://dashboard.stripe.com/webhooks) → Add Endpoint
   - URL: `https://deine-domain.com/api/webhooks/stripe`
   - Events: `checkout.session.completed`, `payment_intent.succeeded`, `account.updated`

## 📡 API Dokumentation

### Authentifizierung

Alle API-Requests benötigen einen API-Key im Header:

```bash
Authorization: Bearer st_dein-api-key
# oder
X-API-Key: st_dein-api-key
```

### Endpoints

#### Zahlungsanfrage erstellen

```bash
curl -X POST https://swifttap-app.vercel.app/api/v1/payment-request \
  -H "Authorization: Bearer st_dein-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 2500,
    "currency": "eur",
    "description": "Bestellung #123"
  }'
```

**Response:**
```json
{
  "id": "pr_abc123",
  "amount": 2500,
  "currency": "eur",
  "status": "pending",
  "paymentUrl": "https://swifttap-app.vercel.app/pay/pr_abc123",
  "qrCodeUrl": "https://swifttap-app.vercel.app/api/qr/pr_abc123",
  "expiresAt": "2026-03-30T12:00:00Z"
}
```

#### Zahlungsstatus abfragen

```bash
curl https://swifttap-app.vercel.app/api/v1/payment-status/pr_abc123 \
  -H "Authorization: Bearer st_dein-api-key"
```

**Response:**
```json
{
  "id": "pr_abc123",
  "status": "completed",
  "amount": 2500,
  "currency": "eur",
  "paidAt": "2026-03-29T14:30:00Z"
}
```

#### Zahlungsanfrage stornieren

```bash
curl -X POST https://swifttap-app.vercel.app/api/v1/payment-request/pr_abc123/cancel \
  -H "Authorization: Bearer st_dein-api-key"
```

### Webhooks

Zipayo sendet Webhook-Events an deine konfigurierte URL:

```json
{
  "event": "payment.completed",
  "data": {
    "id": "pr_abc123",
    "amount": 2500,
    "currency": "eur",
    "merchantId": "merch_xyz"
  },
  "timestamp": "2026-03-29T14:30:00Z"
}
```

Events:
- `payment.completed` — Zahlung erfolgreich
- `payment.failed` — Zahlung fehlgeschlagen
- `payment.refunded` — Zahlung erstattet
- `payment.expired` — Zahlungsanfrage abgelaufen

## 🚀 Deploy auf Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/tcuglewski-code/swifttap-app)

1. Klicke auf den Button oben
2. Verbinde dein GitHub Repository
3. Füge Umgebungsvariablen hinzu
4. Deploy!

### Manuelle Schritte nach Deploy

1. **Stripe Webhook** konfigurieren mit der Vercel-URL
2. **Custom Domain** in Vercel Settings hinzufügen (optional)
3. **Resend Domain** verifizieren für E-Mail-Versand

## 📁 Projektstruktur

```
swifttap-app/
├── prisma/
│   └── schema.prisma       # Datenbankschema
├── public/
│   └── robots.txt          # SEO
├── src/
│   ├── app/
│   │   ├── (auth)/         # Login, Register
│   │   ├── admin/          # Admin Dashboard
│   │   ├── api/            # API Routes
│   │   ├── dashboard/      # Merchant Dashboard
│   │   ├── datenschutz/    # Legal Pages
│   │   ├── agb/
│   │   ├── impressum/
│   │   ├── layout.tsx
│   │   ├── page.tsx        # Landing Page
│   │   └── sitemap.ts      # Dynamic Sitemap
│   ├── components/
│   │   ├── ui/             # shadcn/ui Components
│   │   └── providers.tsx
│   └── lib/
│       ├── prisma.ts       # Prisma Client
│       ├── stripe.ts       # Stripe Config
│       ├── auth.ts         # NextAuth Config
│       ├── email-templates.ts
│       ├── rate-limit.ts
│       ├── validation.ts   # Zod Schemas
│       └── cors.ts
├── docs/
│   └── STAGING-SETUP.md    # Testing & Staging Guide
├── .env.example
├── next.config.mjs
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## 🔒 Sicherheit

- Alle Zahlungsdaten werden von Stripe verarbeitet (PCI-DSS Level 1)
- API-Keys werden gehasht gespeichert
- Rate Limiting: 100 Requests/Minute pro IP
- Security Headers (HSTS, X-Frame-Options, etc.)
- Input-Validierung mit Zod
- CORS-Whitelist für erlaubte Origins

## 📄 Lizenz

MIT License — siehe [LICENSE](LICENSE)

## 🤝 Support

- **E-Mail:** support@zipayo.de
- **Issues:** [GitHub Issues](https://github.com/tcuglewski-code/swifttap-app/issues)

---

Made with ❤️ by Zipayo (Feldhub UG)
