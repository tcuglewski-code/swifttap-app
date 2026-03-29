"use client"

import Link from "next/link"
import { Smartphone, Home, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
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

        {/* 404 */}
        <div className="mb-8">
          <h1 className="text-8xl font-bold text-primary/20 mb-2">404</h1>
          <h2 className="text-2xl font-bold text-primary mb-4">
            Seite nicht gefunden
          </h2>
          <p className="text-gray-600">
            Die Seite, die Sie suchen, existiert nicht oder wurde verschoben.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button variant="accent" className="gap-2">
              <Home className="w-4 h-4" />
              Zur Startseite
            </Button>
          </Link>
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => typeof window !== 'undefined' && window.history.back()}
          >
            <ArrowLeft className="w-4 h-4" />
            Zurück
          </Button>
        </div>

        {/* Help */}
        <p className="mt-8 text-sm text-gray-500">
          Brauchen Sie Hilfe?{" "}
          <a href="mailto:support@zipayo.de" className="text-accent hover:underline">
            Kontaktieren Sie uns
          </a>
        </p>
      </div>
    </div>
  )
}
