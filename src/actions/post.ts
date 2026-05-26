"use server";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { postPath, slugify } from "@/lib/slug";
import { ensureUniqueSlug } from "@/lib/posts";
import { createPostSchema } from "@/lib/validations/post";

export type CreatePostState = {
  errors?: {
    title?: string[];
    body?: string[];
    categoryId?: string[];
    _form?: string[];
  };
};

export async function createPostAction(
  _prevState: CreatePostState,
  formData: FormData,
): Promise<CreatePostState> {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/posts/new");
  }

  const raw = {
    title: formData.get("title"),
    body: formData.get("body"),
    categoryId: formData.get("categoryId") || undefined,
  };

  const parsed = createPostSchema.safeParse(raw);
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const { title, body, categoryId } = parsed.data;
  const slug = await ensureUniqueSlug(slugify(title));

  // 支持多图（未来扩展：图片上传后可传入 images 参数）
  const rawImages = formData.get("images");
  const images: string[] = rawImages
    ? JSON.parse(rawImages as string)
    : [];

  const post = await prisma.post.create({
    data: {
      title,
      body,
      slug,
      authorId: session.user.id,
      categoryId: categoryId || null,
      images,
    },
  });

  redirect(postPath(post.slug));
}
