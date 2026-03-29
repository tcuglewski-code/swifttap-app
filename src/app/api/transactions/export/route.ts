export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

export async function GET(req: NextRequest) {
  try {
    // Session check
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 })
    }

    const searchParams = req.nextUrl.searchParams
    const format = searchParams.get('format') || 'csv'
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')

    // Get merchant for this user
    const merchant = await prisma.merchant.findUnique({
      where: { userId: session.user.id }
    })

    if (!merchant) {
      return NextResponse.json({ error: 'Kein Händlerkonto gefunden' }, { status: 404 })
    }

    // Build query
    const where: any = { merchantId: merchant.id }
    
    if (dateFrom) {
      where.createdAt = { ...where.createdAt, gte: new Date(dateFrom) }
    }
    if (dateTo) {
      const endDate = new Date(dateTo)
      endDate.setHours(23, 59, 59, 999)
      where.createdAt = { ...where.createdAt, lte: endDate }
    }

    // Fetch transactions
    const transactions = await prisma.payment.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { qrCode: true }
    })

    if (format === 'csv') {
      return generateCSV(transactions, merchant.businessName, dateFrom, dateTo)
    } else if (format === 'pdf') {
      return generatePDF(transactions, merchant.businessName, dateFrom, dateTo)
    }

    return NextResponse.json({ error: 'Ungültiges Format' }, { status: 400 })

  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json({ error: 'Export fehlgeschlagen' }, { status: 500 })
  }
}

function generateCSV(transactions: any[], businessName: string, dateFrom: string | null, dateTo: string | null) {
  const headers = ['Datum', 'Transaktions-ID', 'Betrag', 'Währung', 'Status', 'Kunde', 'QR-Code', 'Beschreibung']
  
  const rows = transactions.map(tx => [
    new Date(tx.createdAt).toLocaleDateString('de-DE'),
    tx.id,
    (tx.amount / 100).toFixed(2).replace('.', ','),
    tx.currency.toUpperCase(),
    tx.status,
    tx.customerEmail || '-',
    tx.qrCode?.name || '-',
    tx.description || '-'
  ])

  const csv = [
    headers.join(';'),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(';'))
  ].join('\n')

  // Add BOM for Excel UTF-8 compatibility
  const bom = '\uFEFF'
  const csvContent = bom + csv

  const dateRange = dateFrom && dateTo ? `_${dateFrom}_bis_${dateTo}` : ''
  const filename = `Zipayo_Transaktionen_${businessName.replace(/\s+/g, '_')}${dateRange}.csv`

  return new NextResponse(csvContent, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}

