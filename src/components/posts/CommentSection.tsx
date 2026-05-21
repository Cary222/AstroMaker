"use client";

import { useState, useCallback } from "react";
import { useActionState } from "react";
import Link from "next/link";
import {
  createCommentAction,
  type CreateCommentState,
} from "@/actions/comment";
import { DeleteCommentButton } from "@/components/ui/DeleteButton";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "@/lib/date";
import { canDeleteComment } from "@/lib/permissions";
import type { UserRole } from ".prisma/client";

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
    <form action={formAction} className="comment-form">
      <input type="hidden" name="postId" value={postId} />
      <Textarea
        name="body"
        required
        rows={3}
        placeholder="写下你的评论…"
        className="comment-textarea"
      />
      {state.errors?.body && (
        <p className="comment-error">{state.errors.body[0]}</p>
      )}
      {state.errors?._form && (
        <p className="comment-error">{state.errors._form[0]}</p>
      )}
      <div className="comment-form-footer">
        <Button type="submit" disabled={pending} className="comment-submit-btn">
          {pending ? "发送中…" : "发表评论"}
        </Button>
      </div>
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
    <section className="comment-section">
      <h2 className="comment-title">评论 ({comments.length})</h2>

      {isLoggedIn ? (
        <div className="comment-form-card">
          <CommentForm postId={postId} />
        </div>
      ) : (
        <div className="comment-login-prompt">
          <Link href="/login" className="comment-login-link">登录</Link>
          后即可评论
        </div>
      )}

      <div className="comment-list">
        {comments.map((comment) => {
          const depth = getDepth(comments, comment);
          return (
            <div
              key={comment.id}
              style={{ marginLeft: `${depth * 1.25}rem` }}
              className="comment-item"
            >
              <div className="comment-header">
                <div className="comment-avatar">
                  {(comment.author.name ?? "A")[0].toUpperCase()}
                </div>
                <div className="comment-meta">
                  <span className="comment-author">
                    {comment.author.name ?? "匿名"}
                  </span>
                  <time className="comment-time" dateTime={new Date(comment.createdAt).toISOString()}>
                    {formatDate(new Date(comment.createdAt))}
                  </time>
                </div>
              </div>
              <p className="comment-body">{comment.body}</p>
              <div className="comment-footer">
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
            </div>
          );
        })}
        {comments.length === 0 && (
          <div className="comment-empty">暂无评论，来抢沙发吧</div>
        )}

        {/* 加载更多 */}
        {hasMore && (
          <div className="comment-load-more">
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="load-more-btn"
            >
              {loadingMore ? "加载中…" : "加载更多评论"}
            </button>
            {loadingError && (
              <p className="load-more-error">{loadingError}</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
