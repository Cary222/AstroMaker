"use client";

import { Feed } from "./Feed";
import type { PostItemData } from "./Feed";

type SearchResultsProps = {
  posts: PostItemData[];
  total: number;
  keyword: string;
};

export function SearchResults({ posts, total, keyword }: SearchResultsProps) {
  if (!keyword) {
    return (
      <div className="feed-container" style={{ padding: "48px 24px", textAlign: "center" }}>
        <div style={{ fontSize: "3rem", marginBottom: 16 }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: "0 auto" }}>
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
        <div style={{ fontSize: "1rem", fontWeight: 600, color: "var(--color-foreground)", marginBottom: 8 }}>
          输入关键词搜索帖子
        </div>
        <div style={{ fontSize: "0.875rem", color: "var(--color-muted)" }}>
          支持标题和正文内容搜索
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="feed-container" style={{ padding: "48px 24px", textAlign: "center" }}>
        <div style={{ fontSize: "3rem", marginBottom: 16 }}>🔍</div>
        <div style={{ fontSize: "1rem", fontWeight: 600, color: "var(--color-foreground)", marginBottom: 8 }}>
          未找到相关帖子
        </div>
        <div style={{ fontSize: "0.875rem", color: "var(--color-muted)" }}>
          尝试更换关键词或检查拼写
        </div>
      </div>
    );
  }

  return (
    <div className="feed-container">
      <div style={{
        padding: "16px 20px",
        borderBottom: "1px solid var(--color-border-light)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <div style={{ fontSize: "0.9375rem", color: "var(--color-muted)" }}>
          找到 <span style={{ fontWeight: 600, color: "var(--color-foreground)" }}>{total}</span> 条相关帖子
        </div>
        <div style={{
          fontSize: "0.75rem",
          color: "var(--color-muted)",
          background: "var(--color-input-bg)",
          padding: "2px 8px",
          borderRadius: 4,
        }}>
          关键词: <span style={{ fontWeight: 500 }}>&quot;{keyword}&quot;</span>
        </div>
      </div>
      <Feed posts={posts} />
    </div>
  );
}
