'use client'

import { useEffect } from "react"
import Link from "next/link"
import { Smartphone, Home, RefreshCw, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to error reporting service
    console.error('Zipayo Error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center">
            <Smartphone className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-primary">Zipayo</span>
        </div>

        {/* Error Icon */}
        <div className="mb-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-primary mb-2">
            Etwas ist schiefgelaufen
          </h1>
          <p className="text-gray-600 mb-2">
            Es ist ein unerwarteter Fehler aufgetreten. Wir arbeiten daran, das Problem zu beheben.
          </p>
          {error.digest && (
            <p className="text-xs text-gray-400 font-mono">
              Fehler-ID: {error.digest}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            variant="accent" 
            className="gap-2"
            onClick={reset}
          >
            <RefreshCw className="w-4 h-4" />
            Erneut versuchen
          </Button>
          <Link href="/">
            <Button variant="outline" className="gap-2">
              <Home className="w-4 h-4" />
              Zur Startseite
            </Button>
          </Link>
        </div>

        {/* Help */}
        <p className="mt-8 text-sm text-gray-500">
          Problem besteht weiterhin?{" "}
          <a href="mailto:support@zipayo.de" className="text-accent hover:underline">
            Kontaktieren Sie unseren Support
          </a>
        </p>
      </div>
    </div>
  )
}
