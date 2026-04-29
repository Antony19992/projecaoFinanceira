-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "amount" REAL NOT NULL,
    "date" DATETIME NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'manual',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "MonthlyLimit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "category" TEXT NOT NULL,
    "limitValue" REAL NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "MonthlyLimit_category_month_year_key" ON "MonthlyLimit"("category", "month", "year");
