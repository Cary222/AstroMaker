"use client";

import { useState } from "react";
import Link from "next/link";
import { Feed } from "@/components/posts/Feed";
import type { Session } from "next-auth";

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

export function CenterColumn({ session, posts }: CenterColumnProps) {
  const [activeTab, setActiveTab] = useState<"hot" | "following" | "latest">("hot");

  return (
    <div className="col-center flex flex-col gap-4">

      {/* Hero 横幅 */}
      <div className="hero-banner">
        {/* 星系装饰图 */}
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

      {/* Tab 导航 + 帖子 Feed */}
      <div className="feed-container">
        {/* Tabs */}
        <div className="feed-tabs">
          <button
            className={`feed-tab${activeTab === "hot" ? " active" : ""}`}
            onClick={() => setActiveTab("hot")}
          >
            热门
          </button>
          <button
            className={`feed-tab${activeTab === "following" ? " active" : ""}`}
            onClick={() => setActiveTab("following")}
          >
            关注
          </button>
          <button
            className={`feed-tab${activeTab === "latest" ? " active" : ""}`}
            onClick={() => setActiveTab("latest")}
          >
            最新
          </button>

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
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
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
        <Feed posts={posts} />
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
