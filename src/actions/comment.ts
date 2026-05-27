"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { postPath } from "@/lib/slug";
import { createCommentSchema } from "@/lib/validations/post";

export type CreateCommentState = {
  errors?: {
    body?: string[];
    _form?: string[];
  };
};

export async function createCommentAction(
  _prevState: CreateCommentState,
  formData: FormData,
): Promise<CreateCommentState> {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const raw = {
    body: formData.get("body"),
    postId: formData.get("postId"),
    parentId: formData.get("parentId") || undefined,
  };

  const parsed = createCommentSchema.safeParse(raw);
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const { body, postId, parentId } = parsed.data;

  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) {
    return { errors: { _form: ["帖子不存在"] } };
  }

  // Resolve parent comment and notification target in one query
  const parentComment = parentId
    ? await prisma.comment.findFirst({
        where: { id: parentId, postId },
        select: { authorId: true },
      })
    : null;

  if (parentId && !parentComment) {
    return { errors: { _form: ["回复目标无效"] } };
  }

  const notifyUserId =
    parentComment?.authorId ?? post.authorId;

  const shouldNotify = notifyUserId && notifyUserId !== session.user.id;

  await prisma.comment.create({
    data: {
      body,
      postId,
      authorId: session.user.id,
      parentId: parentId ?? null,
    },
  });

  if (shouldNotify) {
    await prisma.notification.create({
      data: {
        type: parentId ? "reply" : "comment",
        content: parentId
          ? `${session.user.name ?? "有人"}回复了你的评论`
          : `${session.user.name ?? "有人"}评论了你的帖子「${post.title}」`,
        userId: notifyUserId,
        actorId: session.user.id,
        targetId: postId,
      },
    });
  }

  revalidatePath(postPath(post.slug));
  return {};
}
