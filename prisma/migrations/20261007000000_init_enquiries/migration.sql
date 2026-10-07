-- CreateEnum
CREATE TYPE "EnquiryStatus" AS ENUM ('NEW', 'CONTACTED', 'INTERESTED', 'FOLLOW_UP', 'CAMPUS_VISIT_SCHEDULED', 'CAMPUS_VISITED', 'APPLICATION_STARTED', 'APPLICATION_SUBMITTED', 'UNDER_REVIEW', 'SELECTED', 'ADMISSION_CONFIRMED', 'NOT_INTERESTED', 'LOST');

-- CreateTable
CREATE TABLE "Enquiry" (
    "id" TEXT NOT NULL,
    "enquiryNumber" TEXT NOT NULL,
    "parentName" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "whatsapp" TEXT,
    "email" TEXT,
    "childName" TEXT NOT NULL,
    "childDateOfBirth" TIMESTAMP(3),
    "interestedProgram" TEXT NOT NULL,
    "currentSchool" TEXT,
    "locality" TEXT,
    "preferredCallback" TEXT,
    "preferredVisitDate" TIMESTAMP(3),
    "message" TEXT,
    "source" TEXT NOT NULL DEFAULT 'WEBSITE',
    "utmSource" TEXT,
    "utmMedium" TEXT,
    "utmCampaign" TEXT,
    "utmContent" TEXT,
    "utmTerm" TEXT,
    "status" "EnquiryStatus" NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Enquiry_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Enquiry_enquiryNumber_key" ON "Enquiry"("enquiryNumber");
CREATE INDEX "Enquiry_mobile_idx" ON "Enquiry"("mobile");
CREATE INDEX "Enquiry_status_createdAt_idx" ON "Enquiry"("status", "createdAt");
CREATE INDEX "Enquiry_interestedProgram_idx" ON "Enquiry"("interestedProgram");
