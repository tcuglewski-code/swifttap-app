"use client"

import { useState, useEffect, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { loadStripe, PaymentRequest, Stripe } from "@stripe/stripe-js"
import { 
  Elements, 
  CardElement, 
  useStripe, 
  useElements,
  PaymentRequestButtonElement 
} from "@stripe/react-stripe-js"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Smartphone, 
  CreditCard, 
  Check, 
  Loader2, 
  Lock, 
  Shield,
  Wallet
} from "lucide-react"
import { formatCurrency } from "@/lib/utils"

const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
const stripePromise = stripeKey && !stripeKey.includes('placeholder') 
  ? loadStripe(stripeKey) 
  : null

interface PaymentFormProps {
  amount: number | null
  description: string | null
  isVariable: boolean
  merchantName: string
  merchantId: string
}

function PaymentForm({ amount, description, isVariable, merchantName, merchantId }: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [customAmount, setCustomAmount] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [paymentRequest, setPaymentRequest] = useState<PaymentRequest | null>(null)
  const [canMakePayment, setCanMakePayment] = useState<'apple_pay' | 'google_pay' | false>(false)
  const [activeTab, setActiveTab] = useState<'card' | 'wallet'>('card')
  const [paidAmount, setPaidAmount] = useState(0)

  const finalAmount = isVariable ? Math.round(parseFloat(customAmount) * 100) : amount

  // Initialize Payment Request (Apple Pay / Google Pay)
  useEffect(() => {
    if (!stripe || !finalAmount || finalAmount < 50) return

    const pr = stripe.paymentRequest({
      country: 'DE',
      currency: 'eur',
      total: {
        label: merchantName,
        amount: finalAmount,
      },
      requestPayerName: true,
      requestPayerEmail: true,
    })

    pr.canMakePayment().then(result => {
      if (result) {
        setPaymentRequest(pr)
        if (result.applePay) {
          setCanMakePayment('apple_pay')
          setActiveTab('wallet')
        } else if (result.googlePay) {
          setCanMakePayment('google_pay')
          setActiveTab('wallet')
        }
      }
    })

    pr.on('paymentmethod', async (event) => {
      setLoading(true)
      setError("")

      try {
        const res = await fetch("/api/payments/create-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: finalAmount,
            email: event.payerEmail,
            description,
            merchantId,
          }),
        })

        const { clientSecret, error: apiError } = await res.json()

        if (apiError) {
          event.complete('fail')
          setError(apiError)
          setLoading(false)
          return
        }

        const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
          clientSecret,
          { payment_method: event.paymentMethod.id },
          { handleActions: false }
        )

        if (confirmError) {
          event.complete('fail')
          setError(confirmError.message || 'Zahlung fehlgeschlagen')
        } else {
          event.complete('success')
          if (paymentIntent?.status === 'succeeded') {
            setPaidAmount(finalAmount || 0)
            setEmail(event.payerEmail || '')
            setSuccess(true)
          }
        }
      } catch (err) {
        event.complete('fail')
        setError('Ein Fehler ist aufgetreten')
      } finally {
        setLoading(false)
      }
    })

    return () => {
      pr.off('paymentmethod')
    }
  }, [stripe, finalAmount, merchantName, description, merchantId])

  // Update payment request amount when variable amount changes
  useEffect(() => {
    if (paymentRequest && finalAmount && finalAmount >= 50) {
      paymentRequest.update({
        total: {
          label: merchantName,
          amount: finalAmount,
        },
      })
    }
  }, [paymentRequest, finalAmount, merchantName])

  const handleCardSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (!stripe || !elements) {
      setError("Stripe nicht geladen")
      setLoading(false)
      return
    }

    if (!finalAmount || finalAmount < 50) {
      setError("Mindestbetrag ist 0,50 €")
      setLoading(false)
      return
    }

    try {
      const res = await fetch("/api/payments/create-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: finalAmount,
          email,
          description,
          merchantId,
        }),
      })

      const { clientSecret, error: apiError } = await res.json()

      if (apiError) {
        setError(apiError)
        setLoading(false)
        return
      }

      const cardElement = elements.getElement(CardElement)
      if (!cardElement) {
        setError("Kartenfeld nicht gefunden")
        setLoading(false)
        return
      }

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: { email },
          },
        }
      )

      if (stripeError) {
        setError(stripeError.message || "Zahlung fehlgeschlagen")
      } else if (paymentIntent?.status === "succeeded") {
        setPaidAmount(finalAmount || 0)
        setSuccess(true)
      }
    } catch (err) {
      setError("Ein Fehler ist aufgetreten")
    } finally {
      setLoading(false)
    }
  }

  // Success Screen
  if (success) {
    return (
      <div className="text-center py-8 px-4">
        {/* Animated checkmark */}
        <div className="relative w-24 h-24 mx-auto mb-6">
          <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-25" />
          <div className="relative w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
            <Check className="w-12 h-12 text-white animate-[scale-in_0.3s_ease-out]" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-[#1A2744] mb-2">
          Vielen Dank!
        </h2>
        <p className="text-gray-600 mb-6">
          Ihre Zahlung an <span className="font-semibold">{merchantName}</span> war erfolgreich.
        </p>
        
        <div className="bg-gray-50 rounded-xl p-6 mb-6">
          <p className="text-sm text-gray-500 mb-1">Bezahlter Betrag</p>
          <p className="text-4xl font-bold text-[#00C9B1] font-mono">
            {formatCurrency(paidAmount / 100)}
          </p>
        </div>
        
        {email && (
          <p className="text-sm text-gray-500">
            Eine Bestätigung wurde an <span className="font-medium">{email}</span> gesendet.
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Amount Display/Input */}
      {isVariable ? (
        <div className="space-y-2">
          <Label htmlFor="amount" className="text-sm font-medium text-gray-700">
            Betrag eingeben
          </Label>
          <div className="relative">
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.50"
              placeholder="0,00"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              required
              className="text-3xl h-16 text-center font-bold font-mono pr-12 border-2 focus:border-[#00C9B1] focus:ring-[#00C9B1]"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-400">€</span>
          </div>
        </div>
      ) : (
        <div className="text-center py-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
          <p className="text-sm text-gray-500 mb-1">Zu zahlen</p>
          <p className="text-4xl font-bold text-[#1A2744] font-mono">
            {formatCurrency((amount || 0) / 100)}
          </p>
          {description && (
            <p className="text-gray-600 mt-2 text-sm">{description}</p>
          )}
        </div>
      )}

      {/* Payment Methods */}
      {canMakePayment ? (
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'card' | 'wallet')}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="wallet" className="flex items-center gap-2">
              <Wallet className="w-4 h-4" />
              {canMakePayment === 'apple_pay' ? 'Apple Pay' : 'Google Pay'}
            </TabsTrigger>
            <TabsTrigger value="card" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Karte
            </TabsTrigger>
          </TabsList>

          <TabsContent value="wallet" className="space-y-4">
            {paymentRequest && finalAmount && finalAmount >= 50 ? (
              <>
                <p className="text-sm text-gray-500 text-center mb-4">
                  Schnell und sicher bezahlen
                </p>
                <PaymentRequestButtonElement 
                  options={{ paymentRequest }}
                  className="w-full"
                />
              </>
            ) : (
              <p className="text-center text-gray-500 py-4">
                {!finalAmount || finalAmount < 50 
                  ? 'Bitte geben Sie einen Betrag von mindestens 0,50 € ein'
                  : 'Wallet-Zahlung wird geladen...'}
              </p>
            )}
          </TabsContent>

          <TabsContent value="card">
            <CardForm
              email={email}
              setEmail={setEmail}
              loading={loading}
              error={error}
              onSubmit={handleCardSubmit}
              finalAmount={finalAmount}
              stripe={stripe}
            />
          </TabsContent>
        </Tabs>
      ) : (
        <CardForm
          email={email}
          setEmail={setEmail}
          loading={loading}
          error={error}
          onSubmit={handleCardSubmit}
          finalAmount={finalAmount}
          stripe={stripe}
        />
      )}

      {/* Error */}
      {error && activeTab === 'wallet' && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">
          {error}
        </div>
      )}

      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 flex flex-col items-center shadow-xl">
            <Loader2 className="w-12 h-12 animate-spin text-[#00C9B1] mb-4" />
            <p className="text-lg font-semibold text-[#1A2744]">Zahlung wird verarbeitet...</p>
            <p className="text-sm text-gray-500 mt-1">Bitte warten Sie einen Moment</p>
          </div>
        </div>
      )}
    </div>
  )
}

