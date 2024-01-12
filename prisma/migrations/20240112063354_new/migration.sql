-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "number_book" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Book" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "picture_url" TEXT NOT NULL,
    "overall_rate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "yearly_rate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "monthly_rate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "read_count" INTEGER NOT NULL DEFAULT 0,
    "yearly_count" INTEGER NOT NULL DEFAULT 0,
    "monthly_count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Userbooks" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "book_id" INTEGER NOT NULL,
    "user_rate" INTEGER,
    "finish" BOOLEAN NOT NULL,
    "favorite" BOOLEAN NOT NULL,
    "finish_date" TIMESTAMP(3),

    CONSTRAINT "Userbooks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wantreadbooks" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "picture_url" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Wantreadbooks_user_id_key" ON "Wantreadbooks"("user_id");

-- AddForeignKey
ALTER TABLE "Userbooks" ADD CONSTRAINT "Userbooks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Userbooks" ADD CONSTRAINT "Userbooks_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wantreadbooks" ADD CONSTRAINT "Wantreadbooks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
