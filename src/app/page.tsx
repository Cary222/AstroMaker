import Link from "next/link";
import { auth } from "@/lib/auth";
import { getLatestPosts } from "@/lib/posts";
import { PostCard } from "@/components/posts/PostCard";

export default async function HomePage() {
  const [session, posts] = await Promise.all([auth(), getLatestPosts()]);

  return (
    <div className="space-y-6">
      <section className="flex flex-wrap items-end justify-between gap-4 rounded-2xl border border-border bg-card p-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">社区动态</h1>
          <p className="mt-1 text-muted">最新帖子与讨论</p>
        </div>
        {session?.user ? (
          <Link
            href="/posts/new"
            className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            发帖
          </Link>
        ) : (
          <Link
            href="/login"
            className="rounded-full border border-border px-5 py-2 text-sm font-medium hover:bg-background"
          >
            登录后发帖
          </Link>
        )}
      </section>

      {posts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-10 text-center text-muted">
          <p>还没有帖子。</p>
          {session?.user ? (
            <Link
              href="/posts/new"
              className="mt-3 inline-block text-accent hover:underline"
            >
              发布第一篇 →
            </Link>
          ) : (
            <p className="mt-2 text-sm">
              先{" "}
              <Link href="/register" className="text-accent hover:underline">
                注册
              </Link>{" "}
              账号吧。
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
