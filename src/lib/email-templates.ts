// ============================================================================
// Zipayo Email Templates
// Branding: Primary #1A2744, Accent #00C9B1
// ============================================================================

export interface ReceiptEmailData {
  merchantName: string
  amount: number // in cents
  currency: string
  transactionId: string
  customerEmail: string
  date: Date
  description?: string | null
}

export interface WelcomeEmailData {
  merchantName: string
  email: string
}

export interface StripeConnectReminderData {
  merchantName: string
  email: string
  connectUrl: string
}

export interface DailyDigestData {
  merchantName: string
  email: string
  yesterdayRevenue: number // in cents
  currency: string
  topQRCode?: { name: string; amount: number }
  transactionCount: number
}

export interface PasswordResetData {
  email: string
  resetUrl: string
  expiresIn: string
}

export interface TeamInvitationData {
  inviterName: string
  merchantName: string
  inviteeEmail: string
  inviteUrl: string
  role: string
}

// ============================================================================
// Base Layout
// ============================================================================

function emailWrapper(content: string): string {
  return `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Zipayo</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;">
  <table cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <tr>
      <td>
        <table cellpadding="0" cellspacing="0" width="100%" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background-color: #1A2744; padding: 32px; text-align: center;">
              <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                <tr>
                  <td style="background-color: #00C9B1; width: 48px; height: 48px; border-radius: 12px; text-align: center; vertical-align: middle;">
                    <span style="color: #ffffff; font-size: 24px;">⚡</span>
                  </td>
                  <td style="padding-left: 12px;">
                    <span style="color: #ffffff; font-size: 24px; font-weight: 700;">Zipayo</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Content -->
          ${content}
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 24px 32px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 8px; color: #6b7280; font-size: 12px;">Diese E-Mail wurde automatisch von Zipayo generiert.</p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">© ${new Date().getFullYear()} Zipayo. Alle Rechte vorbehalten.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`
}

function primaryButton(text: string, url: string): string {
  return `
    <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
      <tr>
        <td style="background-color: #00C9B1; border-radius: 8px;">
          <a href="${url}" style="display: inline-block; padding: 14px 32px; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 16px;">${text}</a>
        </td>
      </tr>
    </table>
  `
}

// ============================================================================
// Receipt Email
// ============================================================================

export function generateReceiptHtml(data: ReceiptEmailData): string {
  const formattedAmount = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: data.currency.toUpperCase(),
  }).format(data.amount / 100)

  const formattedDate = data.date.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  const content = `
    <!-- Success Icon -->
    <tr>
      <td style="padding: 40px 32px 20px; text-align: center;">
        <div style="width: 80px; height: 80px; background-color: #dcfce7; border-radius: 50%; margin: 0 auto; line-height: 80px;">
          <span style="color: #16a34a; font-size: 40px;">✓</span>
        </div>
      </td>
    </tr>
    
    <!-- Title -->
    <tr>
      <td style="padding: 0 32px 8px; text-align: center;">
        <h1 style="margin: 0; color: #1A2744; font-size: 24px; font-weight: 700;">Zahlung erfolgreich!</h1>
      </td>
    </tr>
    
    <!-- Subtitle -->
    <tr>
      <td style="padding: 0 32px 32px; text-align: center;">
        <p style="margin: 0; color: #6b7280; font-size: 16px;">Ihre Zahlung an ${data.merchantName} wurde erfolgreich verarbeitet.</p>
      </td>
    </tr>
    
    <!-- Amount Box -->
    <tr>
      <td style="padding: 0 32px 32px;">
        <table cellpadding="0" cellspacing="0" width="100%" style="background-color: #f9fafb; border-radius: 12px; padding: 24px;">
          <tr>
            <td style="padding: 24px; text-align: center;">
              <p style="margin: 0 0 8px; color: #6b7280; font-size: 14px;">Betrag</p>
              <p style="margin: 0; color: #00C9B1; font-size: 36px; font-weight: 700; font-family: 'SF Mono', Monaco, monospace;">${formattedAmount}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    
    <!-- Details -->
    <tr>
      <td style="padding: 0 32px 32px;">
        <table cellpadding="0" cellspacing="0" width="100%" style="border-top: 1px solid #e5e7eb;">
          <tr>
            <td style="padding: 16px 0; border-bottom: 1px solid #e5e7eb;">
              <p style="margin: 0; color: #6b7280; font-size: 14px;">Händler</p>
              <p style="margin: 4px 0 0; color: #1A2744; font-size: 16px; font-weight: 500;">${data.merchantName}</p>
            </td>
          </tr>
          ${data.description ? `
          <tr>
            <td style="padding: 16px 0; border-bottom: 1px solid #e5e7eb;">
              <p style="margin: 0; color: #6b7280; font-size: 14px;">Beschreibung</p>
              <p style="margin: 4px 0 0; color: #1A2744; font-size: 16px; font-weight: 500;">${data.description}</p>
            </td>
          </tr>
          ` : ''}
          <tr>
            <td style="padding: 16px 0; border-bottom: 1px solid #e5e7eb;">
              <p style="margin: 0; color: #6b7280; font-size: 14px;">Datum</p>
              <p style="margin: 4px 0 0; color: #1A2744; font-size: 16px; font-weight: 500;">${formattedDate}</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 16px 0;">
              <p style="margin: 0; color: #6b7280; font-size: 14px;">Transaktions-ID</p>
              <p style="margin: 4px 0 0; color: #1A2744; font-size: 14px; font-family: 'SF Mono', Monaco, monospace;">${data.transactionId}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `
  return emailWrapper(content)
}

