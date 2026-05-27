import { PostItem } from "./PostItem";

export type PostItemData = {
  id: string;
  title: string;
  slug: string;
  body: string;
  views: number;
  likes: number;
  reposts: number;
  createdAt: Date;
  images: string[];
  pinned: boolean;
  featured: boolean;
  author: {
    id: string;
    name: string | null;
    image: string | null;
  };
  category?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  tags?: Array<{
    topic: {
      id: string;
      name: string;
      slug: string;
    };
  }>;
  _count: {
    comments: number;
  };
};

type FeedProps = {
  posts: PostItemData[];
};

export function Feed({ posts }: FeedProps) {
  return (
    <div>
      {posts.length === 0 ? (
        <div style={{
          padding: "48px 24px",
          textAlign: "center",
          color: "var(--color-muted)",
        }}>
          <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>🔭</div>
          <div style={{ fontSize: "0.9375rem", fontWeight: 600, marginBottom: 6, color: "var(--color-foreground)" }}>
            暂无帖子
          </div>
          <div style={{ fontSize: "0.875rem" }}>
            成为第一个发帖的星空探索者吧！
          </div>
        </div>
      ) : (
        posts.map((post) => <PostItem key={post.id} post={post} />)
      )}
    </div>
  );
}