async function generatePDF(transactions: any[], businessName: string, dateFrom: string | null, dateTo: string | null) {
  const pdfDoc = await PDFDocument.create()
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  
  // Colors
  const primaryColor = rgb(26 / 255, 39 / 255, 68 / 255) // #1A2744
  const accentColor = rgb(0, 201 / 255, 177 / 255) // #00C9B1
  const grayColor = rgb(107 / 255, 114 / 255, 128 / 255)
  
  let page = pdfDoc.addPage([595, 842]) // A4
  const { width, height } = page.getSize()
  let y = height - 50

  // Header
  page.drawText('Zipayo', {
    x: 50,
    y,
    size: 24,
    font: helveticaBold,
    color: primaryColor,
  })

  y -= 30
  page.drawText('Transaktionsübersicht', {
    x: 50,
    y,
    size: 16,
    font: helveticaBold,
    color: primaryColor,
  })

  y -= 25
  page.drawText(`Händler: ${businessName}`, {
    x: 50,
    y,
    size: 11,
    font: helvetica,
    color: grayColor,
  })

  y -= 15
  const dateRange = dateFrom && dateTo 
    ? `Zeitraum: ${dateFrom} bis ${dateTo}` 
    : `Erstellt am: ${new Date().toLocaleDateString('de-DE')}`
  page.drawText(dateRange, {
    x: 50,
    y,
    size: 11,
    font: helvetica,
    color: grayColor,
  })

  // Line
  y -= 20
  page.drawLine({
    start: { x: 50, y },
    end: { x: width - 50, y },
    thickness: 1,
    color: rgb(229 / 255, 231 / 255, 235 / 255),
  })

  // Table header
  y -= 25
  const colX = [50, 130, 280, 360, 460]
  const headers = ['Datum', 'Transaktions-ID', 'Betrag', 'Status', 'Kunde']
  
  headers.forEach((header, i) => {
    page.drawText(header, {
      x: colX[i],
      y,
      size: 9,
      font: helveticaBold,
      color: grayColor,
    })
  })

  y -= 10
  page.drawLine({
    start: { x: 50, y },
    end: { x: width - 50, y },
    thickness: 0.5,
    color: rgb(229 / 255, 231 / 255, 235 / 255),
  })

  // Table rows
  let totalAmount = 0
  let successCount = 0

  for (const tx of transactions) {
    y -= 20
    
    // New page if needed
    if (y < 80) {
      page = pdfDoc.addPage([595, 842])
      y = height - 50
    }

    const date = new Date(tx.createdAt).toLocaleDateString('de-DE')
    const amount = (tx.amount / 100).toFixed(2).replace('.', ',') + ' €'
    const status = tx.status === 'succeeded' ? 'Erfolgreich' : 
                   tx.status === 'refunded' ? 'Erstattet' : 
                   tx.status === 'failed' ? 'Fehlgeschlagen' : 'Ausstehend'
    const customer = tx.customerEmail ? tx.customerEmail.substring(0, 20) : '-'

    page.drawText(date, { x: colX[0], y, size: 9, font: helvetica, color: primaryColor })
    page.drawText(tx.id.substring(0, 15) + '...', { x: colX[1], y, size: 8, font: helvetica, color: grayColor })
    page.drawText(amount, { x: colX[2], y, size: 9, font: helveticaBold, color: tx.status === 'refunded' ? grayColor : accentColor })
    page.drawText(status, { x: colX[3], y, size: 9, font: helvetica, color: primaryColor })
    page.drawText(customer, { x: colX[4], y, size: 8, font: helvetica, color: grayColor })

    if (tx.status === 'succeeded') {
      totalAmount += tx.amount
      successCount++
    }
  }

  // Summary
  y -= 30
  page.drawLine({
    start: { x: 50, y },
    end: { x: width - 50, y },
    thickness: 1,
    color: rgb(229 / 255, 231 / 255, 235 / 255),
  })

  y -= 25
  page.drawText('Zusammenfassung', {
    x: 50,
    y,
    size: 12,
    font: helveticaBold,
    color: primaryColor,
  })

  y -= 18
  page.drawText(`Anzahl Transaktionen: ${transactions.length}`, {
    x: 50,
    y,
    size: 10,
    font: helvetica,
    color: grayColor,
  })

  y -= 15
  page.drawText(`Erfolgreiche Zahlungen: ${successCount}`, {
    x: 50,
    y,
    size: 10,
    font: helvetica,
    color: grayColor,
  })

  y -= 18
  const totalFormatted = (totalAmount / 100).toFixed(2).replace('.', ',') + ' €'
  page.drawText(`Gesamtsumme (erfolgreich): ${totalFormatted}`, {
    x: 50,
    y,
    size: 11,
    font: helveticaBold,
    color: accentColor,
  })

  // Footer
  page.drawText('Generiert von Zipayo', {
    x: 50,
    y: 30,
    size: 8,
    font: helvetica,
    color: grayColor,
  })

  const pdfBytes = await pdfDoc.save()
  const dateRangeStr = dateFrom && dateTo ? `_${dateFrom}_bis_${dateTo}` : ''
  const filename = `Zipayo_Transaktionen_${businessName.replace(/\s+/g, '_')}${dateRangeStr}.pdf`

  return new NextResponse(pdfBytes, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}
