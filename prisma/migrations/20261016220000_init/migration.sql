-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "PreregistrationSource" AS ENUM ('SITE', 'SHEET', 'MANUAL');

-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('TSHIRT', 'PHOTO_PACK', 'OTHER');

-- CreateEnum
CREATE TYPE "PromoType" AS ENUM ('PERCENT', 'FIXED');

-- CreateEnum
CREATE TYPE "PromoOrigin" AS ENUM ('MANUAL', 'PREREG');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PAID', 'REFUNDED', 'PARTIALLY_REFUNDED', 'CANCELLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('F', 'M', 'X');

-- CreateEnum
CREATE TYPE "JustificatifType" AS ENUM ('PPS', 'LICENCE_FFA', 'CERTIFICAT');

-- CreateEnum
CREATE TYPE "RegistrationStatus" AS ENUM ('ACTIVE', 'CANCELLED', 'TRANSFERRED');

-- CreateEnum
CREATE TYPE "AssetCategory" AS ENUM ('ADS', 'SITE', 'PRODUCT', 'GUIDE', 'OTHER');

-- CreateEnum
CREATE TYPE "CampaignAudience" AS ENUM ('ALL_PAID', 'RACE', 'PREREG', 'TEST');

-- CreateEnum
CREATE TYPE "CampaignStatus" AS ENUM ('DRAFT', 'SENDING', 'SENT', 'FAILED');

