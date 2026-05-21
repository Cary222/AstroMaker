"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { canDeleteComment, canDeletePost } from "@/lib/permissions";

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
  revalidatePath(`/posts/${postSlug}`);
  return { success: true };
}
