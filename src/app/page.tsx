import { auth } from "@/lib/auth";
import { getHotTopics } from "@/actions/topic";
import { getLatestPosts } from "@/lib/posts";
import { LeftColumn } from "@/components/layout/LeftColumn";
import { CenterColumn } from "@/components/layout/CenterColumn";
import { RightColumn } from "@/components/layout/RightColumn";

export default async function HomePage() {
  const [session, posts, hotTopics] = await Promise.all([
    auth(),
    getLatestPosts(),
    getHotTopics(),
  ]);

  const postsWithStats = posts.map((p: (typeof posts)[number]) => ({
    ...p,
    views: 0,
    likes: 0,
    reposts: 0,
    images: [] as string[],
  }));

  return (
    <div className="page-grid">
      <LeftColumn />
      <CenterColumn session={session} posts={postsWithStats} />
      <RightColumn hotTopics={hotTopics} />
    </div>
  );
}
