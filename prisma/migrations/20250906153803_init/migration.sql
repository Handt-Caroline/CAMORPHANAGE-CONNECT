-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('ORPHANAGE', 'ORGANIZATION', 'ADMIN');

-- CreateEnum
CREATE TYPE "public"."EventStatus" AS ENUM ('PENDING', 'APPROVED', 'DECLINED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "public"."VisitPurpose" AS ENUM ('DONATION', 'TEACHING', 'WORKSHOP', 'ONLINE_CLASS', 'VOLUNTEERING');

-- CreateEnum
CREATE TYPE "public"."VerificationStatus" AS ENUM ('UNVERIFIED', 'PENDING', 'VERIFIED', 'REJECTED');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."orphanage_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "phone" TEXT,
    "profileImageUrl" TEXT,
    "directorName" TEXT,
    "registrationNumber" TEXT,
    "legalDocumentsUrl" TEXT,
    "verificationStatus" "public"."VerificationStatus" NOT NULL DEFAULT 'UNVERIFIED',
    "visitCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "orphanage_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."organization_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "contactPerson" TEXT,
    "phone" TEXT,
    "purposes" TEXT NOT NULL,

    CONSTRAINT "organization_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."needs" (
    "id" TEXT NOT NULL,
    "orphanageId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "needs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."events" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "orphanageId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "proposedDate" TIMESTAMP(3) NOT NULL,
    "status" "public"."EventStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."visits" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "orphanageId" TEXT NOT NULL,
    "visitDate" TIMESTAMP(3) NOT NULL,
    "purpose" "public"."VisitPurpose" NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "visits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."messages" (
    "id" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isRead" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "orphanage_profiles_userId_key" ON "public"."orphanage_profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "organization_profiles_userId_key" ON "public"."organization_profiles"("userId");

-- AddForeignKey
ALTER TABLE "public"."orphanage_profiles" ADD CONSTRAINT "orphanage_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."organization_profiles" ADD CONSTRAINT "organization_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."needs" ADD CONSTRAINT "needs_orphanageId_fkey" FOREIGN KEY ("orphanageId") REFERENCES "public"."orphanage_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."events" ADD CONSTRAINT "events_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."organization_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."events" ADD CONSTRAINT "events_orphanageId_fkey" FOREIGN KEY ("orphanageId") REFERENCES "public"."orphanage_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."visits" ADD CONSTRAINT "visits_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."organization_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."visits" ADD CONSTRAINT "visits_orphanageId_fkey" FOREIGN KEY ("orphanageId") REFERENCES "public"."orphanage_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."messages" ADD CONSTRAINT "messages_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."messages" ADD CONSTRAINT "messages_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
