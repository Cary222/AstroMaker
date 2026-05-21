import { PrismaClient } from "@prisma/client";

const email = process.argv[2];
if (!email) {
  console.error("用法: npm run db:promote-admin -- <邮箱>");
  process.exit(1);
}

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.update({
    where: { email },
    data: { role: "ADMIN" },
  });
  console.log(`已将 ${user.email} 提升为 ADMIN`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
