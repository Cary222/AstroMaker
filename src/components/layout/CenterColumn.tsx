import Link from "next/link";
import { Feed } from "@/components/posts/Feed";

type PostItemData = {
  id: string;
  title: string;
  slug: string;
  body: string;
  views: number;
  likes: number;
  reposts: number;
  createdAt: Date;
  images: string[];
  author: {
    id: string;
    name: string | null;
    image: string | null;
  };
  _count: {
    comments: number;
  };
};

type CenterColumnProps = {
  session: Session | null;
  posts: PostItemData[];
};

export async function CenterColumn({ session, posts }: CenterColumnProps) {
  return (
    <div className="col-center flex flex-col gap-4">
      {/* 发帖按钮 */}
      <div className="flex items-center justify-end">
        {session?.user ? (
          <Link
            href="/posts/new"
            className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-90"
          >
            发帖
          </Link>
        ) : (
          <Link
            href="/login"
            className="rounded-full border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:border-accent hover:text-foreground"
          >
            登录后发帖
          </Link>
        )}
      </div>

      <Feed posts={posts} />
    </div>
  );
}
