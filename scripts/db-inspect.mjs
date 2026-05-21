import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const users = await prisma.user.findMany({
  select: {
    id: true,
    name: true,
    email: true,
    role: true,
    createdAt: true,
    _count: { select: { posts: true, comments: true } },
  },
  orderBy: { createdAt: "desc" },
});

const categories = await prisma.category.findMany({
  orderBy: { name: "asc" },
});

const posts = await prisma.post.findMany({
  select: {
    id: true,
    title: true,
    slug: true,
    published: true,
    createdAt: true,
    author: { select: { email: true, name: true } },
    category: { select: { name: true, slug: true } },
    _count: { select: { comments: true } },
  },
  orderBy: { createdAt: "desc" },
  take: 30,
});

const comments = await prisma.comment.findMany({
  select: {
    id: true,
    body: true,
    parentId: true,
    createdAt: true,
    author: { select: { email: true, name: true } },
    post: { select: { title: true, slug: true } },
  },
  orderBy: { createdAt: "desc" },
  take: 30,
});

console.log("=== 用户 User ===");
console.table(
  users.map((u) => ({
    邮箱: u.email,
    名称: u.name ?? "-",
    角色: u.role,
    帖子数: u._count.posts,
    评论数: u._count.comments,
    注册时间: u.createdAt.toISOString().slice(0, 19),
  })),
);

console.log("\n=== 分类 Category ===");
console.table(
  categories.map((c) => ({ 名称: c.name, slug: c.slug, id: c.id })),
);

console.log("\n=== 帖子 Post ===");
if (posts.length === 0) console.log("(无)");
else
  console.table(
    posts.map((p) => ({
      标题: p.title.slice(0, 30),
      slug: p.slug,
      作者: p.author.name ?? p.author.email,
      分类: p.category?.name ?? "-",
      评论: p._count.comments,
      时间: p.createdAt.toISOString().slice(0, 19),
    })),
  );

console.log("\n=== 评论 Comment ===");
if (comments.length === 0) console.log("(无)");
else
  console.table(
    comments.map((c) => ({
      正文: c.body.slice(0, 40),
      帖子: c.post.title.slice(0, 20),
      作者: c.author.name ?? c.author.email,
      回复: c.parentId ? "是" : "否",
      时间: c.createdAt.toISOString().slice(0, 19),
    })),
  );

console.log("\n=== 汇总 ===");
console.log({
  用户数: users.length,
  分类数: categories.length,
  帖子数: await prisma.post.count(),
  评论数: await prisma.comment.count(),
});

await prisma.$disconnect();
