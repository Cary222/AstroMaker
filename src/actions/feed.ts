"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import type { Prisma } from "@prisma/client";

export type FeedTab = "hot" | "following" | "latest";

export type FeedPost = {
  id: string;
  title: string;
  slug: string;
  body: string;
  views: number;
  likes: number;
  reposts: number;
  createdAt: Date;
  images: string[];
  author: { id: string; name: string | null; image: string | null };
  category: { id: string; name: string; slug: string } | null;
  _count: { comments: number };
};

export type FeedResult = {
  posts: FeedPost[];
  nextCursor: string | null;
};

export async function getFeedPosts(opts: {
  tab?: FeedTab;
  categorySlug?: string;
  limit?: number;
  cursor?: string;
  followerId?: string;
} = {}): Promise<FeedResult> {
  const { tab = "latest", categorySlug, limit = 20, cursor, followerId } = opts;

  // Hot: sort by score = likes + views; Following: filter by followed authors
  const orderBy =
    tab === "hot"
      ? [{ likes: "desc" as const }, { views: "desc" as const }, { createdAt: "desc" as const }]
      : { createdAt: "desc" as const };

  const where: Prisma.PostWhereInput = {
    published: true,
    ...(categorySlug ? { category: { slug: categorySlug } } : {}),
  };

  // Cursor-based pagination: use createdAt for all tabs
  if (cursor) {
    where.createdAt = { lt: new Date(cursor) };
  }

  // Following tab: filter to posts from followed users
  if (tab === "following" && followerId) {
    const followed = await prisma.follow.findMany({
      where: { followerId },
      select: { followingId: true },
    });
    const followedIds = followed.map((f) => f.followingId);
    if (followedIds.length === 0) {
      return { posts: [], nextCursor: null };
    }
    where.authorId = { in: followedIds };
  }

  const posts = await prisma.post.findMany({
    where,
    orderBy,
    take: limit + 1,
    include: {
      author: { select: { id: true, name: true, image: true } },
      category: { select: { id: true, name: true, slug: true } },
      _count: { select: { comments: true } },
    },
  });

  const hasMore = posts.length > limit;
  const items = hasMore ? posts.slice(0, -1) : posts;

  let nextCursor: string | null = null;
  if (hasMore && items.length > 0) {
    nextCursor = items[items.length - 1].createdAt.toISOString();
  }

  return { posts: items as FeedPost[], nextCursor };
}
