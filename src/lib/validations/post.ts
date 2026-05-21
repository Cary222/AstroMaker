import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().min(1, "请输入标题").max(200, "标题过长"),
  body: z.string().min(1, "请输入正文").max(50000, "正文过长"),
  categoryId: z.string().optional(),
});

export const createCommentSchema = z.object({
  body: z.string().min(1, "请输入评论").max(5000, "评论过长"),
  postId: z.string().min(1),
  parentId: z.string().optional(),
});
