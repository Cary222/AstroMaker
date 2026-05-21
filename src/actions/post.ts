"use server";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { postPath, slugify } from "@/lib/slug";
import { ensureUniqueSlug } from "@/lib/posts";
import { createPostSchema } from "@/lib/validations/post";
import { createOrGetTopics } from "@/actions/topic";

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

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { bannedAt: true },
  });
  if (dbUser?.bannedAt) {
    return { errors: { _form: ["账号已被封禁，无法发帖"] } };
  }

  const raw = {
    title: formData.get("title"),
    body: formData.get("body"),
    categoryId: formData.get("categoryId") || undefined,
    tags: formData.get("tags") as string || undefined,
  };

  const parsed = createPostSchema.safeParse(raw);
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const { title, body, categoryId, tags: tagNames } = parsed.data;
  const slug = await ensureUniqueSlug(slugify(title));

  // 支持多图（未来扩展：图片上传后可传入 images 参数）
  const rawImages = formData.get("images");
  const images: string[] = rawImages
    ? JSON.parse(rawImages as string)
    : [];

  // 处理标签
  const tagList = tagNames
    ? tagNames.split(",").map((t) => t.trim()).filter(Boolean).slice(0, 5)
    : [];
  const topicIds = tagList.length > 0 ? await createOrGetTopics(tagList) : [];

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

  // Create post-tag associations
  if (topicIds.length > 0) {
    await prisma.postTag.createMany({
      data: topicIds.map((topicId) => ({
        postId: post.id,
        topicId,
      })),
    });
  }

  redirect(postPath(post.slug));
}

export type EditPostState = {
  errors?: {
    title?: string[];
    body?: string[];
    categoryId?: string[];
    _form?: string[];
  };
};

/** 帖子可编辑时限（24 小时） */
const EDIT_WINDOW_MS = 24 * 60 * 60 * 1000;

export async function editPostAction(
  postId: string,
  _prevState: EditPostState,
  formData: FormData,
): Promise<EditPostState> {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
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

  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) {
    return { errors: { _form: ["帖子不存在"] } };
  }

  if (post.authorId !== session.user.id) {
    return { errors: { _form: ["无权编辑此帖子"] } };
  }

  const age = Date.now() - post.createdAt.getTime();
  if (age > EDIT_WINDOW_MS) {
    return { errors: { _form: ["发帖超过 24 小时，无法编辑"] } };
  }

  // 处理图片更新
  const rawImages = formData.get("images");
  const images: string[] = rawImages ? JSON.parse(rawImages as string) : [];

  // 处理标签更新
  const rawTags = formData.get("tags") as string | null;
  const tagList = rawTags
    ? rawTags.split(",").map((t) => t.trim()).filter(Boolean).slice(0, 5)
    : [];
  const topicIds = tagList.length > 0 ? await createOrGetTopics(tagList) : [];

  await prisma.$transaction(async (tx: typeof prisma) => {
    await tx.post.update({
      where: { id: postId },
      data: {
        title,
        body,
        categoryId: categoryId || null,
        images,
      },
    });

    // 删除旧的标签关联
    await tx.postTag.deleteMany({ where: { postId } });

    // 创建新的标签关联
    if (topicIds.length > 0) {
      await tx.postTag.createMany({
        data: topicIds.map((topicId) => ({
          postId,
          topicId,
        })),
      });
    }
  });

  redirect(postPath(post.slug));
}
