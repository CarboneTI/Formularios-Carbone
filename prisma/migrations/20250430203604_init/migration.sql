-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "FormSubmission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "formType" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "submittedById" TEXT,
    "submittedByName" TEXT,
    "submittedByEmail" TEXT,
    CONSTRAINT "FormSubmission_submittedById_fkey" FOREIGN KEY ("submittedById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Webhook" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "formType" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "headers" TEXT,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "WebhookResult" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "success" BOOLEAN NOT NULL,
    "status" INTEGER,
    "statusText" TEXT,
    "responseData" TEXT,
    "error" TEXT,
    "webhookId" TEXT NOT NULL,
    "formSubmissionId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "WebhookResult_webhookId_fkey" FOREIGN KEY ("webhookId") REFERENCES "Webhook" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "WebhookResult_formSubmissionId_fkey" FOREIGN KEY ("formSubmissionId") REFERENCES "FormSubmission" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AuthToken" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "AuthToken_token_key" ON "AuthToken"("token");
