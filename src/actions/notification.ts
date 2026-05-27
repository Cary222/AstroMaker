"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import type { Prisma } from "@prisma/client";

export type NotificationItem = {
  id: string;
  type: string;
  content: string;
  read: boolean;
  actorId: string | null;
  targetId: string | null;
  createdAt: Date;
  actor: { id: string; name: string | null; image: string | null } | null;
};

export async function getNotificationsAction(opts?: {
  unreadOnly?: boolean;
  cursor?: string;
  limit?: number;
}) {
  const session = await auth();
  if (!session?.user?.id) return { error: "未登录" };

  const { unreadOnly, cursor, limit = 30 } = opts ?? {};

  const where: Prisma.NotificationWhereInput = {
    userId: session.user.id,
    ...(unreadOnly ? { read: false } : {}),
  };

  const notifications = await prisma.notification.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: limit + 1,
    include: {
      actor: { select: { id: true, name: true, image: true } },
    },
  });

  const hasMore = notifications.length > limit;
  const items = hasMore ? notifications.slice(0, -1) : notifications;

  return {
    notifications: items as NotificationItem[],
    nextCursor: hasMore && items.length > 0
      ? items[items.length - 1].createdAt.toISOString()
      : null,
  };
}

export async function getUnreadCountAction() {
  const session = await auth();
  if (!session?.user?.id) return { count: 0 };

  const count = await prisma.notification.count({
    where: { userId: session.user.id, read: false },
  });

  return { count };
}

export async function markAsReadAction(notificationId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "未登录" };

  await prisma.notification.updateMany({
    where: { id: notificationId, userId: session.user.id },
    data: { read: true },
  });

  revalidatePath("/");
  return { success: true };
}

export async function markAllAsReadAction() {
  const session = await auth();
  if (!session?.user?.id) return { error: "未登录" };

  await prisma.notification.updateMany({
    where: { userId: session.user.id, read: false },
    data: { read: true },
  });

  revalidatePath("/");
  return { success: true };
}

export async function createNotification(opts: {
  type: string;
  content: string;
  userId: string;
  actorId?: string;
  targetId?: string;
}) {
  await prisma.notification.create({
    data: opts,
  });
}
