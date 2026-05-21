import { prisma } from "@/lib/db";

export type PostTagWithTopic = {
  topic: { id: string; name: string; slug: string };
};

export type CommentWithAuthor = {
  id: string;
  body: string;
  parentId: string | null;
  likes: number;
  createdAt: Date;
  author: { id: string; name: string | null; image: string | null };
};

export type PostWithDetails = {
  id: string;
  title: string;
  slug: string;
  body: string;
  images: string[];
  pinned: boolean;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  author: { id: string; name: string | null; image: string | null };
  category: { id: string; name: string; slug: string } | null;
  tags: PostTagWithTopic[];
  comments: CommentWithAuthor[];
} | null;

export async function getLatestPosts(limit = 20) {
  return prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      author: { select: { id: true, name: true, image: true } },
      category: { select: { id: true, name: true, slug: true } },
      _count: { select: { comments: true } },
    },
  });
}

export async function getPostBySlug(slug: string): Promise<PostWithDetails> {
  return prisma.post.findUnique({
    where: { slug, published: true },
    include: {
      author: { select: { id: true, name: true, image: true } },
      category: { select: { id: true, name: true, slug: true } },
      tags: {
        include: {
          topic: { select: { id: true, name: true, slug: true } },
        },
      },
      comments: {
        orderBy: { createdAt: "asc" },
        include: {
          author: { select: { id: true, name: true, image: true } },
        },
      },
    },
  });
}

export async function getCategories(): Promise<{ id: string; name: string; slug: string; createdAt: Date }[]> {
  return prisma.category.findMany({ orderBy: { name: "asc" } });
}

export type AdminPost = {
  id: string;
  title: string;
  slug: string;
  body: string;
  published: boolean;
  authorId: string;
  categoryId: string | null;
  views: number;
  likes: number;
  reposts: number;
  images: string[];
  pinned: boolean;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
  author: { id: string; name: string | null; email: string };
  _count: { comments: number };
};

export async function getAdminPosts(limit = 50): Promise<AdminPost[]> {
  return prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      author: { select: { id: true, name: true, email: true } },
      _count: { select: { comments: true } },
    },
  });
}

export async function ensureUniqueSlug(base: string): Promise<string> {
  let slug = base;
  let suffix = 0;

  while (true) {
    const existing = await prisma.post.findUnique({ where: { slug } });
    if (!existing) return slug;
    suffix += 1;
    slug = `${base}-${suffix}`;
  }
}
