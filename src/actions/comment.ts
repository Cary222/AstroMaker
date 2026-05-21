"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
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

  if (parentId) {
    const parent = await prisma.comment.findFirst({
      where: { id: parentId, postId },
    });
    if (!parent) {
      return { errors: { _form: ["回复目标无效"] } };
    }
  }

  await prisma.comment.create({
    data: {
      body,
      postId,
      authorId: session.user.id,
      parentId: parentId ?? null,
    },
  });

  revalidatePath(`/posts/${post.slug}`);
  return {};
}
