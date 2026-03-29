import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Creating SwiftTap tables...')
  
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS swifttap_users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT,
      "businessName" TEXT,
      "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
      "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL
    )
  `)
  console.log('✓ swifttap_users created')

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS swifttap_payment_links (
      id TEXT PRIMARY KEY,
      "userId" TEXT NOT NULL REFERENCES swifttap_users(id),
      amount DOUBLE PRECISION,
      description TEXT,
      active BOOLEAN DEFAULT true NOT NULL,
      "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL
    )
  `)
  console.log('✓ swifttap_payment_links created')

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS swifttap_transactions (
      id TEXT PRIMARY KEY,
      "paymentLinkId" TEXT NOT NULL REFERENCES swifttap_payment_links(id),
      "userId" TEXT NOT NULL REFERENCES swifttap_users(id),
      amount DOUBLE PRECISION NOT NULL,
      currency TEXT DEFAULT 'eur' NOT NULL,
      status TEXT NOT NULL,
      "stripePaymentId" TEXT,
      "customerEmail" TEXT,
      "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL
    )
  `)
  console.log('✓ swifttap_transactions created')

  console.log('Done!')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
