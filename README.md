# SwiftTap 💳

**Bezahlen so einfach wie ein Tipp**

SwiftTap ist eine moderne Zahlungsplattform für Händler. Akzeptieren Sie bargeldlose Zahlungen via QR-Code in Sekunden.

![SwiftTap](https://img.shields.io/badge/SwiftTap-Payment%20Platform-00C9B1?style=for-the-badge)

## Features

- 🔲 **QR-Code Zahlungen** - Generieren Sie QR-Codes für schnelle Zahlungen
- 📱 **Tap to Pay** - Nutzen Sie Ihr Smartphone als Zahlungsterminal (coming soon)
- 💳 **Stripe Integration** - Sichere Zahlungsabwicklung
- 📊 **Dashboard** - Echtzeit-Übersicht über Umsätze und Transaktionen
- 🔐 **Sicher** - PCI-konform powered by Stripe

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Sprache:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Auth:** NextAuth.js
- **Database:** PostgreSQL (Neon) + Prisma
- **Payments:** Stripe

## Getting Started

### 1. Installation

```bash
npm install
```

### 2. Environment Setup

Kopiere `.env.example` zu `.env` und fülle die Werte aus:

```bash
cp .env.example .env
```

### 3. Database Setup

```bash
npx prisma generate
node scripts/init-db.mjs
```

### 4. Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Stripe Test Mode

Das Projekt ist für Stripe Test Mode konfiguriert. Verwende Test-Kartennummern:

- **Erfolg:** 4242 4242 4242 4242
- **3D Secure:** 4000 0025 0000 3155
- **Abgelehnt:** 4000 0000 0000 9995

Ablaufdatum: beliebiges zukünftiges Datum, CVC: beliebige 3 Ziffern

## Deployment

Das Projekt ist für Vercel optimiert:

```bash
vercel --prod
```

## Preise

| Plan | Preis | Umsatzlimit |
|------|-------|-------------|
| Starter | €0/Monat | bis 1.000€/Monat |
| Pro | €29/Monat | Unbegrenzt |
| Business | €79/Monat | Unbegrenzt + Features |

Zusätzlich: 1,4% + 0,25€ pro Transaktion

## Entwickelt von

**FELDWERK** - Digitale Betriebssysteme für KMU im Außendienst

---

© 2026 SwiftTap by FELDWERK. Alle Rechte vorbehalten.
