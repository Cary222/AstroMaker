"use client";

import { useState, useCallback } from "react";
import { Feed } from "@/components/posts/Feed";
import type { FeedPost, FeedTab } from "@/actions/feed";

export function PostFeed({
  initialPosts,
  initialCursor,
}: {
  initialPosts: FeedPost[];
  initialCursor: string | null;
}) {
  const [posts, setPosts] = useState<FeedPost[]>(initialPosts);
  const [cursor, setCursor] = useState<string | null>(initialCursor);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMore = useCallback(async () => {
    if (!cursor || loading) return;
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (cursor) params.set("cursor", cursor);
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
  }, [cursor, loading]);

  return (
    <div>
      <Feed posts={posts} />
      {cursor && (
        <div style={{ padding: "16px", textAlign: "center" }}>
          <button
            onClick={loadMore}
            disabled={loading}
            className="btn-outline"
            style={{ padding: "8px 24px" }}
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
  );
}
