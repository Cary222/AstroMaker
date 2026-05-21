"use server";

import { prisma } from "@/lib/db";

export type SuggestedUserData = {
  id: string;
  name: string | null;
  image: string | null;
  bio: string | null;
  followersCount: number;
};

export type TopicData = {
  id: string;
  name: string;
  slug: string;
  posts: number;
  lastUsedAt: Date | null;
};

export async function getHotTopics(limit = 20, days = 7) {
  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  return prisma.topic.findMany({
    where: {
      lastUsedAt: { gte: cutoff },
    },
    orderBy: [
      { posts: "desc" },
      { lastUsedAt: "desc" },
    ],
    take: limit,
    select: {
      id: true,
      name: true,
      slug: true,
      posts: true,
      lastUsedAt: true,
    },
  });
}

export async function searchTopics(query: string, limit = 10) {
  if (!query.trim()) return [];

  return prisma.topic.findMany({
    where: {
      name: {
        contains: query,
        mode: "insensitive",
      },
    },
    orderBy: { posts: "desc" },
    take: limit,
    select: {
      id: true,
      name: true,
      slug: true,
      posts: true,
      lastUsedAt: true,
    },
  });
}

export async function createOrGetTopics(tagNames: string[]): Promise<string[]> {
  const now = new Date();
  const results: string[] = [];

  for (const name of tagNames) {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    if (!slug) continue;

    const topic = await prisma.topic.upsert({
      where: { slug },
      update: {
        posts: { increment: 1 },
        lastUsedAt: now,
      },
      create: {
        name,
        slug,
        posts: 1,
        lastUsedAt: now,
      },
    });

    results.push(topic.id);
  }

  return results;
}
