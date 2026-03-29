export interface ReceiptEmailData {
  merchantName: string
  amount: number // in cents
  currency: string
  transactionId: string
  customerEmail: string
  date: Date
  description?: string | null
}

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

  return `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Zahlungsbestätigung</title>
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
                    <span style="color: #ffffff; font-size: 24px; font-weight: 700;">SwiftTap</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
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
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 24px 32px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 8px; color: #6b7280; font-size: 12px;">Diese E-Mail wurde automatisch von SwiftTap generiert.</p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">© ${new Date().getFullYear()} SwiftTap. Alle Rechte vorbehalten.</p>
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

export function generateReceiptSubject(merchantName: string): string {
  return `Ihre Zahlung bei ${merchantName} war erfolgreich — SwiftTap`
}
