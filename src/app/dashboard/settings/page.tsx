"use client"

import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Building2, CreditCard, Bell } from "lucide-react"

export default function SettingsPage() {
  const { data: session } = useSession()

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-primary">Einstellungen</h1>
        <p className="text-gray-600">
          Verwalten Sie Ihr Konto und Ihre Zahlungseinstellungen
        </p>
      </div>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent-50 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-accent" />
            </div>
            <div>
              <CardTitle>Profil</CardTitle>
              <CardDescription>Ihre persönlichen Daten</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                defaultValue={session?.user?.name || ""}
                placeholder="Ihr Name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-Mail</Label>
              <Input
                id="email"
                type="email"
                defaultValue={session?.user?.email || ""}
                disabled
              />
            </div>
          </div>
          <Button>Speichern</Button>
        </CardContent>
      </Card>

      {/* Business Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent-50 rounded-full flex items-center justify-center">
              <Building2 className="w-5 h-5 text-accent" />
            </div>
            <div>
              <CardTitle>Geschäftsdaten</CardTitle>
              <CardDescription>
                Diese Informationen werden Kunden angezeigt
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="businessName">Firmenname</Label>
              <Input
                id="businessName"
                placeholder="Meine Firma GmbH"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="businessType">Branche</Label>
              <Input
                id="businessType"
                placeholder="z.B. Gastronomie, Einzelhandel"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Adresse</Label>
            <Input
              id="address"
              placeholder="Musterstraße 1, 12345 Berlin"
            />
          </div>
          <Button>Speichern</Button>
        </CardContent>
      </Card>

      {/* Payment Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent-50 rounded-full flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-accent" />
            </div>
            <div>
              <CardTitle>Zahlungseinstellungen</CardTitle>
              <CardDescription>
                Verwalten Sie Ihre Stripe-Verbindung
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Test-Modus aktiv:</strong> Zahlungen werden im Stripe Test-Modus
              verarbeitet. Keine echten Transaktionen möglich.
            </p>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-primary">Stripe-Konto</p>
              <p className="text-sm text-gray-500">Verbinden Sie Ihr Stripe-Konto für echte Zahlungen</p>
            </div>
            <Button variant="accent">
              Mit Stripe verbinden
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent-50 rounded-full flex items-center justify-center">
              <Bell className="w-5 h-5 text-accent" />
            </div>
            <div>
              <CardTitle>Benachrichtigungen</CardTitle>
              <CardDescription>
                Wählen Sie, worüber Sie informiert werden möchten
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">E-Mail bei neuer Zahlung</p>
              <p className="text-sm text-gray-500">
                Erhalten Sie eine E-Mail für jede erfolgreiche Transaktion
              </p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="w-5 h-5 accent-accent"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Tägliche Zusammenfassung</p>
              <p className="text-sm text-gray-500">
                Täglicher Bericht über Ihre Umsätze
              </p>
            </div>
            <input
              type="checkbox"
              className="w-5 h-5 accent-accent"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Wöchentlicher Report</p>
              <p className="text-sm text-gray-500">
                Detaillierte Analyse Ihrer Wochenumsätze
              </p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="w-5 h-5 accent-accent"
            />
          </div>
          <Button>Einstellungen speichern</Button>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">Gefahrenzone</CardTitle>
          <CardDescription>
            Irreversible Aktionen für Ihr Konto
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Konto löschen</p>
              <p className="text-sm text-gray-500">
                Alle Daten werden unwiderruflich gelöscht
              </p>
            </div>
            <Button variant="destructive">
              Konto löschen
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
