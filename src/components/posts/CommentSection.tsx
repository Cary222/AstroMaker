"use client";

import { useState, useCallback } from "react";
import { useActionState } from "react";
import Link from "next/link";
import {
  createCommentAction,
  type CreateCommentState,
} from "@/actions/comment";
import { DeleteCommentButton } from "@/components/posts/DeleteCommentButton";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "@/lib/date";
import { canDeleteComment } from "@/lib/permissions";
import type { UserRole } from "@prisma/client";

const initialState: CreateCommentState = {};

type Comment = {
  id: string;
  body: string;
  parentId: string | null;
  createdAt: Date;
  likes: number;
  author: { id: string; name: string | null; image: string | null };
};

function getDepth(comments: Comment[], comment: Comment): number {
  let depth = 0;
  let parentId = comment.parentId;
  while (parentId) {
    depth += 1;
    const parent = comments.find((c) => c.id === parentId);
    parentId = parent?.parentId ?? null;
  }
  return Math.min(depth, 2);
}

function CommentForm({ postId }: { postId: string }) {
  const [state, formAction, pending] = useActionState(
    createCommentAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-2">
      <input type="hidden" name="postId" value={postId} />
      <Textarea
        name="body"
        required
        rows={3}
        placeholder="写下你的评论…"
      />
      {state.errors?.body && (
        <p className="text-sm text-destructive">{state.errors.body[0]}</p>
      )}
      {state.errors?._form && (
        <p className="text-sm text-destructive">{state.errors._form[0]}</p>
      )}
      <Button type="submit" size="sm" disabled={pending}>
        {pending ? "发送中…" : "发表评论"}
      </Button>
    </form>
  );
}

export function CommentSection({
  postId,
  postSlug,
  initialComments,
  isLoggedIn,
  currentUserId,
  userRole,
}: {
  postId: string;
  postSlug: string;
  initialComments: Comment[];
  isLoggedIn: boolean;
  currentUserId?: string;
  userRole?: UserRole;
}) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);

  // Determine if we have more (initial comments may be partial)
  const hasMore = cursor !== null || initialComments.length >= 20;

  const loadMore = useCallback(async () => {
    if (loadingMore) return;
    const lastCursor =
      cursor ??
      (initialComments.length > 0
        ? initialComments[initialComments.length - 1].createdAt.toISOString()
        : null);
    if (!lastCursor) return;

    setLoadingMore(true);
    setLoadingError(null);
    try {
      const params = new URLSearchParams({ postId, cursor: lastCursor });
      const res = await fetch(`/api/comments?${params}`);
      if (!res.ok) throw new Error("加载失败");
      const data = await res.json();
      // Merge new top-level comments and their replies
      const newTopLevel = data.comments.filter(
        (c: Comment) => c.parentId === null,
      );
      const newReplies = data.comments.filter(
        (c: Comment) => c.parentId !== null,
      );
      setComments((prev) => {
        const existingIds = new Set(prev.map((c) => c.id));
        const deduped = [...prev];
        for (const c of newTopLevel) {
          if (!existingIds.has(c.id)) deduped.push(c);
        }
        for (const c of newReplies) {
          if (!existingIds.has(c.id)) deduped.push(c);
        }
        return deduped.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );
      });
      setCursor(data.nextCursor);
    } catch (e) {
      setLoadingError(e instanceof Error ? e.message : "加载失败");
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, cursor, initialComments, postId]);

  return (
    <section className="mt-8 space-y-4">
      <h2 className="text-lg font-semibold">评论 ({comments.length})</h2>

      {isLoggedIn ? (
        <div className="rounded-xl border border-border bg-card p-4">
          <CommentForm postId={postId} />
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          <Link href="/login" className="text-accent hover:underline">
            登录
          </Link>{" "}
          后即可评论。
        </p>
      )}

      <div className="space-y-3">
        {comments.map((comment) => {
          const depth = getDepth(comments, comment);
          return (
            <div
              key={comment.id}
              style={{ marginLeft: `${depth * 1.25}rem` }}
              className="rounded-lg border border-border bg-background/40 p-3"
            >
              <div className="mb-1 flex items-center gap-2 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">
                  {comment.author.name ?? "匿名"}
                </span>
                <time dateTime={new Date(comment.createdAt).toISOString()}>
                  {formatDate(new Date(comment.createdAt))}
                </time>
              </div>
              <p className="whitespace-pre-wrap text-sm">{comment.body}</p>
              {currentUserId &&
                canDeleteComment(
                  userRole,
                  currentUserId,
                  comment.author.id,
                ) && (
                  <DeleteCommentButton
                    commentId={comment.id}
                    postSlug={postSlug}
                  />
                )}
            </div>
          );
        })}
        {comments.length === 0 && (
          <p className="text-sm text-muted-foreground">暂无评论，来抢沙发吧。</p>
        )}

        {/* 加载更多 */}
        {hasMore && (
          <div style={{ textAlign: "center", paddingTop: 12 }}>
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="btn-outline"
              style={{ padding: "6px 20px", fontSize: "0.875rem" }}
            >
              {loadingMore ? "加载中…" : "加载更多评论"}
            </button>
            {loadingError && (
              <p style={{ color: "var(--color-destructive)", marginTop: 8, fontSize: "0.8125rem" }}>
                {loadingError}
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
