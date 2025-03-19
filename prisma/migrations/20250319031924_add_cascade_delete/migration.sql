-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PostImage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL,
    "postId" INTEGER NOT NULL,
    CONSTRAINT "PostImage_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_PostImage" ("id", "postId", "url") SELECT "id", "postId", "url" FROM "PostImage";
DROP TABLE "PostImage";
ALTER TABLE "new_PostImage" RENAME TO "PostImage";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
