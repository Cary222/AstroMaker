"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { canDeleteComment, canDeletePost } from "@/lib/permissions";
import { postPath } from "@/lib/slug";
import { createModerationLog } from "@/lib/moderation";

export async function deletePostAction(postId: string) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) return { error: "帖子不存在" };

  if (
    !canDeletePost(session.user.role, session.user.id, post.authorId)
  ) {
    return { error: "无权删除" };
  }

  await prisma.post.delete({ where: { id: postId } });

  // 记录审计日志
  await createModerationLog({
    action: "DELETE_POST",
    targetId: postId,
    targetType: "Post",
    actorId: session.user.id,
    reason: `删除帖子: ${post.title}`,
  });

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/");
}

export async function deleteCommentAction(commentId: string, postSlug: string) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    include: { post: true },
  });
  if (!comment) return { error: "评论不存在" };

  if (
    !canDeleteComment(session.user.role, session.user.id, comment.authorId)
  ) {
    return { error: "无权删除" };
  }

  await prisma.comment.delete({ where: { id: commentId } });

  // 记录审计日志
  await createModerationLog({
    action: "DELETE_COMMENT",
    targetId: commentId,
    targetType: "Comment",
    actorId: session.user.id,
    reason: `删除评论: ${comment.body.slice(0, 50)}...`,
  });

  revalidatePath(postPath(postSlug));
  return { success: true };
}

export async function togglePinPostAction(postId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "未登录" };

  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) return { error: "帖子不存在" };

  const { isModerator } = await import("@/lib/permissions");
  if (!isModerator(session.user.role)) {
    return { error: "无权操作" };
  }

  const updated = await prisma.post.update({
    where: { id: postId },
    data: { pinned: !post.pinned },
  });

  // 记录审计日志
  await createModerationLog({
    action: updated.pinned ? "PIN_POST" : "UNPIN_POST",
    targetId: postId,
    targetType: "Post",
    actorId: session.user.id,
    reason: updated.pinned ? `置顶帖子: ${post.title}` : `取消置顶: ${post.title}`,
  });

  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true, pinned: updated.pinned };
}

export async function toggleFeaturePostAction(postId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "未登录" };

  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) return { error: "帖子不存在" };

  const { isModerator } = await import("@/lib/permissions");
  if (!isModerator(session.user.role)) {
    return { error: "无权操作" };
  }

  const updated = await prisma.post.update({
    where: { id: postId },
    data: { featured: !post.featured },
  });

  // 记录审计日志
  await createModerationLog({
    action: updated.featured ? "FEATURE_POST" : "UNFEATURE_POST",
    targetId: postId,
    targetType: "Post",
    actorId: session.user.id,
    reason: updated.featured ? `加精帖子: ${post.title}` : `取消加精: ${post.title}`,
  });

  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true, featured: updated.featured };
}
