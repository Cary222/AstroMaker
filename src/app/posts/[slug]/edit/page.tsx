import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getPostBySlug, getCategories } from "@/lib/posts";
import { EditPostForm } from "@/components/posts/EditPostForm";
import { normalizePostSlug, postPath } from "@/lib/slug";

const EDIT_WINDOW_MS = 24 * 60 * 60 * 1000;

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: slugParam } = await params;
  const slug = normalizePostSlug(slugParam);
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  const session = await auth();
  if (!session?.user) redirect("/login");

  if (post.authorId !== session.user.id) redirect(postPath(post.slug));

  const age = Date.now() - post.createdAt.getTime();
  if (age > EDIT_WINDOW_MS) redirect(postPath(post.slug));

  const categories = await getCategories();

  return (
    <div className="edit-post-layout">
      <div className="edit-post-container">
        {/* 返回按钮 */}
        <div className="edit-post-back">
          <a href={postPath(post.slug)} className="back-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"/>
              <polyline points="12,19 5,12 12,5"/>
            </svg>
            返回帖子
          </a>
        </div>

        {/* 编辑表单卡片 */}
        <div className="edit-post-card">
          <div className="edit-post-header">
            <h1 className="edit-post-title">编辑帖子</h1>
            <p className="edit-post-subtitle">发帖 24 小时内可编辑</p>
          </div>

          <EditPostForm
            post={{
              id: post.id,
              title: post.title,
              body: post.body,
              categoryId: post.categoryId ?? null,
              images: post.images || [],
              tags: post.tags ?? [],
            }}
            categories={categories}
          />
        </div>
      </div>
    </div>
  );
}
