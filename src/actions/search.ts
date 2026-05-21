"use server";

import { prisma } from "@/lib/db";

export type SearchResult = {
  id: string;
  title: string;
  slug: string;
  body: string;
  views: number;
  likes: number;
  createdAt: Date;
  author: { id: string; name: string | null; image: string | null };
  category: { id: string; name: string; slug: string } | null;
  _count: { comments: number };
};

export async function searchPosts(query: string, limit = 20) {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const keyword = query.trim();

  return prisma.post.findMany({
    where: {
      published: true,
      OR: [
        { title: { contains: keyword, mode: "insensitive" } },
        { body: { contains: keyword, mode: "insensitive" } },
      ],
    },
    orderBy: [
      { likes: "desc" },
      { views: "desc" },
      { createdAt: "desc" },
    ],
    take: limit,
    include: {
      author: { select: { id: true, name: true, image: true } },
      category: { select: { id: true, name: true, slug: true } },
      _count: { select: { comments: true } },
    },
  });
}
