-- CreateTable
CREATE TABLE "Post" (
    "id" VARCHAR NOT NULL,
    "title" VARCHAR(50) NOT NULL,
    "content" VARCHAR NOT NULL,
    "image" VARCHAR,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "published" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Post_id_key" ON "Post"("id");
