import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getAdminPosts } from "@/lib/posts";
import { postPath } from "@/lib/slug";
import { isModerator } from "@/lib/permissions";
import { DeletePostButton } from "@/components/posts/DeletePostButton";

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user || !isModerator(session.user.role)) {
    redirect("/");
  }

  const posts = await getAdminPosts();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">管理后台</h1>
        <p className="mt-1 text-sm text-muted">
          角色：{session.user.role} · 可删除任意帖子
        </p>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <Link
          href="/admin"
          style={{
            padding: "7px 16px",
            borderRadius: 8,
            background: "var(--color-accent)",
            color: "white",
            fontSize: "0.875rem",
            fontWeight: 600,
            textDecoration: "none",
            border: "1px solid var(--color-accent)",
          }}
        >
          帖子管理
        </Link>
        <Link
          href="/admin/users"
          style={{
            padding: "7px 16px",
            borderRadius: 8,
            background: "var(--color-card-hover)",
            color: "var(--color-foreground)",
            fontSize: "0.875rem",
            fontWeight: 600,
            textDecoration: "none",
            border: "1px solid var(--color-border)",
          }}
        >
          用户管理
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-border">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-card text-muted">
            <tr>
              <th className="px-4 py-3">标题</th>
              <th className="px-4 py-3">作者</th>
              <th className="px-4 py-3">评论</th>
              <th className="px-4 py-3">操作</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr
                key={post.id}
                className="border-b border-border/60 last:border-0"
              >
                <td className="px-4 py-3">
                  <Link
                    href={postPath(post.slug)}
                    className="hover:text-accent"
                  >
                    {post.title}
                  </Link>
                </td>
                <td className="px-4 py-3 text-muted">
                  {post.author.name ?? post.author.email}
                </td>
                <td className="px-4 py-3 text-muted">
                  {post._count.comments}
                </td>
                <td className="px-4 py-3">
                  <DeletePostButton postId={post.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {posts.length === 0 && (
          <p className="px-4 py-8 text-center text-muted">暂无帖子</p>
        )}
      </div>

      <p className="text-xs text-muted">
        提升管理员：在服务器执行{" "}
        <code className="rounded bg-card px-1">
          npm run db:promote-admin -- 你的邮箱
        </code>
      </p>
    </div>
  );
}
