/*
  # BeatSlave Market v1.0 - Initial Schema

  1. Core Tables (v1.0 Active)
    - `artists` - Producer/artist profiles
    - `releases` - Albums/EPs grouping tracks
    - `tracks` - Individual beats with metadata and pricing
    - `orders` - Purchase records
    - `order_items` - Line items linking orders to tracks
    - `download_tokens` - Secure time-limited download links

  2. Legal & Compliance (v1.0 Active)
    - `terms_acceptance` - Track legal agreement acceptance

  3. Future Tables (v1.1 Ready - Not Yet Used)
    - `license_agreements` - Store license terms per purchase
    - `royalty_reports` - Track royalty obligations for Premium/Exclusive

  4. Security
    - Enable RLS on all tables (policies TBD based on auth implementation)
    - All tables have created_at/updated_at timestamps
    - Proper foreign key constraints and indexes
*/

-- Create enum types
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');
CREATE TYPE "LicenseType" AS ENUM ('STANDARD', 'PREMIUM', 'EXCLUSIVE');

-- Artists table
CREATE TABLE IF NOT EXISTS "Artist" (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  bio TEXT,
  "coverUrl" TEXT,
  website TEXT,
  instagram TEXT,
  twitter TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Releases table
CREATE TABLE IF NOT EXISTS "Release" (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  "artistId" TEXT NOT NULL,
  "coverUrl" TEXT,
  "releaseDate" TIMESTAMP(3),
  description TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("artistId") REFERENCES "Artist"(id) ON DELETE CASCADE
);

-- Tracks table (with v1.1 royalty fields)
CREATE TABLE IF NOT EXISTS "Track" (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  "releaseId" TEXT NOT NULL,
  "audioUrl" TEXT,
  "previewUrl" TEXT,
  duration INTEGER,
  bpm INTEGER,
  key TEXT,
  genre TEXT,
  mood TEXT,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  "priceCents" INTEGER NOT NULL DEFAULT 99,
  "standardPriceCents" INTEGER NOT NULL DEFAULT 99,
  "premiumPriceCents" INTEGER NOT NULL DEFAULT 499,
  "exclusivePriceCents" INTEGER NOT NULL DEFAULT 4999,
  
  "premiumRoyaltyEnabled" BOOLEAN NOT NULL DEFAULT false,
  "premiumRoyaltyThreshold" INTEGER NOT NULL DEFAULT 5000,
  "premiumRoyaltyTier1Percent" INTEGER NOT NULL DEFAULT 30,
  "premiumRoyaltyTier2Percent" INTEGER NOT NULL DEFAULT 35,
  "premiumRoyaltyTier3Percent" INTEGER NOT NULL DEFAULT 40,
  
  "exclusiveRoyaltyEnabled" BOOLEAN NOT NULL DEFAULT false,
  "exclusiveRoyaltyThreshold" INTEGER NOT NULL DEFAULT 10000,
  "exclusiveRoyaltyTier1Percent" INTEGER NOT NULL DEFAULT 10,
  "exclusiveRoyaltyTier2Percent" INTEGER NOT NULL DEFAULT 15,
  "exclusiveRoyaltyTier3Percent" INTEGER NOT NULL DEFAULT 20,
  
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("releaseId") REFERENCES "Release"(id) ON DELETE CASCADE
);

-- Orders table
CREATE TABLE IF NOT EXISTS "Order" (
  id TEXT PRIMARY KEY,
  "stripeSessionId" TEXT UNIQUE,
  "customerEmail" TEXT NOT NULL,
  "totalCents" INTEGER NOT NULL,
  status "OrderStatus" NOT NULL DEFAULT 'PENDING',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Order items table
CREATE TABLE IF NOT EXISTS "OrderItem" (
  id TEXT PRIMARY KEY,
  "orderId" TEXT NOT NULL,
  "trackId" TEXT NOT NULL,
  "licenseType" "LicenseType" NOT NULL,
  "priceCents" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("orderId") REFERENCES "Order"(id) ON DELETE CASCADE,
  FOREIGN KEY ("trackId") REFERENCES "Track"(id) ON DELETE CASCADE
);

-- Download tokens table
CREATE TABLE IF NOT EXISTS "DownloadToken" (
  id TEXT PRIMARY KEY,
  token TEXT UNIQUE NOT NULL,
  "orderId" TEXT NOT NULL,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "usedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("orderId") REFERENCES "Order"(id) ON DELETE CASCADE
);

-- Terms acceptance table
CREATE TABLE IF NOT EXISTS "TermsAcceptance" (
  id TEXT PRIMARY KEY,
  "orderId" TEXT UNIQUE NOT NULL,
  "acceptedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "ipAddress" TEXT,
  "userAgent" TEXT,
  "legalVersion" TEXT NOT NULL DEFAULT 'v1.0',
  FOREIGN KEY ("orderId") REFERENCES "Order"(id) ON DELETE CASCADE
);

-- License agreements table (v1.1)
CREATE TABLE IF NOT EXISTS "LicenseAgreement" (
  id TEXT PRIMARY KEY,
  "orderId" TEXT NOT NULL,
  "trackId" TEXT NOT NULL,
  "licenseType" "LicenseType" NOT NULL,
  "agreementText" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Royalty reports table (v1.1)
CREATE TABLE IF NOT EXISTS "RoyaltyReport" (
  id TEXT PRIMARY KEY,
  "orderId" TEXT NOT NULL,
  "trackId" TEXT NOT NULL,
  "periodStart" TIMESTAMP(3) NOT NULL,
  "periodEnd" TIMESTAMP(3) NOT NULL,
  "reportedRevenue" INTEGER NOT NULL DEFAULT 0,
  "royaltyDue" INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS "Release_artistId_idx" ON "Release"("artistId");
CREATE INDEX IF NOT EXISTS "Track_releaseId_idx" ON "Track"("releaseId");
CREATE INDEX IF NOT EXISTS "Track_isActive_idx" ON "Track"("isActive");
CREATE INDEX IF NOT EXISTS "OrderItem_orderId_idx" ON "OrderItem"("orderId");
CREATE INDEX IF NOT EXISTS "OrderItem_trackId_idx" ON "OrderItem"("trackId");
CREATE INDEX IF NOT EXISTS "DownloadToken_orderId_idx" ON "DownloadToken"("orderId");
CREATE INDEX IF NOT EXISTS "LicenseAgreement_orderId_idx" ON "LicenseAgreement"("orderId");
CREATE INDEX IF NOT EXISTS "LicenseAgreement_trackId_idx" ON "LicenseAgreement"("trackId");
CREATE INDEX IF NOT EXISTS "RoyaltyReport_orderId_idx" ON "RoyaltyReport"("orderId");
CREATE INDEX IF NOT EXISTS "RoyaltyReport_trackId_idx" ON "RoyaltyReport"("trackId");

-- Enable Row Level Security (RLS will be configured based on auth setup)
ALTER TABLE "Artist" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Release" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Track" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Order" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OrderItem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "DownloadToken" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "TermsAcceptance" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "LicenseAgreement" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "RoyaltyReport" ENABLE ROW LEVEL SECURITY;

-- Create public read policies for catalog browsing
CREATE POLICY "Anyone can view active tracks"
  ON "Track" FOR SELECT
  USING ("isActive" = true);

CREATE POLICY "Anyone can view artists"
  ON "Artist" FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view releases"
  ON "Release" FOR SELECT
  USING (true);
