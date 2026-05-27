import { auth } from "@/lib/auth";
import { getHotTopics } from "@/actions/topic";
import { getFeedPosts } from "@/actions/feed";
import { LeftColumn } from "@/components/layout/LeftColumn";
import { CenterColumn } from "@/components/layout/CenterColumn";
import { RightColumn } from "@/components/layout/RightColumn";

export default async function HomePage() {
  const [session, hotTopics] = await Promise.all([auth(), getHotTopics()]);

  // Server-side initial posts for SSR + SEO
  const initial = await getFeedPosts({ tab: "latest", limit: 20 });

  return (
    <div className="page-grid">
      <LeftColumn />
      <CenterColumn
        session={session}
        initialPosts={initial.posts}
        initialCursor={initial.nextCursor}
      />
      <RightColumn hotTopics={hotTopics} />
    </div>
  );
}
