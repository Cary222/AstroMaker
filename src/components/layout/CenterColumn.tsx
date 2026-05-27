"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Feed } from "@/components/posts/Feed";
import type { Session } from "next-auth";
import type { FeedPost, FeedTab } from "@/actions/feed";

type CenterColumnProps = {
  session: Session | null;
  initialPosts: FeedPost[];
  initialCursor: string | null;
  categoryName?: string;
  categorySlug?: string;
};

export function CenterColumn({ session, initialPosts, initialCursor, categoryName, categorySlug }: CenterColumnProps) {
  const [activeTab, setActiveTab] = useState<FeedTab>("latest");
  const [posts, setPosts] = useState<FeedPost[]>(initialPosts);
  const [cursor, setCursor] = useState<string | null>(initialCursor);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTabChange = useCallback(
    async (tab: FeedTab) => {
      if (tab === activeTab) return;
      setActiveTab(tab);
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({ tab, limit: "20" });
        if (categorySlug) params.set("category", categorySlug);
        const res = await fetch(`/api/feed?${params}`);
        if (!res.ok) throw new Error("加载失败");
        const data = await res.json();
        setPosts(data.posts);
        setCursor(data.nextCursor);
      } catch (e) {
        setError(e instanceof Error ? e.message : "加载失败");
      } finally {
        setLoading(false);
      }
    },
    [activeTab, categorySlug],
  );

  const loadMore = useCallback(async () => {
    if (!cursor || loading) return;
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ tab: activeTab, cursor, limit: "20" });
      if (categorySlug) params.set("category", categorySlug);
      const res = await fetch(`/api/feed?${params}`);
      if (!res.ok) throw new Error("加载失败");
      const data = await res.json();
      setPosts((prev) => [...prev, ...data.posts]);
      setCursor(data.nextCursor);
    } catch (e) {
      setError(e instanceof Error ? e.message : "加载失败");
    } finally {
      setLoading(false);
    }
  }, [cursor, loading, activeTab, categorySlug]);

  return (
    <div className="col-center flex flex-col gap-4">
      {/* 分类页头部 */}
      {categoryName ? (
        <div className="feed-container" style={{ padding: "20px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <CategoryIcon />
            <div>
              <h1 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--color-foreground)", margin: 0 }}>
                {categoryName}
              </h1>
              <p style={{ fontSize: "0.875rem", color: "var(--color-muted)", margin: "4px 0 0" }}>
                浏览该分类下的所有帖子
              </p>
            </div>
          </div>
        </div>
      ) : (
      /* Hero 横幅 */
      <div className="hero-banner">
        <div style={{
          position: "absolute",
          right: 20,
          top: "50%",
          transform: "translateY(-50%)",
          width: 120,
          height: 120,
          opacity: 0.35,
          backgroundImage: `radial-gradient(ellipse 60% 40% at 50% 50%, rgba(100,160,255,0.8) 0%, rgba(60,80,180,0.4) 50%, transparent 70%)`,
          borderRadius: "50%",
          filter: "blur(1px)",
        }} />
        <div style={{
          position: "absolute",
          right: 40,
          top: "30%",
          width: 90,
          height: 90,
          opacity: 0.2,
          backgroundImage: `radial-gradient(circle, rgba(200,180,255,0.9) 0%, transparent 70%)`,
          borderRadius: "50%",
        }} />
        <div className="hero-banner-content">
          <div className="hero-banner-title">探索宇宙 · 创造无限</div>
          <div className="hero-banner-subtitle">与天文爱好者一起分享、交流、协作</div>
          {session?.user ? (
            <Link href="/posts/new" className="hero-banner-btn">
              <EditIcon />
              发表帖子
            </Link>
          ) : (
            <Link href="/register" className="hero-banner-btn">
              <StarIcon />
              加入社区
            </Link>
          )}
        </div>
      </div>
      )}

      {/* Tab 导航 + 帖子 Feed */}
      <div className="feed-container">
        {/* Tabs */}
        <div className="feed-tabs">
          {(["hot", "following", "latest"] as FeedTab[]).map((tab) => (
            <button
              key={tab}
              className={`feed-tab${activeTab === tab ? " active" : ""}`}
              onClick={() => handleTabChange(tab)}
            >
              {tab === "hot" ? "热门" : tab === "following" ? "关注" : "最新"}
            </button>
          ))}

          {/* 发帖快捷按钮 */}
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", paddingRight: 12 }}>
            {session?.user ? (
              <Link
                href="/posts/new"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  background: "var(--color-accent)",
                  color: "#fff",
                  borderRadius: 20,
                  padding: "4px 14px",
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  textDecoration: "none",
                  transition: "opacity 0.15s",
                }}
              >
                <PlusIcon />
                发帖
              </Link>
            ) : (
              <Link
                href="/login"
                style={{
                  fontSize: "0.8125rem",
                  color: "var(--color-accent)",
                  fontWeight: 500,
                  textDecoration: "none",
                }}
              >
                登录后发帖
              </Link>
            )}
          </div>
        </div>

        {/* 帖子列表 */}
        {loading && posts.length === 0 ? (
          <div style={{ padding: "32px", textAlign: "center", color: "var(--color-muted)" }}>
            加载中…
          </div>
        ) : (
          <Feed posts={posts} />
        )}

        {/* 加载更多 */}
        {cursor && (
          <div style={{ padding: "14px 18px", textAlign: "center" }}>
            <button
              onClick={loadMore}
              disabled={loading}
              className="btn-outline"
              style={{ padding: "7px 24px" }}
            >
              {loading ? "加载中…" : "加载更多"}
            </button>
            {error && (
              <p style={{ color: "var(--color-destructive)", marginTop: 8, fontSize: "0.875rem" }}>
                {error}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function EditIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  );
}

function CategoryIcon() {
  return (
    <div style={{
      width: 48,
      height: 48,
      borderRadius: 12,
      background: "var(--color-accent-light)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "var(--color-accent)",
    }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
      </svg>
    </div>
  );
}
