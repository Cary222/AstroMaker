"use server";

import { prisma } from "@/lib/db";

export async function getFeedPosts(opts: {
  categorySlug?: string;
  limit?: number;
  cursor?: string;
} = {}) {
  const { categorySlug, limit = 20, cursor } = opts;

  const where = {
    published: true,
    ...(categorySlug ? { category: { slug: categorySlug } } : {}),
    ...(cursor ? { createdAt: { lt: new Date(cursor) } } : {}),
  };

  const posts = await prisma.post.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: limit + 1,
    include: {
      author: { select: { id: true, name: true, image: true } },
      category: { select: { id: true, name: true, slug: true } },
      _count: { select: { comments: true } },
    },
  });

  const hasMore = posts.length > limit;
  const items = hasMore ? posts.slice(0, -1) : posts;
  const nextCursor = hasMore
    ? items[items.length - 1].createdAt.toISOString()
    : null;

  return { posts: items, nextCursor };
}
