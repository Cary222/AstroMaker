import Link from "next/link";
import type { getLatestPosts } from "@/lib/posts";
import { postPath } from "@/lib/slug";

type Post = Awaited<ReturnType<typeof getLatestPosts>>[number];

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("zh-CN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function PostCard({ post }: { post: Post }) {
  return (
    <article className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-accent/40">
      <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-muted">
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
        <span>·</span>
        <span>{post._count.comments} 条评论</span>
      </div>
      <h2 className="text-lg font-semibold">
        <Link href={postPath(post.slug)} className="hover:text-accent">
          {post.title}
        </Link>
      </h2>
      <p className="mt-2 line-clamp-2 text-sm text-muted">{post.body}</p>
    </article>
  );
}