function CardForm({ 
  email, 
  setEmail, 
  loading, 
  error, 
  onSubmit, 
  finalAmount,
  stripe 
}: {
  email: string
  setEmail: (e: string) => void
  loading: boolean
  error: string
  onSubmit: (e: React.FormEvent) => void
  finalAmount: number | null
  stripe: Stripe | null
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
          E-Mail für Quittung
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="ihre@email.de"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="h-12 border-2 focus:border-[#00C9B1] focus:ring-[#00C9B1]"
        />
      </div>

      {/* Card Element */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">Kartendaten</Label>
        <div className="p-4 border-2 rounded-lg bg-white focus-within:border-[#00C9B1] transition-colors">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#1A2744",
                  fontFamily: "Inter, -apple-system, sans-serif",
                  "::placeholder": {
                    color: "#9CA3AF",
                  },
                },
                invalid: {
                  color: "#EF4444",
                },
              },
            }}
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">
          {error}
        </div>
      )}

      {/* Submit */}
      <Button
        type="submit"
        className="w-full h-14 text-lg font-semibold bg-[#00C9B1] hover:bg-[#00b8a2] text-white rounded-lg shadow-lg shadow-[#00C9B1]/25"
        disabled={loading || !stripe}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Verarbeiten...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-5 w-5" />
            {formatCurrency((finalAmount || 0) / 100)} bezahlen
          </>
        )}
      </Button>
    </form>
  )
}