export function generateReceiptSubject(merchantName: string): string {
  return `Ihre Zahlung bei ${merchantName} war erfolgreich — Zipayo`
}

// ============================================================================
// Welcome Email
// ============================================================================

export function generateWelcomeHtml(data: WelcomeEmailData): string {
  const content = `
    <!-- Welcome Icon -->
    <tr>
      <td style="padding: 40px 32px 20px; text-align: center;">
        <div style="width: 80px; height: 80px; background-color: #e0f7f4; border-radius: 50%; margin: 0 auto; line-height: 80px;">
          <span style="color: #00C9B1; font-size: 40px;">🎉</span>
        </div>
      </td>
    </tr>
    
    <!-- Title -->
    <tr>
      <td style="padding: 0 32px 8px; text-align: center;">
        <h1 style="margin: 0; color: #1A2744; font-size: 24px; font-weight: 700;">Willkommen bei Zipayo!</h1>
      </td>
    </tr>
    
    <!-- Greeting -->
    <tr>
      <td style="padding: 0 32px 32px; text-align: center;">
        <p style="margin: 0; color: #6b7280; font-size: 16px;">Hallo ${data.merchantName}, schön, dass Sie dabei sind!</p>
      </td>
    </tr>
    
    <!-- Steps -->
    <tr>
      <td style="padding: 0 32px 32px;">
        <h2 style="margin: 0 0 16px; color: #1A2744; font-size: 18px; font-weight: 600;">Ihre ersten Schritte:</h2>
        <table cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td style="padding: 16px; background-color: #f9fafb; border-radius: 12px; margin-bottom: 12px;">
              <table cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="width: 40px; vertical-align: top;">
                    <div style="width: 32px; height: 32px; background-color: #00C9B1; border-radius: 50%; text-align: center; line-height: 32px; color: #ffffff; font-weight: 700;">1</div>
                  </td>
                  <td style="vertical-align: top;">
                    <p style="margin: 0 0 4px; color: #1A2744; font-weight: 600;">Stripe-Konto verbinden</p>
                    <p style="margin: 0; color: #6b7280; font-size: 14px;">Verbinden Sie Ihr Stripe-Konto, um Zahlungen zu empfangen.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr><td style="height: 12px;"></td></tr>
          <tr>
            <td style="padding: 16px; background-color: #f9fafb; border-radius: 12px;">
              <table cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="width: 40px; vertical-align: top;">
                    <div style="width: 32px; height: 32px; background-color: #00C9B1; border-radius: 50%; text-align: center; line-height: 32px; color: #ffffff; font-weight: 700;">2</div>
                  </td>
                  <td style="vertical-align: top;">
                    <p style="margin: 0 0 4px; color: #1A2744; font-weight: 600;">Ersten QR-Code erstellen</p>
                    <p style="margin: 0; color: #6b7280; font-size: 14px;">Erstellen Sie Ihren ersten Zahlungs-QR-Code im Dashboard.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr><td style="height: 12px;"></td></tr>
          <tr>
            <td style="padding: 16px; background-color: #f9fafb; border-radius: 12px;">
              <table cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="width: 40px; vertical-align: top;">
                    <div style="width: 32px; height: 32px; background-color: #00C9B1; border-radius: 50%; text-align: center; line-height: 32px; color: #ffffff; font-weight: 700;">3</div>
                  </td>
                  <td style="vertical-align: top;">
                    <p style="margin: 0 0 4px; color: #1A2744; font-weight: 600;">Erste Zahlung empfangen</p>
                    <p style="margin: 0; color: #6b7280; font-size: 14px;">Lassen Sie Kunden den QR-Code scannen und bezahlen.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    
    <!-- CTA Button -->
    <tr>
      <td style="padding: 0 32px 32px; text-align: center;">
        ${primaryButton('Zum Dashboard', 'https://swifttap-app.vercel.app/dashboard')}
      </td>
    </tr>
    
    <!-- Help Text -->
    <tr>
      <td style="padding: 0 32px 32px; text-align: center;">
        <p style="margin: 0; color: #6b7280; font-size: 14px;">
          Fragen? Antworten Sie einfach auf diese E-Mail oder schreiben Sie uns an 
          <a href="mailto:support@zipayo.de" style="color: #00C9B1;">support@zipayo.de</a>
        </p>
      </td>
    </tr>
  `
  return emailWrapper(content)
}

