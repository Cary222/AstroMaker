"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function toggleLikeAction(postId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "请先登录" };
  }

  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) return { error: "帖子不存在" };

  // 简化的点赞逻辑（可扩展为独立的 Like 表）
  const delta = post.likes >= 0 ? 1 : 0;
  await prisma.post.update({
    where: { id: postId },
    data: { likes: { increment: 1 } },
  });

  revalidatePath("/");
  return { likes: post.likes + 1 };
}

export async function incrementViewsAction(postId: string) {
  await prisma.post.update({
    where: { id: postId },
    data: { views: { increment: 1 } },
  });
}

export async function followUserAction(targetUserId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "请先登录" };
  }
  if (session.user.id === targetUserId) {
    return { error: "不能关注自己" };
  }

  const existing = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId: session.user.id,
        followingId: targetUserId,
      },
    },
  });

  if (existing) {
    await prisma.follow.delete({
      where: { id: existing.id },
    });
    await prisma.user.update({
      where: { id: session.user.id },
      data: { followingCount: { decrement: 1 } },
    });
    await prisma.user.update({
      where: { id: targetUserId },
      data: { followersCount: { decrement: 1 } },
    });
    revalidatePath("/");
    return { following: false };
  } else {
    await prisma.follow.create({
      data: { followerId: session.user.id, followingId: targetUserId },
    });
    await prisma.user.update({
      where: { id: session.user.id },
      data: { followingCount: { increment: 1 } },
    });
    await prisma.user.update({
      where: { id: targetUserId },
      data: { followersCount: { increment: 1 } },
    });
    revalidatePath("/");
    return { following: true };
  }
}
