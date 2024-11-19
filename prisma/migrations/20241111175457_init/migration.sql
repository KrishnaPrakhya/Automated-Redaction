/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "employee" (
    "emp_id" SERIAL NOT NULL,
    "fname" VARCHAR(50) NOT NULL,
    "lname" VARCHAR(50) NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "salary" DECIMAL(10,2) DEFAULT 30000,
    "hire_date" DATE NOT NULL DEFAULT CURRENT_DATE,
    "dept" VARCHAR(40),

    CONSTRAINT "employee_pkey" PRIMARY KEY ("emp_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "employee_email_key" ON "employee"("email");
