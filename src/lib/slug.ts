export function slugify(title: string): string {
  const base = title
    .trim()
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fff]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  return base || "post";
}

/** 帖子详情路径（中文 slug 须编码，否则 redirect 响应头非法） */
export function postPath(slug: string): string {
  return `/posts/${encodeURIComponent(slug)}`;
}

/** 从动态路由段还原数据库 slug */
export function normalizePostSlug(segment: string): string {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}
