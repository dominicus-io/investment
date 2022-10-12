-- CreateTable
CREATE TABLE "Investment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "return" REAL NOT NULL,
    "fundingCapital" INTEGER NOT NULL,
    "investmentTerm" INTEGER NOT NULL,
    "fundingEnd" DATETIME NOT NULL
);
