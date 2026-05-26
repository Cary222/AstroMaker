import Link from "next/link";

export type TopicData = {
  id: string;
  name: string;
  slug: string;
  posts: number;
};

type HotTopicsPanelProps = {
  topics: TopicData[];
};

export function HotTopicsPanel({ topics }: HotTopicsPanelProps) {
  const list = topics.length > 0 ? topics : MOCK_TOPICS;

  return (
    <div className="sidebar-card">
      <div className="sidebar-card-title flex items-center gap-2">
        <img src="/images/trending-icon.svg" alt="Trending" className="h-5 w-5" />
        热门话题
      </div>
      <div className="space-y-3">
        {list.map((topic) => (
          <Link
            key={topic.id}
            href={`/?topic=${topic.slug}`}
            className="block group"
          >
            <div className="text-sm font-medium text-foreground group-hover:text-accent">
              {topic.name}
            </div>
            <div className="text-xs text-muted-foreground">
              {topic.posts} 帖子
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

const MOCK_TOPICS = [
  { id: "1", name: "#Next.js 15 发布#", slug: "nextjs-15", posts: 234 },
  { id: "2", name: "#React 19 新特性#", slug: "react-19", posts: 189 },
  { id: "3", name: "#TypeScript 技巧#", slug: "typescript", posts: 156 },
  { id: "4", name: "#Tailwind CSS#", slug: "tailwind-css", posts: 98 },
  { id: "5", name: "#AI 开发工具#", slug: "ai-tools", posts: 77 },
];
