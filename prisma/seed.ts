import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const categories = [
  { id: "cat_general", name: "综合讨论", slug: "general" },
  { id: "cat_tech", name: "技术交流", slug: "tech" },
  { id: "cat_life", name: "生活随笔", slug: "life" },
];

async function main() {
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name },
      create: cat,
    });
  }
  console.log("Seeded categories:", categories.map((c) => c.slug).join(", "));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
