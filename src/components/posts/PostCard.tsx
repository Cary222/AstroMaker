import Link from "next/link";
import type { getLatestPosts } from "@/lib/posts";
import { postPath } from "@/lib/slug";
import { formatDate } from "@/lib/date";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

type Post = Awaited<ReturnType<typeof getLatestPosts>>[number];

export function PostCard({ post }: { post: Post }) {
  return (
    <Link href={postPath(post.slug)}>
      <Card className="transition-all hover:border-accent/40 hover:bg-accent/5">
        <CardHeader className="pb-2">
          <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            {post.category && (
              <span className="rounded-full bg-muted px-2 py-0.5">
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
          <h2 className="text-lg font-semibold">{post.title}</h2>
        </CardHeader>
        <CardContent>
          <p className="line-clamp-2 text-sm text-muted-foreground">{post.body}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
