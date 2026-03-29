"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Smartphone, CreditCard, Check, Loader2, Lock } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

function PaymentForm({
  amount,
  description,
  isVariable,
  merchantName,
}: {
  amount: number | null
  description: string | null
  isVariable: boolean
  merchantName: string
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [customAmount, setCustomAmount] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const finalAmount = isVariable ? parseFloat(customAmount) * 100 : amount

  const handleSubmit = async (e: React.FormEvent) => {
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
      // Create payment intent on backend
      const res = await fetch("/api/payments/create-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: finalAmount,
          email,
          description,
        }),
      })

      const { clientSecret, error: apiError } = await res.json()

      if (apiError) {
        setError(apiError)
        setLoading(false)
        return
      }

      // Confirm payment with Stripe
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
        setSuccess(true)
      }
    } catch (err) {
      setError("Ein Fehler ist aufgetreten")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-primary mb-2">
          Zahlung erfolgreich!
        </h2>
        <p className="text-gray-600 mb-4">
          Vielen Dank für Ihre Zahlung an {merchantName}
        </p>
        <p className="text-3xl font-bold text-accent">
          {formatCurrency((finalAmount || 0) / 100)}
        </p>
        <p className="mt-6 text-sm text-gray-500">
          Eine Bestätigung wurde an {email} gesendet.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Amount Display or Input */}
      {isVariable ? (
        <div className="space-y-2">
          <Label htmlFor="amount">Betrag eingeben (€)</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            min="0.50"
            placeholder="z.B. 10.00"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            required
            className="text-2xl h-14 text-center font-bold"
          />
        </div>
      ) : (
        <div className="text-center py-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">Zu zahlen</p>
          <p className="text-4xl font-bold text-primary">
            {formatCurrency((amount || 0) / 100)}
          </p>
          {description && (
            <p className="text-gray-600 mt-2">{description}</p>
          )}
        </div>
      )}

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email">E-Mail für Quittung</Label>
        <Input
          id="email"
          type="email"
          placeholder="ihre@email.de"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      {/* Card Element */}
      <div className="space-y-2">
        <Label>Kartendaten</Label>
        <div className="p-4 border rounded-md bg-white">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#1A2744",
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
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      {/* Submit */}
      <Button
        type="submit"
        variant="accent"
        className="w-full h-12 text-lg"
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

      {/* Security Note */}
      <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
        <Lock className="w-3 h-3" />
        <span>Sichere Zahlung powered by Stripe</span>
      </div>
    </form>
  )
}

export default function PaymentPage({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams()
  const amountParam = searchParams.get("amount")
  const descParam = searchParams.get("desc")

  const amount = amountParam ? parseInt(amountParam, 10) : null
  const isVariable = !amount

  // In production, fetch merchant info from DB using params.id
  const merchantName = "SwiftTap Demo Shop"

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center border-b">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-primary">SwiftTap</span>
          </div>
          <CardTitle className="text-xl">{merchantName}</CardTitle>
          <CardDescription>
            Sichere Zahlung mit Kreditkarte
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Elements stripe={stripePromise}>
            <PaymentForm
              amount={amount}
              description={descParam}
              isVariable={isVariable}
              merchantName={merchantName}
            />
          </Elements>
        </CardContent>
      </Card>
    </div>
  )
}