export function generateWelcomeSubject(): string {
  return 'Willkommen bei Zipayo! 🎉 Ihre ersten Schritte'
}

// ============================================================================
// Stripe Connect Reminder Email
// ============================================================================

export function generateStripeConnectReminderHtml(data: StripeConnectReminderData): string {
  const content = `
    <!-- Reminder Icon -->
    <tr>
      <td style="padding: 40px 32px 20px; text-align: center;">
        <div style="width: 80px; height: 80px; background-color: #fef3c7; border-radius: 50%; margin: 0 auto; line-height: 80px;">
          <span style="font-size: 40px;">🔗</span>
        </div>
      </td>
    </tr>
    
    <!-- Title -->
    <tr>
      <td style="padding: 0 32px 8px; text-align: center;">
        <h1 style="margin: 0; color: #1A2744; font-size: 24px; font-weight: 700;">Stripe-Konto verbinden</h1>
      </td>
    </tr>
    
    <!-- Message -->
    <tr>
      <td style="padding: 0 32px 32px; text-align: center;">
        <p style="margin: 0; color: #6b7280; font-size: 16px;">
          Hallo ${data.merchantName},<br><br>
          um Zahlungen über Zipayo zu empfangen, müssen Sie Ihr Stripe-Konto verbinden. 
          Dies dauert nur wenige Minuten.
        </p>
      </td>
    </tr>
    
    <!-- Benefits -->
    <tr>
      <td style="padding: 0 32px 32px;">
        <table cellpadding="0" cellspacing="0" width="100%" style="background-color: #f9fafb; border-radius: 12px; padding: 24px;">
          <tr>
            <td style="padding: 20px;">
              <p style="margin: 0 0 12px; color: #1A2744; font-weight: 600;">Mit Stripe erhalten Sie:</p>
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 6px 0; color: #6b7280; font-size: 14px;">✓ Sichere Zahlungsabwicklung (PCI-konform)</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #6b7280; font-size: 14px;">✓ Auszahlung in 2-7 Werktagen</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #6b7280; font-size: 14px;">✓ Transparente Transaktionsübersicht</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #6b7280; font-size: 14px;">✓ Automatische Steuerdokumentation</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    
    <!-- CTA Button -->
    <tr>
      <td style="padding: 0 32px 32px; text-align: center;">
        ${primaryButton('Jetzt Stripe verbinden', data.connectUrl)}
      </td>
    </tr>
  `
  return emailWrapper(content)
}

export function generateStripeConnectReminderSubject(): string {
  return 'Noch ein Schritt: Verbinden Sie Ihr Stripe-Konto — Zipayo'
}

// ============================================================================
// Daily Digest Email
// ============================================================================

