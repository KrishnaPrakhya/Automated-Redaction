/*
  Warnings:

  - You are about to drop the `employee` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "employee";

-- CreateTable
CREATE TABLE "Users" (
    "user_id" TEXT NOT NULL,
    "user_name" TEXT NOT NULL,
    "user_email" TEXT NOT NULL,
    "user_password" TEXT NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Documents" (
    "doc_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "document" BYTEA NOT NULL,
    "doc_type" TEXT NOT NULL,
    "uploaded_date" TIMESTAMP(3) NOT NULL,
    "doc_name" TEXT NOT NULL,

    CONSTRAINT "Documents_pkey" PRIMARY KEY ("doc_id")
);

-- CreateTable
CREATE TABLE "UserActivity" (
    "user_activity_id" TEXT NOT NULL,
    "doc_id" TEXT NOT NULL,
    "doc_type" TEXT NOT NULL,
    "settings" JSONB NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "UserActivity_pkey" PRIMARY KEY ("user_activity_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_user_email_key" ON "Users"("user_email");

-- AddForeignKey
ALTER TABLE "Documents" ADD CONSTRAINT "Documents_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserActivity" ADD CONSTRAINT "UserActivity_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserActivity" ADD CONSTRAINT "UserActivity_doc_id_fkey" FOREIGN KEY ("doc_id") REFERENCES "Documents"("doc_id") ON DELETE RESTRICT ON UPDATE CASCADE;
