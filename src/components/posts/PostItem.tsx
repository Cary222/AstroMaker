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
  author: {
    id: string;
    name: string | null;
    image: string | null;
  };
  _count: {
    comments: number;
  };
};

type PostItemProps = {
  post: PostItemData;
};

export function PostItem({ post }: PostItemProps) {
  const [expanded, setExpanded] = useState(false);
  const isLong = post.body.length > 280;

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
                className="post-item-avatar"
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
        {/* 作者信息 */}
        <div className="post-item-meta">
          <span className="post-item-author-name">
            {post.author.name ?? "匿名用户"}
          </span>
          <span className="post-item-author-handle">@{(post.author.name ?? "anonymous").toLowerCase().replace(/\s+/g, "_")}</span>
          <span>·</span>
          <time className="post-item-time" dateTime={post.createdAt.toISOString()}>
            {formatDate(post.createdAt)}
          </time>
        </div>

        {/* 帖子标题 */}
        <Link href={postPath(post.slug)}>
          <h2 className="mb-2 text-base font-semibold text-foreground hover:text-accent">
            {post.title}
          </h2>
        </Link>

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
        {post.images && post.images.length > 0 && (
          <div className={`post-item-images${post.images.length === 1 ? " cols-1" : ""}`}>
            {post.images.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={src} alt={`图片 ${i + 1}`} />
            ))}
          </div>
        )}

        {/* 互动栏 */}
        <div className="post-item-actions">
          <Link href={postPath(post.slug)} className="post-item-action-btn">
            <CommentIcon />
            <span>{post._count.comments}</span>
          </Link>
          <button className="post-item-action-btn">
            <RepostIcon />
            <span>{post.reposts}</span>
          </button>
          <button className="post-item-action-btn">
            <HeartIcon />
            <span>{post.likes}</span>
          </button>
          <button className="post-item-action-btn">
            <EyeIcon />
            <span>{post.views}</span>
          </button>
        </div>
      </div>
    </article>
  );
}

function CommentIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  );
}

function RepostIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="17,1 21,5 17,9" />
      <path d="M3 11V9a4 4 0 014-4h14" />
      <polyline points="7,23 3,19 7,15" />
      <path d="M21 13v2a4 4 0 01-4 4H3" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
