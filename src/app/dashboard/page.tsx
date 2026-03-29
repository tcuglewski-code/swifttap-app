"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  TrendingUp,
  Euro,
  CreditCard,
  QrCode,
  Smartphone,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils"

// Mock data for demonstration
const mockStats = {
  today: 1250.0,
  week: 8420.5,
  month: 34567.89,
  transactions: 142,
}

const mockTransactions = [
  {
    id: "1",
    amount: 45.0,
    status: "succeeded",
    customerEmail: "kunde1@example.com",
    createdAt: new Date(Date.now() - 1000 * 60 * 5),
  },
  {
    id: "2",
    amount: 128.5,
    status: "succeeded",
    customerEmail: "kunde2@example.com",
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: "3",
    amount: 23.0,
    status: "succeeded",
    customerEmail: "kunde3@example.com",
    createdAt: new Date(Date.now() - 1000 * 60 * 60),
  },
  {
    id: "4",
    amount: 89.99,
    status: "failed",
    customerEmail: "kunde4@example.com",
    createdAt: new Date(Date.now() - 1000 * 60 * 90),
  },
  {
    id: "5",
    amount: 156.0,
    status: "succeeded",
    customerEmail: "kunde5@example.com",
    createdAt: new Date(Date.now() - 1000 * 60 * 120),
  },
]

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">Dashboard</h1>
          <p className="text-gray-600">Willkommen zurück! Hier ist Ihre Übersicht.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/qr">
            <Button variant="outline">
              <QrCode className="w-4 h-4 mr-2" />
              QR Code erstellen
            </Button>
          </Link>
          <Button variant="accent">
            <Smartphone className="w-4 h-4 mr-2" />
            Tap to Pay
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Heute
            </CardTitle>
            <Euro className="w-4 h-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(mockStats.today)}
            </div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              +12% gegenüber gestern
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Diese Woche
            </CardTitle>
            <TrendingUp className="w-4 h-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(mockStats.week)}
            </div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              +8% gegenüber letzter Woche
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Dieser Monat
            </CardTitle>
            <Euro className="w-4 h-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(mockStats.month)}
            </div>
            <p className="text-xs text-red-600 flex items-center mt-1">
              <ArrowDownRight className="w-3 h-3 mr-1" />
              -3% gegenüber letztem Monat
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Transaktionen
            </CardTitle>
            <CreditCard className="w-4 h-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {mockStats.transactions}
            </div>
            <p className="text-xs text-gray-500 mt-1">Diesen Monat</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Letzte Transaktionen</CardTitle>
          <CardDescription>
            Die letzten 5 Zahlungen auf Ihrem Konto
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.status === "succeeded"
                        ? "bg-green-100"
                        : "bg-red-100"
                    }`}
                  >
                    <CreditCard
                      className={`w-5 h-5 ${
                        transaction.status === "succeeded"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    />
                  </div>
                  <div>
                    <p className="font-medium text-primary">
                      {transaction.customerEmail}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(transaction.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`font-semibold ${
                      transaction.status === "succeeded"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {transaction.status === "succeeded" ? "+" : "-"}
                    {formatCurrency(transaction.amount)}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {transaction.status === "succeeded"
                      ? "Erfolgreich"
                      : "Fehlgeschlagen"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-2 border-dashed hover:border-accent transition-colors cursor-pointer">
          <Link href="/dashboard/qr">
            <CardContent className="flex flex-col items-center justify-center py-8">
              <div className="w-16 h-16 bg-accent-50 rounded-full flex items-center justify-center mb-4">
                <QrCode className="w-8 h-8 text-accent" />
              </div>
              <h3 className="font-semibold text-lg text-primary">
                QR Code generieren
              </h3>
              <p className="text-gray-500 text-center mt-2">
                Erstellen Sie einen QR-Code für eine schnelle Zahlung
              </p>
            </CardContent>
          </Link>
        </Card>

        <Card className="border-2 border-dashed hover:border-accent transition-colors cursor-pointer">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <div className="w-16 h-16 bg-accent-50 rounded-full flex items-center justify-center mb-4">
              <Smartphone className="w-8 h-8 text-accent" />
            </div>
            <h3 className="font-semibold text-lg text-primary">Tap to Pay</h3>
            <p className="text-gray-500 text-center mt-2">
              Nutzen Sie Ihr Smartphone als Zahlungsterminal
            </p>
            <span className="mt-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
              Bald verfügbar
            </span>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
