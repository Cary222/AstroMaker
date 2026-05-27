import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getPostBySlug } from "@/lib/posts";
import { normalizePostSlug } from "@/lib/slug";
import { getCategories } from "@/lib/posts";
import { EditPostForm } from "@/components/posts/EditPostForm";

const EDIT_WINDOW_MS = 24 * 60 * 60 * 1000;

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: slugParam } = await params;
  const slug = normalizePostSlug(slugParam);
  const [post, session, categories] = await Promise.all([
    getPostBySlug(slug),
    auth(),
    getCategories(),
  ]);

  if (!post) notFound();
  if (!session?.user) redirect("/login");

  // 仅作者可编辑
  if (post.authorId !== session.user.id) redirect(postPath(slug));

  // 超过 24 小时不可编辑
  const age = Date.now() - post.createdAt.getTime();
  if (age > EDIT_WINDOW_MS) redirect(postPath(slug));

  return (
    <div className="page-grid">
      <div className="col-center">
        <div style={{ marginBottom: 8 }}>
          <a
            href={postPath(slug)}
            style={{
              fontSize: "0.875rem",
              color: "var(--color-muted)",
              textDecoration: "none",
            }}
          >
            ← 返回帖子
          </a>
        </div>
        <h1 className="mb-2 text-2xl font-bold">编辑帖子</h1>
        <p className="mb-6 text-muted">发帖 24 小时内可编辑。</p>
        <EditPostForm
          post={{
            id: post.id,
            title: post.title,
            body: post.body,
            categoryId: post.categoryId ?? null,
          }}
          categories={categories}
        />
      </div>
    </div>
  );
}

function postPath(s: string) {
  return `/posts/${encodeURIComponent(s)}`;
}
