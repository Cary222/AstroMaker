"use server";

import { prisma } from "@/lib/db";

export type SuggestedUserData = {
  id: string;
  name: string | null;
  image: string | null;
  bio: string | null;
  followersCount: number;
};

export async function getHotTopics(limit = 10) {
  return prisma.topic.findMany({
    orderBy: { posts: "desc" },
    take: limit,
  });
}

export async function getSuggestedUsers(limit = 5): Promise<SuggestedUserData[]> {
  return prisma.user.findMany({
    take: limit,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      image: true,
      bio: true,
      followersCount: true,
    },
  });
}

export async function createTopicAction(name: string) {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return prisma.topic.upsert({
    where: { slug },
    update: { posts: { increment: 1 } },
    create: { name, slug, posts: 1 },
  });
}