export function generateDailyDigestHtml(data: DailyDigestData): string {
  const formattedRevenue = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: data.currency.toUpperCase(),
  }).format(data.yesterdayRevenue / 100)

  const tips = [
    'Tipp: Platzieren Sie Ihren QR-Code an gut sichtbarer Stelle für mehr Zahlungen.',
    'Tipp: Nutzen Sie die API, um Zipayo in Ihre bestehende Software zu integrieren.',
    'Tipp: Laden Sie Teammitglieder ein, um den Überblick über Transaktionen zu behalten.',
    'Tipp: Pro-Kunden können ihr eigenes Branding auf Zahlungsseiten nutzen.',
    'Tipp: Aktivieren Sie E-Mail-Benachrichtigungen für jede Zahlung in den Einstellungen.',
  ]
  const randomTip = tips[Math.floor(Math.random() * tips.length)]

  const content = `
    <!-- Daily Digest Icon -->
    <tr>
      <td style="padding: 40px 32px 20px; text-align: center;">
        <div style="width: 80px; height: 80px; background-color: #e0f7f4; border-radius: 50%; margin: 0 auto; line-height: 80px;">
          <span style="font-size: 40px;">📊</span>
        </div>
      </td>
    </tr>
    
    <!-- Title -->
    <tr>
      <td style="padding: 0 32px 8px; text-align: center;">
        <h1 style="margin: 0; color: #1A2744; font-size: 24px; font-weight: 700;">Ihr Tagesbericht</h1>
      </td>
    </tr>
    
    <!-- Date -->
    <tr>
      <td style="padding: 0 32px 32px; text-align: center;">
        <p style="margin: 0; color: #6b7280; font-size: 14px;">
          ${new Date(Date.now() - 86400000).toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </td>
    </tr>
    
    <!-- Revenue Box -->
    <tr>
      <td style="padding: 0 32px 24px;">
        <table cellpadding="0" cellspacing="0" width="100%" style="background-color: #f9fafb; border-radius: 12px;">
          <tr>
            <td style="padding: 24px; text-align: center;">
              <p style="margin: 0 0 8px; color: #6b7280; font-size: 14px;">Umsatz gestern</p>
              <p style="margin: 0; color: #00C9B1; font-size: 36px; font-weight: 700;">${formattedRevenue}</p>
              <p style="margin: 8px 0 0; color: #6b7280; font-size: 14px;">${data.transactionCount} Transaktionen</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    
    ${data.topQRCode ? `
    <!-- Top QR Code -->
    <tr>
      <td style="padding: 0 32px 24px;">
        <table cellpadding="0" cellspacing="0" width="100%" style="border: 1px solid #e5e7eb; border-radius: 12px;">
          <tr>
            <td style="padding: 20px;">
              <p style="margin: 0 0 8px; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Top QR-Code</p>
              <p style="margin: 0; color: #1A2744; font-size: 16px; font-weight: 600;">${data.topQRCode.name}</p>
              <p style="margin: 4px 0 0; color: #00C9B1; font-size: 14px; font-weight: 500;">
                ${new Intl.NumberFormat('de-DE', { style: 'currency', currency: data.currency.toUpperCase() }).format(data.topQRCode.amount / 100)}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    ` : ''}
    
    <!-- Tip of the Day -->
    <tr>
      <td style="padding: 0 32px 32px;">
        <table cellpadding="0" cellspacing="0" width="100%" style="background-color: #eff6ff; border-radius: 12px; border-left: 4px solid #00C9B1;">
          <tr>
            <td style="padding: 16px 20px;">
              <p style="margin: 0; color: #1A2744; font-size: 14px;">💡 ${randomTip}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    
    <!-- CTA Button -->
    <tr>
      <td style="padding: 0 32px 32px; text-align: center;">
        ${primaryButton('Dashboard öffnen', 'https://swifttap-app.vercel.app/dashboard')}
      </td>
    </tr>
  `
  return emailWrapper(content)
}

export function generateDailyDigestSubject(revenue: number, currency: string): string {
  const formatted = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(revenue / 100)
  return `📊 Ihr Tagesbericht: ${formatted} Umsatz — Zipayo`
}

// ============================================================================
// Password Reset Email
// ============================================================================

