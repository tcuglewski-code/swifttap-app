# Zipayo Staging-Umgebung & Test-Setup

> 📋 **Ziel:** Vollständige Dokumentation für lokales Testing, Staging-Deployment und End-to-End Test-Zahlungen mit Stripe Test Mode.

---

## 📦 1. Environment Setup

### 1.1 .env.test (Stripe Test-Keys)

Erstelle eine `.env.test` Datei für lokales Testing:

```bash
# Kopiere von .env.example und fülle mit Test-Werten
cp .env.example .env.test
```

**Erforderliche Test-Variablen:**

```env
# Database (Neon Test-Branch oder lokale PostgreSQL)
DATABASE_URL="postgresql://user:password@host:5432/zipayo_test?sslmode=require"

# NextAuth
NEXTAUTH_SECRET="test-secret-min-32-chars-long-xxxxx"
NEXTAUTH_URL="http://localhost:3000"

# Stripe TEST Keys (aus Stripe Dashboard → Developers → API Keys)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_51XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
STRIPE_SECRET_KEY="sk_test_51XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
STRIPE_WEBHOOK_SECRET="whsec_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
```

> ⚠️ **WICHTIG:** Test-Keys beginnen mit `pk_test_` und `sk_test_`. Niemals Live-Keys (`pk_live_`, `sk_live_`) in Entwicklung verwenden!

### 1.2 Stripe Dashboard: Test-Keys finden

