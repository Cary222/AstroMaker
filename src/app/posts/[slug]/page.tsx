import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { getPostBySlug } from "@/lib/posts";
import { normalizePostSlug, postPath } from "@/lib/slug";
import { formatDate } from "@/lib/date";
import { MarkdownBody } from "@/components/posts/MarkdownBody";
import { CommentSection } from "@/components/posts/CommentSection";
import { DeletePostButton } from "@/components/posts/DeletePostButton";
import { canDeletePost } from "@/lib/permissions";

const EDIT_WINDOW_MS = 24 * 60 * 60 * 1000;

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: slugParam } = await params;
  const slug = normalizePostSlug(slugParam);
  const [post, session] = await Promise.all([getPostBySlug(slug), auth()]);

  if (!post) notFound();

  const isAuthor = session?.user?.id === post.authorId;
  const isEditable =
    isAuthor && Date.now() - post.createdAt.getTime() <= EDIT_WINDOW_MS;

  return (
    <div className="page-grid">
      <div className="col-center">
        <article className="space-y-6">
          <Link href="/" className="text-sm text-muted hover:text-accent">
            ← 返回首页
          </Link>

          <header className="rounded-2xl border border-border bg-card p-6">
            <div className="mb-3 flex flex-wrap items-center gap-2 text-sm text-muted">
              {post.category && (
                <span className="rounded-full bg-background px-2 py-0.5">
                  {post.category.name}
                </span>
              )}
              <span>{post.author.name ?? "匿名"}</span>
              <span>·</span>
              <time dateTime={post.createdAt.toISOString()}>
                {formatDate(post.createdAt, "long")}
              </time>
            </div>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h1 className="text-2xl font-bold">{post.title}</h1>
              <div style={{ display: "flex", gap: 8 }}>
                {isEditable && (
                  <Link
                    href={`/posts/${encodeURIComponent(slug)}/edit`}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      padding: "5px 14px",
                      borderRadius: 8,
                      border: "1px solid var(--color-border)",
                      background: "var(--color-card-hover)",
                      color: "var(--color-foreground)",
                      fontSize: "0.8125rem",
                      fontWeight: 500,
                      textDecoration: "none",
                      cursor: "pointer",
                    }}
                  >
                    <PenIcon />
                    编辑
                  </Link>
                )}
                {session?.user &&
                  canDeletePost(
                    session.user.role,
                    session.user.id,
                    post.authorId,
                  ) && <DeletePostButton postId={post.id} />}
              </div>
            </div>
          </header>

          <div className="rounded-2xl border border-border bg-card p-6">
            <MarkdownBody content={post.body} />
          </div>

          <CommentSection
            postId={post.id}
            postSlug={post.slug}
            initialComments={post.comments}
            isLoggedIn={!!session?.user}
            currentUserId={session?.user?.id}
            userRole={session?.user?.role}
          />
        </article>
      </div>
    </div>
  );
}

function PenIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}
