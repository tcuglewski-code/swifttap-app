"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface ApiKey {
  id: string
  name: string
  keyPreview: string
  lastUsed: string | null
  createdAt: string
}

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>([])
  const [loading, setLoading] = useState(true)
  const [newKeyName, setNewKeyName] = useState("")
  const [newKey, setNewKey] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [creating, setCreating] = useState(false)

  const fetchKeys = async () => {
    const res = await fetch("/api/api-keys")
    const data = await res.json()
    setKeys(data.apiKeys || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchKeys()
  }, [])

  const createKey = async () => {
    if (!newKeyName.trim()) return
    setCreating(true)
    
    const res = await fetch("/api/api-keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newKeyName })
    })
    
    const data = await res.json()
    if (data.key) {
      setNewKey(data.key)
      fetchKeys()
    }
    setCreating(false)
  }

  const deleteKey = async (id: string) => {
    if (!confirm("API-Key wirklich löschen?")) return
    
    await fetch(`/api/api-keys/${id}`, { method: "DELETE" })
    fetchKeys()
  }

  const copyKey = () => {
    if (newKey) {
      navigator.clipboard.writeText(newKey)
    }
  }

  const closeDialog = () => {
    setDialogOpen(false)
    setNewKey(null)
    setNewKeyName("")
  }

  if (loading) {
    return <div className="text-center py-8">Lade API-Keys...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#1A2744]">API-Keys</h1>
          <p className="text-gray-500 mt-1">Verwalte deine API-Keys für POS-Integrationen</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#00C9B1] hover:bg-[#00b3a0]">
              + Neuer API-Key
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {newKey ? "API-Key erstellt" : "Neuen API-Key erstellen"}
              </DialogTitle>
            </DialogHeader>
            {!newKey ? (
              <div className="space-y-4 py-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Name</label>
                  <Input
                    placeholder="z.B. POS-System Filiale 1"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <Button
                  onClick={createKey}
                  disabled={!newKeyName.trim() || creating}
                  className="w-full bg-[#1A2744]"
                >
                  {creating ? "Erstelle..." : "Key erstellen"}
                </Button>
              </div>
            ) : (
              <div className="space-y-4 py-4">
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                  <p className="text-sm text-yellow-800 font-medium mb-2">
                    ⚠️ Speichere diesen Key sicher — er wird nur einmal angezeigt!
                  </p>
                </div>
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm break-all">
                  {newKey}
                </div>
                <div className="flex gap-2">
                  <Button onClick={copyKey} variant="outline" className="flex-1">
                    📋 Kopieren
                  </Button>
                  <Button onClick={closeDialog} className="flex-1 bg-[#1A2744]">
                    Fertig
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <Card className="rounded-xl border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-[#1A2744]">Aktive API-Keys</CardTitle>
        </CardHeader>
        <CardContent>
          {keys.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Noch keine API-Keys erstellt</p>
              <p className="text-sm mt-2">Erstelle einen Key um die Zipayo API zu nutzen</p>
            </div>
          ) : (
            <div className="space-y-3">
              {keys.map(k => (
                <div key={k.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex-1">
                    <div className="font-semibold text-[#1A2744]">{k.name}</div>
                    <div className="font-mono text-sm text-gray-500">{k.keyPreview}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      Erstellt: {new Date(k.createdAt).toLocaleDateString("de-DE")}
                      {k.lastUsed && ` • Zuletzt: ${new Date(k.lastUsed).toLocaleString("de-DE")}`}
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteKey(k.id)}
                  >
                    Löschen
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* API Documentation */}
      <Card className="rounded-xl border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-[#1A2744]">API-Dokumentation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-2">Authentifizierung</h3>
            <p className="text-gray-600 mb-2">Sende deinen API-Key im Header:</p>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
              X-Zipayo-Key: st_live_xxx...
            </pre>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Zahlung erstellen</h3>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
{`curl -X POST https://zipayo-app.vercel.app/api/v1/payment-request \\
  -H "X-Zipayo-Key: st_live_xxx" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 1500,
    "description": "Rechnung #123",
    "customerEmail": "kunde@example.com",
    "expiresInMinutes": 30
  }'`}
            </pre>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Status abfragen</h3>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
{`curl https://zipayo-app.vercel.app/api/v1/payment-status/{paymentId} \\
  -H "X-Zipayo-Key: st_live_xxx"`}
            </pre>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Zahlung abbrechen</h3>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
{`curl -X POST https://zipayo-app.vercel.app/api/v1/payment-request/{paymentId}/cancel \\
  -H "X-Zipayo-Key: st_live_xxx"`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
