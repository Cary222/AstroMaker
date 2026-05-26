import { PostItem } from "./PostItem";

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

type FeedProps = {
  posts: PostItemData[];
};

export function Feed({ posts }: FeedProps) {
  return (
    <div className="rounded-xl border border-border bg-card">
      {posts.length === 0 ? (
        <div className="p-10 text-center text-muted-foreground">
          暂无帖子，去发一条吧
        </div>
      ) : (
        posts.map((post) => <PostItem key={post.id} post={post} />)
      )}
    </div>
  );
}
