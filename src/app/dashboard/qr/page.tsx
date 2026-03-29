"use client"

import { useState, useRef, useEffect } from "react"
import { useSession } from "next-auth/react"
import QRCode from "qrcode"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Download, Copy, Check, QrCode as QrIcon, RefreshCw } from "lucide-react"

export default function QRGeneratorPage() {
  const { data: session } = useSession()
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [isVariable, setIsVariable] = useState(false)
  const [qrDataUrl, setQrDataUrl] = useState("")
  const [paymentUrl, setPaymentUrl] = useState("")
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const generateQR = async () => {
    setLoading(true)
    
    // Create a unique payment link ID (in production, this would be saved to DB)
    const linkId = Math.random().toString(36).substring(2, 15)
    
    // Build the payment URL
    const baseUrl = typeof window !== "undefined" ? window.location.origin : ""
    let url = `${baseUrl}/pay/${linkId}`
    
    if (!isVariable && amount) {
      url += `?amount=${parseFloat(amount) * 100}` // Convert to cents
    }
    if (description) {
      url += `${!isVariable && amount ? "&" : "?"}desc=${encodeURIComponent(description)}`
    }
    
    setPaymentUrl(url)
    
    // Generate QR code
    try {
      const dataUrl = await QRCode.toDataURL(url, {
        width: 300,
        margin: 2,
        color: {
          dark: "#1A2744",
          light: "#FFFFFF",
        },
      })
      setQrDataUrl(dataUrl)
    } catch (err) {
      console.error("QR generation failed:", err)
    }
    
    setLoading(false)
  }

  const downloadQR = () => {
    if (!qrDataUrl) return
    
    const link = document.createElement("a")
    link.download = `swifttap-qr-${Date.now()}.png`
    link.href = qrDataUrl
    link.click()
  }

  const copyLink = async () => {
    if (!paymentUrl) return
    
    await navigator.clipboard.writeText(paymentUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-primary">QR Code Generator</h1>
        <p className="text-gray-600">
          Erstellen Sie QR-Codes für schnelle und einfache Zahlungen
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Zahlungsdetails</CardTitle>
            <CardDescription>
              Konfigurieren Sie Ihren QR-Code für Zahlungen
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Amount Type Toggle */}
            <div className="flex gap-2">
              <Button
                variant={!isVariable ? "default" : "outline"}
                className="flex-1"
                onClick={() => setIsVariable(false)}
              >
                Fixer Betrag
              </Button>
              <Button
                variant={isVariable ? "default" : "outline"}
                className="flex-1"
                onClick={() => setIsVariable(true)}
              >
                Variabler Betrag
              </Button>
            </div>

            {/* Amount Input */}
            {!isVariable && (
              <div className="space-y-2">
                <Label htmlFor="amount">Betrag (€)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0.50"
                  placeholder="z.B. 25.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            )}

            {isVariable && (
              <div className="bg-accent-50 p-4 rounded-lg text-sm text-accent-700">
                <p>
                  Bei variablem Betrag kann der Kunde selbst den Betrag eingeben
                  (z.B. für Trinkgeld oder individuelle Preise).
                </p>
              </div>
            )}

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Beschreibung (optional)</Label>
              <Input
                id="description"
                type="text"
                placeholder="z.B. Kaffee & Kuchen"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Generate Button */}
            <Button
              variant="accent"
              className="w-full"
              onClick={generateQR}
              disabled={loading || (!isVariable && !amount)}
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Generieren...
                </>
              ) : (
                <>
                  <QrIcon className="w-4 h-4 mr-2" />
                  QR Code generieren
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* QR Code Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Vorschau</CardTitle>
            <CardDescription>
              Ihr generierter QR-Code für Zahlungen
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            {qrDataUrl ? (
              <>
                <div className="bg-white p-4 rounded-lg shadow-inner border">
                  <img src={qrDataUrl} alt="Payment QR Code" className="w-64 h-64" />
                </div>
                
                <div className="mt-6 text-center">
                  {!isVariable && amount && (
                    <p className="text-2xl font-bold text-primary mb-2">
                      {parseFloat(amount).toFixed(2)} €
                    </p>
                  )}
                  {description && (
                    <p className="text-gray-600">{description}</p>
                  )}
                  {isVariable && (
                    <p className="text-accent font-medium">Variabler Betrag</p>
                  )}
                </div>

                <div className="flex gap-3 mt-6 w-full">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={downloadQR}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download PNG
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={copyLink}
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Kopiert!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Link kopieren
                      </>
                    )}
                  </Button>
                </div>

                {paymentUrl && (
                  <div className="mt-4 w-full">
                    <Label className="text-xs text-gray-500">Zahlungslink:</Label>
                    <p className="text-xs bg-gray-100 p-2 rounded break-all mt-1">
                      {paymentUrl}
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="w-64 h-64 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-gray-400">
                <QrIcon className="w-16 h-16 mb-4" />
                <p className="text-center">
                  Konfigurieren Sie links die Details und klicken Sie auf
                  &quot;QR Code generieren&quot;
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tips */}
      <Card className="bg-primary-50 border-none">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-primary mb-3">💡 Tipps</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>
              • <strong>Fixer Betrag:</strong> Ideal für Menükarten, Preisschilder oder wiederkehrende Beträge
            </li>
            <li>
              • <strong>Variabler Betrag:</strong> Perfekt für Trinkgeld, Spenden oder individuelle Dienstleistungen
            </li>
            <li>
              • Drucken Sie den QR-Code auf Aufsteller, Rechnungen oder Visitenkarten
            </li>
            <li>
              • Kunden können mit jedem Smartphone scannen und sofort bezahlen
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
