/**
 * 服务器/本地冒烟测试：数据库连通 + 基础 CRUD
 * 用法: node scripts/smoke-test.mjs
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const TEST_EMAIL = "smoke-test@community.local";

let failed = 0;
function ok(msg) {
  console.log(`  OK  ${msg}`);
}
function fail(msg, err) {
  failed++;
  console.error(`  FAIL ${msg}`, err?.message ?? err ?? "");
}

async function main() {
  console.log("==> 数据库连通");
  try {
    await prisma.$queryRaw`SELECT 1`;
    ok("Prisma 连接");
  } catch (e) {
    fail("Prisma 连接", e);
    process.exit(1);
  }

  console.log("==> 表与种子数据");
  const categories = await prisma.category.findMany();
  if (categories.length >= 3) ok(`分类 ${categories.length} 条`);
  else fail(`分类不足: ${categories.length}`);

  const migrations = await prisma.$queryRaw`
    SELECT migration_name FROM _prisma_migrations ORDER BY finished_at
  `;
  if (migrations.length >= 2) ok(`迁移 ${migrations.length} 条`);
  else fail(`迁移记录: ${migrations.length}`);

  console.log("==> CRUD 冒烟");
  await prisma.user.deleteMany({ where: { email: TEST_EMAIL } }).catch(() => {});

  const passwordHash = await bcrypt.hash("smoke-test-pass-12", 12);
  const user = await prisma.user.create({
    data: { name: "SmokeTest", email: TEST_EMAIL, passwordHash },
  });
  ok(`创建用户 ${user.id}`);

  const cat = categories[0];
  const post = await prisma.post.create({
    data: {
      title: "冒烟测试帖",
      slug: `smoke-${Date.now()}`,
      body: "## 测试\n正文 **bold**",
      authorId: user.id,
      categoryId: cat?.id,
    },
  });
  ok(`创建帖子 ${post.slug}`);

  const comment = await prisma.comment.create({
    data: { body: "测试评论", postId: post.id, authorId: user.id },
  });
  ok(`创建评论 ${comment.id}`);

  const loaded = await prisma.post.findUnique({
    where: { slug: post.slug },
    include: { author: true, category: true, comments: true },
  });
  if (loaded?.comments.length === 1 && loaded.author.email === TEST_EMAIL) {
    ok("关联查询");
  } else {
    fail("关联查询");
  }

  await prisma.comment.delete({ where: { id: comment.id } });
  await prisma.post.delete({ where: { id: post.id } });
  await prisma.user.delete({ where: { id: user.id } });
  ok("清理测试数据");

  console.log("");
  if (failed === 0) {
    console.log("全部通过");
    process.exit(0);
  } else {
    console.log(`${failed} 项失败`);
    process.exit(1);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
