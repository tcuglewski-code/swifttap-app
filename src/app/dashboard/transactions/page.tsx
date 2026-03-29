"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Loader2, 
  ChevronLeft, 
  ChevronRight,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Download,
  FileText,
  FileSpreadsheet,
  Mail,
  RotateCcw,
  X,
  AlertTriangle
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Transaction {
  id: string
  amount: number
  currency: string
  status: string
  description: string | null
  customerEmail: string | null
  stripePaymentId: string | null
  createdAt: string
  qrCode: { id: string; name: string } | null
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)
  
  // Filters
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState("")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")

  // Modals
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null)
  const [showRefundDialog, setShowRefundDialog] = useState(false)
  const [refunding, setRefunding] = useState(false)
  const [sendingReceipt, setSendingReceipt] = useState(false)
  const [actionMessage, setActionMessage] = useState<{type: 'success' | 'error', text: string} | null>(null)

  useEffect(() => {
    fetchTransactions()
  }, [page, status, dateFrom, dateTo])

  async function fetchTransactions() {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set("page", page.toString())
      params.set("limit", "20")
      if (status) params.set("status", status)
      if (dateFrom) params.set("dateFrom", dateFrom)
      if (dateTo) params.set("dateTo", dateTo)

      const res = await fetch(`/api/transactions?${params}`)
      if (res.ok) {
        const data = await res.json()
        setTransactions(data.transactions)
        setPagination(data.pagination)
      }
    } catch (e) {
      console.error("Error fetching transactions:", e)
    } finally {
      setLoading(false)
    }
  }

  async function handleExport(format: 'pdf' | 'csv') {
    setExporting(true)
    try {
      const params = new URLSearchParams()
      params.set("format", format)
      if (dateFrom) params.set("dateFrom", dateFrom)
      if (dateTo) params.set("dateTo", dateTo)

      const res = await fetch(`/api/transactions/export?${params}`)
      if (res.ok) {
        const blob = await res.blob()
        const contentDisposition = res.headers.get('Content-Disposition')
        const filename = contentDisposition?.match(/filename="(.+)"/)?.[1] || `export.${format}`
        
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        a.remove()
      }
    } catch (e) {
      console.error("Export error:", e)
    } finally {
      setExporting(false)
    }
  }

  async function handleRefund() {
    if (!selectedTx) return
    setRefunding(true)
    setActionMessage(null)

    try {
      const res = await fetch(`/api/payments/${selectedTx.id}/refund`, {
        method: 'POST',
      })
      const data = await res.json()

      if (res.ok) {
        setActionMessage({ type: 'success', text: 'Zahlung wurde erfolgreich erstattet' })
        setShowRefundDialog(false)
        fetchTransactions()
      } else {
        setActionMessage({ type: 'error', text: data.details || data.error || 'Erstattung fehlgeschlagen' })
      }
    } catch (e) {
      setActionMessage({ type: 'error', text: 'Ein Fehler ist aufgetreten' })
    } finally {
      setRefunding(false)
    }
  }

  async function handleSendReceipt() {
    if (!selectedTx) return
    setSendingReceipt(true)
    setActionMessage(null)

    try {
      const res = await fetch('/api/email/receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId: selectedTx.id }),
      })
      const data = await res.json()

      if (res.ok && data.success) {
        setActionMessage({ type: 'success', text: data.message || 'Quittung gesendet' })
      } else {
        setActionMessage({ type: 'error', text: data.message || data.error || 'Senden fehlgeschlagen' })
      }
    } catch (e) {
      setActionMessage({ type: 'error', text: 'Ein Fehler ist aufgetreten' })
    } finally {
      setSendingReceipt(false)
    }
  }

  function formatAmount(cents: number, currency: string): string {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(cents / 100)
  }

  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  function getStatusIcon(status: string) {
    switch (status) {
      case "succeeded":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "failed":
        return <XCircle className="w-4 h-4 text-red-600" />
      case "refunded":
        return <RefreshCw className="w-4 h-4 text-blue-600" />
      default:
        return <Clock className="w-4 h-4 text-yellow-600" />
    }
  }

  function getStatusBadge(status: string) {
    const badges: Record<string, { bg: string, text: string, label: string }> = {
      succeeded: { bg: 'bg-green-100', text: 'text-green-700', label: 'Erfolgreich' },
      failed: { bg: 'bg-red-100', text: 'text-red-700', label: 'Fehlgeschlagen' },
      refunded: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Rückerstattet' },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Ausstehend' },
    }
    const badge = badges[status] || badges.pending
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        {getStatusIcon(status)}
        {badge.label}
      </span>
    )
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Transaktionen</h1>
          <p className="text-gray-600">
            Übersicht aller Zahlungen.
          </p>
        </div>
        
        {/* Export Buttons */}
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport('csv')}
            disabled={exporting}
          >
            {exporting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <FileSpreadsheet className="w-4 h-4 mr-2" />}
            CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport('pdf')}
            disabled={exporting}
          >
            {exporting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <FileText className="w-4 h-4 mr-2" />}
            PDF
          </Button>
        </div>
      </div>

      {/* Action Message */}
      {actionMessage && (
        <div className={`mb-4 p-3 rounded-lg flex items-center justify-between ${
          actionMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          <span>{actionMessage.text}</span>
          <button onClick={() => setActionMessage(null)} className="hover:opacity-75">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Status</label>
            <select
              value={status}
              onChange={(e) => { setStatus(e.target.value); setPage(1) }}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="">Alle</option>
              <option value="succeeded">Erfolgreich</option>
              <option value="pending">Ausstehend</option>
              <option value="failed">Fehlgeschlagen</option>
              <option value="refunded">Rückerstattet</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Von</label>
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => { setDateFrom(e.target.value); setPage(1) }}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Bis</label>
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => { setDateTo(e.target.value); setPage(1) }}
            />
          </div>
          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={() => {
                setStatus("")
                setDateFrom("")
                setDateTo("")
                setPage(1)
              }}
            >
              Filter zurücksetzen
            </Button>
          </div>
        </div>
      </div>

      {/* Transactions table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            Keine Transaktionen gefunden.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Betrag</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">QR Code</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kunde</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Datum</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Aktionen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(tx.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`font-semibold ${tx.status === 'refunded' ? 'text-gray-400 line-through' : ''}`}>
                          {formatAmount(tx.amount, tx.currency)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {tx.qrCode?.name || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {tx.customerEmail || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDate(tx.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          {tx.customerEmail && tx.status === 'succeeded' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedTx(tx)
                                handleSendReceipt()
                              }}
                              disabled={sendingReceipt}
                              title="Quittung senden"
                            >
                              <Mail className="w-4 h-4" />
                            </Button>
                          )}
                          {tx.status === 'succeeded' && tx.stripePaymentId && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedTx(tx)
                                setShowRefundDialog(true)
                              }}
                              className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                              title="Erstatten"
                            >
                              <RotateCcw className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50">
                <span className="text-sm text-gray-600">
                  Zeige {(pagination.page - 1) * pagination.limit + 1} bis{" "}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} von {pagination.total}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pagination.page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pagination.page >= pagination.totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Refund Confirmation Dialog */}
      <Dialog open={showRefundDialog} onOpenChange={setShowRefundDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              Zahlung erstatten
            </DialogTitle>
            <DialogDescription>
              Sind Sie sicher, dass Sie diese Zahlung erstatten möchten? Diese Aktion kann nicht rückgängig gemacht werden.
            </DialogDescription>
          </DialogHeader>
          
          {selectedTx && (
            <div className="bg-gray-50 rounded-lg p-4 my-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Betrag</p>
                  <p className="font-semibold">{formatAmount(selectedTx.amount, selectedTx.currency)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Datum</p>
                  <p className="font-semibold">{formatDate(selectedTx.createdAt)}</p>
                </div>
                {selectedTx.customerEmail && (
                  <div className="col-span-2">
                    <p className="text-gray-500">Kunde</p>
                    <p className="font-semibold">{selectedTx.customerEmail}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRefundDialog(false)} disabled={refunding}>
              Abbrechen
            </Button>
            <Button 
              onClick={handleRefund} 
              disabled={refunding}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {refunding ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Erstatte...
                </>
              ) : (
                'Erstatten'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
