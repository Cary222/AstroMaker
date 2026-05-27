"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDate } from "@/lib/date";
import { postPath } from "@/lib/slug";

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

type PostItemProps = {
  post: PostItemData;
};

export function PostItem({ post }: PostItemProps) {
  const [expanded, setExpanded] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [bookmarked, setBookmarked] = useState(false);
  const isLong = post.body.length > 280;

  const displayImages = post.images?.slice(0, 3) ?? [];
  const extraCount = (post.images?.length ?? 0) - 3;

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    setLiked(!liked);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    setBookmarked(!bookmarked);
  };

  return (
    <article className="post-item">
      {/* 左侧头像栏 */}
      <div className="post-item-avatar-col">
        <Link href={`/u/${post.author.id}`}>
          <div className="post-item-avatar">
            {post.author.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={post.author.image}
                alt={post.author.name ?? "用户"}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <span>
                {(post.author.name ?? "U")[0].toUpperCase()}
              </span>
            )}
          </div>
        </Link>
      </div>

      {/* 右侧内容区 */}
      <div className="post-item-body">
        {/* 作者信息行 */}
        <div className="post-item-meta">
          <Link href={`/u/${post.author.id}`} style={{ textDecoration: "none" }}>
            <span className="post-item-author-name">
              {post.author.name ?? "匿名用户"}
            </span>
          </Link>
          <span className="post-item-badge">作者</span>
          <span className="post-item-author-handle">
            @{(post.author.name ?? "anonymous").toLowerCase().replace(/\s+/g, "_")}
          </span>
          <span style={{ color: "var(--color-border)" }}>·</span>
          <time className="post-item-time" dateTime={post.createdAt.toISOString()}>
            {formatDate(post.createdAt)}
          </time>
          {/* 右侧分享按钮 */}
          <div style={{ marginLeft: "auto" }}>
            <button
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--color-muted)",
                padding: "2px 4px",
                borderRadius: 4,
                fontSize: "0.75rem",
                display: "flex",
                alignItems: "center",
                gap: 3,
              }}
            >
              <ShareIcon />
              作品分享
            </button>
          </div>
        </div>

        {/* 帖子标题 */}
        <Link href={postPath(post.slug)} style={{ textDecoration: "none" }}>
          <h2 style={{
            marginBottom: 6,
            fontSize: "1rem",
            fontWeight: 700,
            color: "var(--color-foreground)",
            lineHeight: 1.45,
            transition: "color 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-accent)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-foreground)")}
          >
            {post.title}
          </h2>
        </Link>

        {/* 置顶/加精标记 */}
        {(post.pinned || post.featured) && (
          <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
            {post.pinned && (
              <span style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 3,
                fontSize: "0.6875rem",
                fontWeight: 600,
                color: "#ff4d4f",
                background: "rgba(255,77,79,0.1)",
                padding: "1px 6px",
                borderRadius: 4,
              }}>
                <PinIcon />
                置顶
              </span>
            )}
            {post.featured && (
              <span style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 3,
                fontSize: "0.6875rem",
                fontWeight: 600,
                color: "#fa8c16",
                background: "rgba(250,140,22,0.1)",
                padding: "1px 6px",
                borderRadius: 4,
              }}>
                <StarSmallIcon />
                加精
              </span>
            )}
          </div>
        )}

        {/* 帖子正文 */}
        <div className={`post-item-content${isLong && !expanded ? " collapsed" : ""}`}>
          {post.body}
        </div>
        {isLong && (
          <button
            className="post-item-expand"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "收起" : "展开更多"}
          </button>
        )}

        {/* 图片网格 */}
        {displayImages.length > 0 && (
          <div className={`post-item-images${
            displayImages.length === 1 ? " cols-1" :
            displayImages.length === 2 ? " cols-2" : ""
          }`}>
            {displayImages.map((src, i) => {
              const isLast = i === 2 && extraCount > 0;
              return (
                <div key={i} className={isLast ? "post-item-image-more" : ""}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={`图片 ${i + 1}`} />
                  {isLast && (
                    <div className="post-item-image-more-overlay">
                      +{extraCount}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* 标签列表 */}
        {post.tags && post.tags.length > 0 && (
          <div className="post-item-tags">
            {post.tags.map((tagItem) => (
              <Link
                key={tagItem.topic.id}
                href={`/tags/${tagItem.topic.slug}`}
                className="post-item-tag"
              >
                #{tagItem.topic.name}
              </Link>
            ))}
          </div>
        )}

        {/* 互动栏 */}
        <div className="post-item-actions">
          {/* 评论 */}
          <Link href={postPath(post.slug)} className="post-item-action-btn">
            <CommentIcon />
            <span>{post._count.comments || ""}</span>
          </Link>
          {/* 转发 */}
          <button className="post-item-action-btn">
            <RepostIcon />
            <span>{post.reposts || ""}</span>
          </button>
          {/* 点赞 */}
          <button
            className={`post-item-action-btn${liked ? " liked" : ""}`}
            onClick={handleLike}
          >
            <HeartIcon filled={liked} />
            <span>{likeCount || ""}</span>
          </button>
          {/* 浏览量 */}
          <button className="post-item-action-btn">
            <EyeIcon />
            <span>{post.views || ""}</span>
          </button>
          {/* 收藏 */}
          <button
            className={`post-item-action-btn${bookmarked ? " bookmarked" : ""}`}
            onClick={handleBookmark}
          >
            <BookmarkIcon filled={bookmarked} />
          </button>
        </div>
      </div>
    </article>
  );
}

function CommentIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  );
}

function RepostIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="17,1 21,5 17,9" />
      <path d="M3 11V9a4 4 0 014-4h14" />
      <polyline points="7,23 3,19 7,15" />
      <path d="M21 13v2a4 4 0 01-4 4H3" />
    </svg>
  );
}

function HeartIcon({ filled }: { filled?: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function BookmarkIcon({ filled }: { filled?: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3"/>
      <circle cx="6" cy="12" r="3"/>
      <circle cx="18" cy="19" r="3"/>
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M12 2L12 22M12 2L8 6M12 2L16 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function StarSmallIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
    </svg>
  );
}
