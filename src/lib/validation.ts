// ============================================================================
// Zipayo Input Validation Schemas (Zod)
// ============================================================================

import { z } from 'zod'

// ============================================================================
// Auth Schemas
// ============================================================================

export const registerSchema = z.object({
  email: z.string().email('Ungültige E-Mail-Adresse'),
  password: z.string()
    .min(8, 'Passwort muss mindestens 8 Zeichen lang sein')
    .regex(/[A-Z]/, 'Passwort muss mindestens einen Großbuchstaben enthalten')
    .regex(/[a-z]/, 'Passwort muss mindestens einen Kleinbuchstaben enthalten')
    .regex(/[0-9]/, 'Passwort muss mindestens eine Zahl enthalten'),
  businessName: z.string()
    .min(2, 'Firmenname muss mindestens 2 Zeichen lang sein')
    .max(100, 'Firmenname darf maximal 100 Zeichen lang sein'),
})

export const loginSchema = z.object({
  email: z.string().email('Ungültige E-Mail-Adresse'),
  password: z.string().min(1, 'Passwort ist erforderlich'),
})

export const passwordResetRequestSchema = z.object({
  email: z.string().email('Ungültige E-Mail-Adresse'),
})

export const passwordResetSchema = z.object({
  token: z.string().min(1, 'Token ist erforderlich'),
  password: z.string()
    .min(8, 'Passwort muss mindestens 8 Zeichen lang sein')
    .regex(/[A-Z]/, 'Passwort muss mindestens einen Großbuchstaben enthalten')
    .regex(/[a-z]/, 'Passwort muss mindestens einen Kleinbuchstaben enthalten')
    .regex(/[0-9]/, 'Passwort muss mindestens eine Zahl enthalten'),
})

// ============================================================================
// Payment Schemas
// ============================================================================

export const createPaymentIntentSchema = z.object({
  amount: z.number()
    .min(50, 'Mindestbetrag ist 0,50 €')
    .max(99999900, 'Maximalbetrag ist 999.999,00 €'),
  currency: z.string()
    .length(3, 'Währungscode muss 3 Zeichen haben')
    .default('eur'),
  description: z.string()
    .max(500, 'Beschreibung darf maximal 500 Zeichen lang sein')
    .optional(),
  customerEmail: z.string().email('Ungültige E-Mail-Adresse').optional(),
})

export const paymentRequestSchema = z.object({
  amount: z.number()
    .min(50, 'Mindestbetrag ist 0,50 €')
    .max(99999900, 'Maximalbetrag ist 999.999,00 €'),
  currency: z.string()
    .length(3, 'Währungscode muss 3 Zeichen haben')
    .default('eur'),
  description: z.string()
    .max(500, 'Beschreibung darf maximal 500 Zeichen lang sein')
    .optional(),
  metadata: z.record(z.string()).optional(),
})

export const refundSchema = z.object({
  amount: z.number()
    .min(1, 'Rückerstattungsbetrag muss größer als 0 sein')
    .optional(),
  reason: z.enum(['duplicate', 'fraudulent', 'requested_by_customer']).optional(),
})

// ============================================================================
// Merchant Schemas
// ============================================================================

export const updateMerchantSchema = z.object({
  businessName: z.string()
    .min(2, 'Firmenname muss mindestens 2 Zeichen lang sein')
    .max(100, 'Firmenname darf maximal 100 Zeichen lang sein')
    .optional(),
  email: z.string().email('Ungültige E-Mail-Adresse').optional(),
  phone: z.string()
    .regex(/^[+]?[\d\s()-]+$/, 'Ungültige Telefonnummer')
    .optional()
    .nullable(),
  address: z.string().max(200, 'Adresse darf maximal 200 Zeichen lang sein').optional().nullable(),
  website: z.string().url('Ungültige URL').optional().nullable(),
  logoUrl: z.string().url('Ungültige Logo-URL').optional().nullable(),
})

// ============================================================================
// Team Schemas
// ============================================================================

export const teamInviteSchema = z.object({
  email: z.string().email('Ungültige E-Mail-Adresse'),
  role: z.enum(['ADMIN', 'MEMBER', 'VIEWER']),
})

export const updateTeamMemberSchema = z.object({
  role: z.enum(['ADMIN', 'MEMBER', 'VIEWER']),
})

// ============================================================================
// API Key Schemas
// ============================================================================

export const createApiKeySchema = z.object({
  name: z.string()
    .min(1, 'Name ist erforderlich')
    .max(50, 'Name darf maximal 50 Zeichen lang sein'),
  permissions: z.array(z.string()).optional(),
  expiresAt: z.string().datetime().optional(),
})

// ============================================================================
// QR Code Schemas
// ============================================================================

export const createQRCodeSchema = z.object({
  name: z.string()
    .min(1, 'Name ist erforderlich')
    .max(100, 'Name darf maximal 100 Zeichen lang sein'),
  amount: z.number()
    .min(0, 'Betrag darf nicht negativ sein')
    .max(99999900, 'Maximalbetrag ist 999.999,00 €')
    .optional(),
  description: z.string()
    .max(500, 'Beschreibung darf maximal 500 Zeichen lang sein')
    .optional(),
  isActive: z.boolean().default(true),
})

// ============================================================================
// Transaction Export Schema
// ============================================================================

export const transactionExportSchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  format: z.enum(['csv', 'json', 'pdf']).default('csv'),
})

// ============================================================================
// Helper: Validate and Parse
// ============================================================================

export function validateBody<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; error: string } {
  const result = schema.safeParse(data)
  
  if (result.success) {
    return { success: true, data: result.data }
  }
  
  // Format Zod errors nicely
  const errors = result.error.errors.map(e => e.message).join(', ')
  return { success: false, error: errors }
}