-- CreateEnum
CREATE TYPE "EmailType" AS ENUM ('PREREG_CONFIRMATION', 'ORDER_CONFIRMATION', 'LAUNCH_PROMO', 'CAMPAIGN', 'REFUND', 'OTHER');

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rateLimit" (
    "id" TEXT NOT NULL,
    "key" TEXT,
    "count" INTEGER,
    "lastRequest" BIGINT,

    CONSTRAINT "rateLimit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Preregistration" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "source" "PreregistrationSource" NOT NULL DEFAULT 'SITE',
    "consent" BOOLEAN NOT NULL DEFAULT true,
    "promoCodeId" TEXT,
    "codeSentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Preregistration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Edition" (
    "id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "raceDate" TIMESTAMP(3) NOT NULL,
    "feePercent" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "tshirtEnabled" BOOLEAN NOT NULL DEFAULT false,
    "registrationOpen" BOOLEAN NOT NULL DEFAULT false,
    "registrationOpenedAt" TIMESTAMP(3),
    "registrationClosesAt" TIMESTAMP(3),
    "preregCodeValidDays" INTEGER NOT NULL DEFAULT 15,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Edition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Race" (
    "id" TEXT NOT NULL,
    "editionId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "distanceKm" DECIMAL(5,2) NOT NULL,
    "startTime" TEXT,
    "startPlace" TEXT,
    "finishPlace" TEXT,
    "description" TEXT,
    "capacity" INTEGER,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Race_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PriceTier" (
    "id" TEXT NOT NULL,
    "raceId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "priceCents" INTEGER NOT NULL,
    "maxQuantity" INTEGER,
    "endsAt" TIMESTAMP(3),
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PriceTier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "editionId" TEXT NOT NULL,
    "type" "ProductType" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "priceCents" INTEGER NOT NULL,
    "imageKey" TEXT,
    "sizes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "stock" INTEGER,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PromoCode" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "type" "PromoType" NOT NULL,
    "value" INTEGER NOT NULL,
    "maxUses" INTEGER,
    "usedCount" INTEGER NOT NULL DEFAULT 0,
    "boundEmail" TEXT,
    "expiresAt" TIMESTAMP(3),
    "raceIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "origin" "PromoOrigin" NOT NULL DEFAULT 'MANUAL',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PromoCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "editionId" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT,
    "subtotalCents" INTEGER NOT NULL,
    "discountCents" INTEGER NOT NULL DEFAULT 0,
    "feeCents" INTEGER NOT NULL DEFAULT 0,
    "totalCents" INTEGER NOT NULL,
    "refundedCents" INTEGER NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'eur',
    "promoCodeId" TEXT,
    "stripeSessionId" TEXT,
    "stripePaymentIntentId" TEXT,
    "paidAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Registration" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "raceId" TEXT NOT NULL,
    "priceTierId" TEXT,
    "unitPriceCents" INTEGER NOT NULL,
    "status" "RegistrationStatus" NOT NULL DEFAULT 'ACTIVE',
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "gender" "Gender" NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "nationality" TEXT DEFAULT 'FR',
    "club" TEXT,
    "city" TEXT,
    "postalCode" TEXT,
    "emergencyContactName" TEXT,
    "emergencyContactPhone" TEXT,
    "tshirtSize" TEXT,
    "justificatifType" "JustificatifType",
    "justificatifNumber" TEXT,
    "justificatifValidated" BOOLEAN NOT NULL DEFAULT false,
    "bibNumber" INTEGER,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Registration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "registrationId" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "unitPriceCents" INTEGER NOT NULL,
    "size" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Asset" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "category" "AssetCategory" NOT NULL DEFAULT 'OTHER',
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailCampaign" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "audience" "CampaignAudience" NOT NULL DEFAULT 'ALL_PAID',
    "raceId" TEXT,
    "status" "CampaignStatus" NOT NULL DEFAULT 'DRAFT',
    "sentAt" TIMESTAMP(3),
    "sentCount" INTEGER NOT NULL DEFAULT 0,
    "errorCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmailCampaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailLog" (
    "id" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "type" "EmailType" NOT NULL,
    "subject" TEXT NOT NULL,
    "campaignId" TEXT,
    "sesMessageId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'sent',
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StripeEvent" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "processedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StripeEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- CreateIndex
CREATE INDEX "session_userId_idx" ON "session"("userId");

-- CreateIndex
CREATE INDEX "account_userId_idx" ON "account"("userId");

-- CreateIndex
CREATE INDEX "verification_identifier_idx" ON "verification"("identifier");

-- CreateIndex
CREATE UNIQUE INDEX "rateLimit_key_key" ON "rateLimit"("key");

-- CreateIndex
CREATE UNIQUE INDEX "Preregistration_email_key" ON "Preregistration"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Preregistration_promoCodeId_key" ON "Preregistration"("promoCodeId");

-- CreateIndex
CREATE INDEX "Preregistration_createdAt_idx" ON "Preregistration"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Edition_year_key" ON "Edition"("year");

-- CreateIndex
CREATE UNIQUE INDEX "Race_editionId_slug_key" ON "Race"("editionId", "slug");

-- CreateIndex
CREATE INDEX "PriceTier_raceId_sortOrder_idx" ON "PriceTier"("raceId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "PromoCode_code_key" ON "PromoCode"("code");

-- CreateIndex
CREATE INDEX "PromoCode_boundEmail_idx" ON "PromoCode"("boundEmail");

-- CreateIndex
CREATE UNIQUE INDEX "Order_number_key" ON "Order"("number");

-- CreateIndex
CREATE UNIQUE INDEX "Order_stripeSessionId_key" ON "Order"("stripeSessionId");

-- CreateIndex
CREATE UNIQUE INDEX "Order_stripePaymentIntentId_key" ON "Order"("stripePaymentIntentId");

-- CreateIndex
CREATE INDEX "Order_status_paidAt_idx" ON "Order"("status", "paidAt");

-- CreateIndex
CREATE INDEX "Order_email_idx" ON "Order"("email");

-- CreateIndex
CREATE INDEX "Registration_raceId_status_idx" ON "Registration"("raceId", "status");

-- CreateIndex
CREATE INDEX "Registration_email_idx" ON "Registration"("email");

-- CreateIndex
CREATE INDEX "Registration_bibNumber_idx" ON "Registration"("bibNumber");

-- CreateIndex
CREATE INDEX "OrderItem_orderId_idx" ON "OrderItem"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "Asset_key_key" ON "Asset"("key");

-- CreateIndex
CREATE INDEX "Asset_category_createdAt_idx" ON "Asset"("category", "createdAt");

-- CreateIndex
CREATE INDEX "EmailLog_to_idx" ON "EmailLog"("to");

-- CreateIndex
CREATE INDEX "EmailLog_campaignId_idx" ON "EmailLog"("campaignId");

-- CreateIndex
CREATE INDEX "EmailLog_createdAt_idx" ON "EmailLog"("createdAt");

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Preregistration" ADD CONSTRAINT "Preregistration_promoCodeId_fkey" FOREIGN KEY ("promoCodeId") REFERENCES "PromoCode"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Race" ADD CONSTRAINT "Race_editionId_fkey" FOREIGN KEY ("editionId") REFERENCES "Edition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PriceTier" ADD CONSTRAINT "PriceTier_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_editionId_fkey" FOREIGN KEY ("editionId") REFERENCES "Edition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_editionId_fkey" FOREIGN KEY ("editionId") REFERENCES "Edition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_promoCodeId_fkey" FOREIGN KEY ("promoCodeId") REFERENCES "PromoCode"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Registration" ADD CONSTRAINT "Registration_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Registration" ADD CONSTRAINT "Registration_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Registration" ADD CONSTRAINT "Registration_priceTierId_fkey" FOREIGN KEY ("priceTierId") REFERENCES "PriceTier"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_registrationId_fkey" FOREIGN KEY ("registrationId") REFERENCES "Registration"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailLog" ADD CONSTRAINT "EmailLog_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "EmailCampaign"("id") ON DELETE SET NULL ON UPDATE CASCADE;