1. Gehe zu [Stripe Dashboard](https://dashboard.stripe.com)
2. Aktiviere **Test Mode** (Toggle oben rechts)
3. Navigiere zu **Developers → API Keys**
4. Kopiere:
   - **Publishable Key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - **Secret Key** → `STRIPE_SECRET_KEY`

---

## 🔗 2. Stripe Webhooks (Lokal + Staging)

### 2.1 Lokale Entwicklung: Stripe CLI

Installiere die Stripe CLI:

```bash
# macOS
brew install stripe/stripe-cli/stripe

# Windows (scoop)
scoop install stripe

# Linux
# Download von https://github.com/stripe/stripe-cli/releases
```

**Authentifiziere dich:**

```bash
stripe login
```

**Starte den Webhook-Listener:**

```bash
# Leitet Stripe-Events an deinen lokalen Server weiter
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Die CLI zeigt dir den `whsec_...` Secret an – kopiere ihn als `STRIPE_WEBHOOK_SECRET`.

**Test-Event senden:**

```bash
# Löst ein Test-Event aus
stripe trigger payment_intent.succeeded
```

### 2.2 Staging/Production: Stripe Dashboard Webhooks

1. Stripe Dashboard → **Developers → Webhooks**
2. **Add endpoint** klicken
3. URL eingeben: `https://your-staging-url.vercel.app/api/webhooks/stripe`
4. Events auswählen:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `checkout.session.completed`
   - `account.updated` (für Connect)
5. **Signing Secret** kopieren → `STRIPE_WEBHOOK_SECRET` in Vercel ENV

---

## 💳 3. End-to-End Test-Zahlungen

### 3.1 Test-Kartennummern

| Szenario | Kartennummer | Erwartetes Ergebnis |
|----------|--------------|---------------------|
| Erfolg | `4242 4242 4242 4242` | Zahlung erfolgreich |
| 3D Secure (Auth erforderlich) | `4000 0025 0000 3155` | 3D Secure Popup |
| Abgelehnt (Insufficient Funds) | `4000 0000 0000 9995` | Zahlung fehlgeschlagen |
| Abgelehnt (Card Declined) | `4000 0000 0000 0002` | Zahlung abgelehnt |
| Ablaufende Karte | `4000 0000 0000 0069` | Expired Card Error |

> **Für alle Test-Karten:**
> - Ablaufdatum: Beliebiges zukünftiges Datum (z.B. 12/34)
> - CVC: Beliebige 3 Ziffern (z.B. 123)
> - PLZ: Beliebig (z.B. 12345)

### 3.2 Test-Szenario: Kompletter Zahlungsflow

**Schritt 1: Merchant-Account erstellen**
```bash
# Falls noch nicht vorhanden, erstelle Test-Merchant
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@merchant.de","password":"test1234","businessName":"Test Café"}'
```

**Schritt 2: QR-Code generieren**
```bash
# Als eingeloggter Merchant
# Öffne http://localhost:3000/dashboard/qr-codes
# Klicke "Neuer QR-Code" → Betrag eingeben → QR wird generiert
```

**Schritt 3: Zahlung durchführen (Kundenperspektive)**
```bash
# Öffne die QR-Code URL (z.B. http://localhost:3000/pay/abc123)
# Gib Test-Kartendaten ein:
# - 4242 4242 4242 4242
# - 12/34
# - 123
# Klicke "Bezahlen"
```

**Schritt 4: Webhook verifizieren**
```bash
# In der Stripe CLI solltest du sehen:
# [200] POST localhost:3000/api/webhooks/stripe [payment_intent.succeeded]

# Im Dashboard sollte die Transaktion erscheinen
```

### 3.3 Delayed Capture Test (Autorisierung → spätere Abbuchung)

```bash
# 1. Autorisiere (capture_method=manual)
curl -X POST http://localhost:3000/api/payments/authorize \
  -H "Content-Type: application/json" \
  -d '{"amount":2500,"currency":"eur","customerId":"cust_test"}'

# 2. Später: Capture (max 7 Tage)
curl -X POST http://localhost:3000/api/payments/capture \
  -H "Content-Type: application/json" \
  -d '{"paymentIntentId":"pi_xxxxxxxx"}'
```

---

## 🚀 4. Staging-Deployment (Vercel)

### 4.1 Vercel Preview-Deployments

Jeder Push auf einen Feature-Branch erstellt automatisch eine Preview-URL:
```
https://swifttap-app-git-feature-xxx-baerenklee.vercel.app
```

### 4.2 Staging-Branch Setup

1. Erstelle `staging` Branch in GitHub
2. Vercel → Project Settings → Git → Production Branch: `main`
3. Environment Variables für Preview:
   - Setze alle Stripe **Test-Keys** für Preview/Development
   - Setze Stripe **Live-Keys** nur für Production

### 4.3 Staging ENV-Variablen in Vercel

```
DATABASE_URL         → Neon Test-Branch oder eigene Staging-DB
NEXTAUTH_SECRET      → Generierter Secret (openssl rand -base64 32)
NEXTAUTH_URL         → https://your-staging-url.vercel.app
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY → pk_test_...
STRIPE_SECRET_KEY    → sk_test_...
STRIPE_WEBHOOK_SECRET → whsec_... (von Stripe Dashboard Webhook)
```

---

## ✅ 5. Checklist für Tomek (Go-Live Vorbereitung)

### Stripe Test-Mode einrichten
- [ ] Stripe Account vorhanden (Test Mode aktiviert)
- [ ] Test API-Keys kopiert (`pk_test_`, `sk_test_`)
- [ ] `.env.test` lokal erstellt mit allen Variablen
- [ ] Stripe CLI installiert und authentifiziert
- [ ] Lokaler Webhook-Listener funktioniert (`stripe listen`)

### Lokale Test-Zahlung
- [ ] `npm run dev` läuft auf localhost:3000
- [ ] Merchant-Account erstellt (Register-Flow)
- [ ] QR-Code generiert
- [ ] Test-Zahlung mit `4242 4242 4242 4242` durchgeführt
- [ ] Transaktion erscheint im Dashboard
- [ ] Webhook-Event in Stripe CLI bestätigt (`200 POST`)

### Staging-Deployment
- [ ] Vercel-Projekt existiert (swifttap-app)
- [ ] ENV-Variablen in Vercel gesetzt (Preview + Production)
- [ ] Stripe Webhook in Dashboard konfiguriert (Staging-URL)
- [ ] Preview-Deployment getestet mit Test-Karte

### Vor Live-Schaltung
- [ ] Stripe Account verifiziert (für Live-Keys)
- [ ] Live-Keys in Vercel Production ENV
- [ ] Live-Webhook in Stripe Dashboard
- [ ] Stripe Connect Express aktiviert (für Merchant-Payouts)
- [ ] Impressum, AGB, Datenschutz Seiten live
- [ ] SSL/HTTPS verifiziert

---

## 🔧 Troubleshooting

### "No signatures found matching the expected signature"
→ `STRIPE_WEBHOOK_SECRET` stimmt nicht überein. Hole neuen Secret von `stripe listen` oder Stripe Dashboard.

### "Invalid API Key provided"
→ Prüfe ob Test-Keys (`pk_test_`, `sk_test_`) verwendet werden, nicht Live-Keys.

### Webhook-Events kommen nicht an
→ Prüfe ob `stripe listen` läuft und korrekte URL zeigt auf `/api/webhooks/stripe`

### Payment schlägt fehl ohne Fehlermeldung
→ Öffne Stripe Dashboard → Payments → Events für Details

---

## 📚 Weiterführende Links

- [Stripe Test Mode Dokumentation](https://stripe.com/docs/testing)
- [Stripe CLI](https://stripe.com/docs/stripe-cli)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)

---

*Erstellt: 2026-03-31 | Zipayo Payment Platform*
