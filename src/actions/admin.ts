"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import type { UserRole } from "@prisma/client";

export type UserWithCounts = {
  id: string;
  name: string | null;
  email: string;
  role: UserRole;
  bannedAt: Date | null;
  createdAt: Date;
  _count: {
    posts: number;
    comments: number;
  };
};

export async function getUsersAction(opts?: {
  search?: string;
  role?: string;
  page?: number;
}) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return { error: "无权限" };
  }

  const { search = "", role, page = 1 } = opts ?? {};
  const take = 20;
  const skip = (page - 1) * take;

  const where = {
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { email: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
    ...(role && role !== "ALL" ? { role: role as UserRole } : {}),
  };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        bannedAt: true,
        createdAt: true,
        _count: { select: { posts: true, comments: true } },
      },
      orderBy: { createdAt: "desc" },
      take,
      skip,
    }),
    prisma.user.count({ where }),
  ]);

  return {
    users: users as UserWithCounts[],
    total,
    page,
    totalPages: Math.ceil(total / take),
  };
}

export async function updateUserRoleAction(userId: string, role: UserRole) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return { error: "无权限" };
  }

  if (userId === session.user.id) {
    return { error: "不能修改自己的角色" };
  }

  const target = await prisma.user.findUnique({ where: { id: userId } });
  if (!target) return { error: "用户不存在" };

  await prisma.user.update({
    where: { id: userId },
    data: { role },
  });

  revalidatePath("/admin/users");
  return { success: true };
}

export async function banUserAction(userId: string) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return { error: "无权限" };
  }

  if (userId === session.user.id) {
    return { error: "不能封禁自己" };
  }

  const target = await prisma.user.findUnique({ where: { id: userId } });
  if (!target) return { error: "用户不存在" };
  if (target.role === "ADMIN") return { error: "不能封禁管理员" };

  await prisma.user.update({
    where: { id: userId },
    data: { bannedAt: new Date() },
  });

  revalidatePath("/admin/users");
  return { success: true };
}

export async function unbanUserAction(userId: string) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return { error: "无权限" };
  }

  await prisma.user.update({
    where: { id: userId },
    data: { bannedAt: null },
  });

  revalidatePath("/admin/users");
  return { success: true };
}