export default function PaymentPage({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams()
  const amountParam = searchParams.get("amount")
  const descParam = searchParams.get("desc")
  const merchantParam = searchParams.get("merchant")

  const amount = amountParam ? parseInt(amountParam, 10) : null
  const isVariable = !amount
  const merchantName = merchantParam || "SwiftTap Händler"

  // Check if Stripe is configured
  if (!stripePromise) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-8 pb-8 text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-yellow-600" />
            </div>
            <h2 className="text-xl font-bold text-[#1A2744] mb-2">Zahlungen nicht verfügbar</h2>
            <p className="text-gray-600">
              Der Zahlungsdienst ist derzeit nicht konfiguriert. Bitte kontaktieren Sie den Händler.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0">
        {/* Header */}
        <CardHeader className="text-center border-b bg-white rounded-t-xl pt-6 pb-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 bg-[#00C9B1] rounded-lg flex items-center justify-center shadow-lg shadow-[#00C9B1]/25">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-[#1A2744]">SwiftTap</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500">
            <Lock className="w-3 h-3" />
            <span>Gesichert durch SwiftTap</span>
          </div>
        </CardHeader>

        {/* Merchant Info */}
        <div className="bg-[#1A2744] px-6 py-4 text-center">
          <p className="text-gray-300 text-sm">Zahlung an</p>
          <h1 className="text-xl font-bold text-white">{merchantName}</h1>
        </div>

        {/* Payment Form */}
        <CardContent className="pt-6 pb-6 bg-white rounded-b-xl">
          <Elements stripe={stripePromise}>
            <PaymentForm
              amount={amount}
              description={descParam}
              isVariable={isVariable}
              merchantName={merchantName}
              merchantId={params.id}
            />
          </Elements>
        </CardContent>

        {/* Trust Badges */}
        <div className="flex items-center justify-center gap-4 py-4 bg-gray-50 rounded-b-xl border-t text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <Shield className="w-3.5 h-3.5" />
            <span>SSL-verschlüsselt</span>
          </div>
          <div className="flex items-center gap-1">
            <Lock className="w-3.5 h-3.5" />
            <span>PCI-konform</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
