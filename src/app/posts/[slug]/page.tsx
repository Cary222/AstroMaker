import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { getPostBySlug } from "@/lib/posts";
import { normalizePostSlug } from "@/lib/slug";
import { formatDate } from "@/lib/date";
import { MarkdownBody } from "@/components/posts/MarkdownBody";
import { CommentSection } from "@/components/posts/CommentSection";
import { DeletePostButton } from "@/components/ui/DeleteButton";
import { canDeletePost, canEditPost } from "@/lib/permissions";

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

  const isEditable =
    canEditPost(session?.user?.role, session?.user?.id, post.authorId) &&
    Date.now() - post.createdAt.getTime() <= EDIT_WINDOW_MS;

  return (
    <div className="post-detail-layout">
      <div className="post-detail-container">
        {/* 返回按钮 */}
        <div className="post-detail-back">
          <Link href="/" className="back-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"/>
              <polyline points="12,19 5,12 12,5"/>
            </svg>
            返回首页
          </Link>
        </div>

        {/* 文章头部卡片 */}
        <article className="post-detail-card">
          <div className="post-detail-header">
            <div className="post-meta-row">
              {post.category && (
                <span className="post-category-badge">
                  {post.category.name}
                </span>
              )}
              <span className="post-author-name">
                {post.author.name ?? "匿名"}
              </span>
              <span className="post-meta-sep">·</span>
              <time className="post-meta-time" dateTime={post.createdAt.toISOString()}>
                {formatDate(post.createdAt, "long")}
              </time>
            </div>
            <h1 className="post-title">{post.title}</h1>
          </div>

          {/* 标签列表 */}
          {post.tags && post.tags.length > 0 && (
            <div className="post-detail-tags">
              {post.tags.map((tagItem) => (
                <Link
                  key={tagItem.topic.id}
                  href={`/tags/${tagItem.topic.slug}`}
                  className="post-detail-tag"
                >
                  #{tagItem.topic.name}
                </Link>
              ))}
            </div>
          )}

          <div className="post-actions-row">
            {isEditable && (
              <Link
                href={`/posts/${encodeURIComponent(slug)}/edit`}
                className="post-action-btn"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9"/>
                  <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
                </svg>
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
        </article>

        {/* 文章内容 */}
        <div className="post-content-card">
          <MarkdownBody content={post.body} />
        </div>

        {/* 图片展示 */}
        {post.images && post.images.length > 0 && (
          <div className="post-images-card">
            <div className="post-images-grid">
              {post.images.map((src, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} src={src} alt={`图片 ${i + 1}`} className="post-detail-image" />
              ))}
            </div>
          </div>
        )}

        {/* 评论区域 */}
        <div className="post-comments-card">
          <CommentSection
            postId={post.id}
            postSlug={post.slug}
            initialComments={post.comments}
            isLoggedIn={!!session?.user}
            currentUserId={session?.user?.id}
            userRole={session?.user?.role}
          />
        </div>
      </div>
    </div>
  );
}
