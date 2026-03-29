import { NextRequest } from "next/server"
import { prisma } from "./prisma"

export interface ApiKeyAuth {
  merchantId: string
  keyId: string
}

export async function validateApiKey(request: NextRequest): Promise<ApiKeyAuth | null> {
  const apiKey = request.headers.get("X-Zipayo-Key")
  
  if (!apiKey) {
    return null
  }
  
  const keyRecord = await prisma.apiKey.findUnique({
    where: { key: apiKey },
    include: { merchant: true }
  })
  
  if (!keyRecord || !keyRecord.merchant.active) {
    return null
  }
  
  // Update lastUsed
  await prisma.apiKey.update({
    where: { id: keyRecord.id },
    data: { lastUsed: new Date() }
  })
  
  return {
    merchantId: keyRecord.merchantId,
    keyId: keyRecord.id
  }
}
