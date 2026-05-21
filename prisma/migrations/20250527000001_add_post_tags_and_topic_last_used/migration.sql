-- Migration: add_post_tags_and_topic_last_used
-- Created: 2026-05-27

-- 1. Add lastUsedAt to Topic for hot calculation
ALTER TABLE "Topic" ADD COLUMN "lastUsedAt" TIMESTAMP(3);

CREATE INDEX "Topic_lastUsedAt_idx" ON "Topic"("lastUsedAt" DESC);

-- 2. Create PostTag junction table
CREATE TABLE "PostTag" (
    "postId" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    CONSTRAINT "PostTag_pkey" PRIMARY KEY ("postId", "topicId")
);

ALTER TABLE "PostTag" ADD CONSTRAINT "PostTag_postId_fkey"
    FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "PostTag" ADD CONSTRAINT "PostTag_topicId_fkey"
    FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE INDEX "PostTag_topicId_idx" ON "PostTag"("topicId");
