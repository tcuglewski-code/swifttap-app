-- SwiftTap Tables (standalone, not affecting existing tables)

CREATE TABLE IF NOT EXISTS swifttap_users (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT,
  "businessName" TEXT,
  "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS swifttap_payment_links (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId" TEXT NOT NULL REFERENCES swifttap_users(id),
  amount DOUBLE PRECISION,
  description TEXT,
  active BOOLEAN DEFAULT true NOT NULL,
  "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS swifttap_transactions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "paymentLinkId" TEXT NOT NULL REFERENCES swifttap_payment_links(id),
  "userId" TEXT NOT NULL REFERENCES swifttap_users(id),
  amount DOUBLE PRECISION NOT NULL,
  currency TEXT DEFAULT 'eur' NOT NULL,
  status TEXT NOT NULL,
  "stripePaymentId" TEXT,
  "customerEmail" TEXT,
  "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_swifttap_users_email ON swifttap_users(email);
CREATE INDEX IF NOT EXISTS idx_swifttap_transactions_user ON swifttap_transactions("userId");
CREATE INDEX IF NOT EXISTS idx_swifttap_transactions_link ON swifttap_transactions("paymentLinkId");
