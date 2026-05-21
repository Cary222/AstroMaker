import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { getPostBySlug } from "@/lib/posts";
import { MarkdownBody } from "@/components/posts/MarkdownBody";
import { CommentSection } from "@/components/posts/CommentSection";
import { DeletePostButton } from "@/components/posts/DeletePostButton";
import { canDeletePost } from "@/lib/permissions";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("zh-CN", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(date);
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [post, session] = await Promise.all([getPostBySlug(slug), auth()]);

  if (!post) notFound();

  return (
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
            {formatDate(post.createdAt)}
          </time>
        </div>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h1 className="text-2xl font-bold">{post.title}</h1>
          {session?.user &&
            canDeletePost(
              session.user.role,
              session.user.id,
              post.authorId,
            ) && <DeletePostButton postId={post.id} />}
        </div>
      </header>

      <div className="rounded-2xl border border-border bg-card p-6">
        <MarkdownBody content={post.body} />
      </div>

      <CommentSection
        postId={post.id}
        postSlug={post.slug}
        comments={post.comments}
        isLoggedIn={!!session?.user}
        currentUserId={session?.user?.id}
        userRole={session?.user?.role}
      />
    </article>
  );
}
