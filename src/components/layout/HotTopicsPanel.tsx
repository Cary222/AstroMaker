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
      <div className="section-header">
        <div className="sidebar-card-title" style={{ marginBottom: 0 }}>
          <FlameIcon />
          热门讨论
        </div>
        <Link href="/?section=hot" className="section-more">更多</Link>
      </div>
      <div>
        {list.map((topic, index) => (
          <Link
            key={topic.id}
            href={`/?topic=${topic.slug}`}
            className="hot-topic-item"
          >
            <span className={`hot-topic-rank ${
              index === 0 ? "rank-1" :
              index === 1 ? "rank-2" :
              index === 2 ? "rank-3" : "rank-other"
            }`}>
              {index + 1}
            </span>
            <div className="hot-topic-info">
              <div className="hot-topic-name">{topic.name}</div>
              <div className="hot-topic-count">{formatCount(topic.posts)} 帖子</div>
            </div>
            {index < 3 && <span className="hot-badge">HOT</span>}
          </Link>
        ))}
      </div>
    </div>
  );
}

function formatCount(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1) + "k";
  return String(n);
}

function FlameIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--color-orange)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z"/>
    </svg>
  );
}

const MOCK_TOPICS = [
  { id: "1", name: "我的 3D 打印赤道仪支架改造", slug: "3d-equatorial", posts: 1200 },
  { id: "2", name: "大家的星空滤镜怎么选？", slug: "star-filter", posts: 886 },
  { id: "3", name: "ASIAIR Pro 和 NINA 选哪个好？", slug: "asiair-nina", posts: 542 },
  { id: "4", name: "天空背景蓝色的秘密", slug: "sky-blue", posts: 430 },
  { id: "5", name: "新手入门设备搭配建议", slug: "beginner-gear", posts: 388 },
  { id: "6", name: "拍摄马头云雾的极限分享", slug: "horsehead-nebula", posts: 256 },
];
