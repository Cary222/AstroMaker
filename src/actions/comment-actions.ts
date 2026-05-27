"use server";

import { prisma } from "@/lib/db";

export type CommentWithAuthor = {
  id: string;
  body: string;
  parentId: string | null;
  createdAt: Date;
  likes: number;
  author: { id: string; name: string | null; image: string | null };
};

export type CommentsResult = {
  comments: CommentWithAuthor[];
  nextCursor: string | null;
};

export async function getCommentsAction(opts: {
  postId: string;
  cursor?: string;
  limit?: number;
}): Promise<CommentsResult> {
  const { postId, cursor, limit = 20 } = opts;

  // Only paginate top-level comments; always include all their replies
  const topLevelWhere: { postId: string; parentId: null; createdAt?: { lt: Date } } = {
    postId,
    parentId: null,
  };
  if (cursor) {
    topLevelWhere.createdAt = { lt: new Date(cursor) };
  }

  // Fetch top-level comments for this page
  const topLevel = await prisma.comment.findMany({
    where: topLevelWhere,
    orderBy: { createdAt: "asc" },
    take: limit + 1,
    include: {
      author: { select: { id: true, name: true, image: true } },
    },
  });

  const hasMore = topLevel.length > limit;
  const pageTopLevel = hasMore ? topLevel.slice(0, -1) : topLevel;

  // Fetch all replies for the top-level comments on this page
  const topLevelIds = pageTopLevel.map((c) => c.id);
  const replies = topLevelIds.length
    ? await prisma.comment.findMany({
        where: { parentId: { in: topLevelIds } },
        orderBy: { createdAt: "asc" },
        include: {
          author: { select: { id: true, name: true, image: true } },
        },
      })
    : [];

  // Merge top-level + replies, sort by createdAt
  const all: CommentWithAuthor[] = [...pageTopLevel, ...replies].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  ) as CommentWithAuthor[];

  const nextCursor =
    hasMore && pageTopLevel.length > 0
      ? pageTopLevel[pageTopLevel.length - 1].createdAt.toISOString()
      : null;

  return { comments: all, nextCursor };
}