export function generatePasswordResetHtml(data: PasswordResetData): string {
  const content = `
    <!-- Reset Icon -->
    <tr>
      <td style="padding: 40px 32px 20px; text-align: center;">
        <div style="width: 80px; height: 80px; background-color: #fef3c7; border-radius: 50%; margin: 0 auto; line-height: 80px;">
          <span style="font-size: 40px;">🔐</span>
        </div>
      </td>
    </tr>
    
    <!-- Title -->
    <tr>
      <td style="padding: 0 32px 8px; text-align: center;">
        <h1 style="margin: 0; color: #1A2744; font-size: 24px; font-weight: 700;">Passwort zurücksetzen</h1>
      </td>
    </tr>
    
    <!-- Message -->
    <tr>
      <td style="padding: 0 32px 32px; text-align: center;">
        <p style="margin: 0; color: #6b7280; font-size: 16px;">
          Sie haben angefordert, Ihr Passwort für Ihr Zipayo-Konto zurückzusetzen. 
          Klicken Sie auf den Button unten, um ein neues Passwort zu erstellen.
        </p>
      </td>
    </tr>
    
    <!-- CTA Button -->
    <tr>
      <td style="padding: 0 32px 32px; text-align: center;">
        ${primaryButton('Passwort zurücksetzen', data.resetUrl)}
      </td>
    </tr>
    
    <!-- Expiry Notice -->
    <tr>
      <td style="padding: 0 32px 24px;">
        <table cellpadding="0" cellspacing="0" width="100%" style="background-color: #fef3c7; border-radius: 12px;">
          <tr>
            <td style="padding: 16px 20px; text-align: center;">
              <p style="margin: 0; color: #92400e; font-size: 14px;">
                ⏱️ Dieser Link ist ${data.expiresIn} gültig.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    
    <!-- Security Notice -->
    <tr>
      <td style="padding: 0 32px 32px; text-align: center;">
        <p style="margin: 0; color: #6b7280; font-size: 14px;">
          Falls Sie diese Anfrage nicht gestellt haben, können Sie diese E-Mail ignorieren. 
          Ihr Passwort wird nicht geändert.
        </p>
      </td>
    </tr>
  `
  return emailWrapper(content)
}

export function generatePasswordResetSubject(): string {
  return 'Passwort zurücksetzen — Zipayo'
}

// ============================================================================
// Team Invitation Email
// ============================================================================

export function generateTeamInvitationHtml(data: TeamInvitationData): string {
  const content = `
    <!-- Invitation Icon -->
    <tr>
      <td style="padding: 40px 32px 20px; text-align: center;">
        <div style="width: 80px; height: 80px; background-color: #e0f7f4; border-radius: 50%; margin: 0 auto; line-height: 80px;">
          <span style="font-size: 40px;">👋</span>
        </div>
      </td>
    </tr>
    
    <!-- Title -->
    <tr>
      <td style="padding: 0 32px 8px; text-align: center;">
        <h1 style="margin: 0; color: #1A2744; font-size: 24px; font-weight: 700;">Einladung zu Zipayo</h1>
      </td>
    </tr>
    
    <!-- Message -->
    <tr>
      <td style="padding: 0 32px 32px; text-align: center;">
        <p style="margin: 0; color: #6b7280; font-size: 16px;">
          <strong style="color: #1A2744;">${data.inviterName}</strong> lädt Sie ein, dem Team von 
          <strong style="color: #1A2744;">${data.merchantName}</strong> auf Zipayo beizutreten.
        </p>
      </td>
    </tr>
    
    <!-- Role Info -->
    <tr>
      <td style="padding: 0 32px 32px;">
        <table cellpadding="0" cellspacing="0" width="100%" style="background-color: #f9fafb; border-radius: 12px;">
          <tr>
            <td style="padding: 20px; text-align: center;">
              <p style="margin: 0 0 8px; color: #6b7280; font-size: 14px;">Ihre Rolle</p>
              <p style="margin: 0; color: #1A2744; font-size: 18px; font-weight: 600;">${data.role}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    
    <!-- What you can do -->
    <tr>
      <td style="padding: 0 32px 32px;">
        <p style="margin: 0 0 12px; color: #1A2744; font-weight: 600;">Als Teammitglied können Sie:</p>
        <table cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding: 6px 0; color: #6b7280; font-size: 14px;">✓ Transaktionen einsehen und verwalten</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #6b7280; font-size: 14px;">✓ QR-Codes erstellen und bearbeiten</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #6b7280; font-size: 14px;">✓ Reports und Analysen abrufen</td>
          </tr>
        </table>
      </td>
    </tr>
    
    <!-- CTA Button -->
    <tr>
      <td style="padding: 0 32px 32px; text-align: center;">
        ${primaryButton('Einladung annehmen', data.inviteUrl)}
      </td>
    </tr>
    
    <!-- Notice -->
    <tr>
      <td style="padding: 0 32px 32px; text-align: center;">
        <p style="margin: 0; color: #6b7280; font-size: 14px;">
          Diese Einladung ist 7 Tage gültig.
        </p>
      </td>
    </tr>
  `
  return emailWrapper(content)
}

export function generateTeamInvitationSubject(inviterName: string, merchantName: string): string {
  return `${inviterName} lädt Sie ein zu ${merchantName} auf Zipayo`
}
