-- CreateTable
CREATE TABLE "Url" (
    "shortUrl" TEXT NOT NULL,
    "originalUrl" TEXT NOT NULL,
    "accessCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Url_pkey" PRIMARY KEY ("shortUrl")
);
