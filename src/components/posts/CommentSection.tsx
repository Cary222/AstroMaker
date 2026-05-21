"use client";

import { useActionState } from "react";
import {
  createCommentAction,
  type CreateCommentState,
} from "@/actions/comment";
import { DeleteCommentButton } from "@/components/posts/DeleteCommentButton";
import { canDeleteComment } from "@/lib/permissions";
import type { UserRole } from "@prisma/client";

const initialState: CreateCommentState = {};

type Comment = {
  id: string;
  body: string;
  parentId: string | null;
  createdAt: Date;
  author: { id: string; name: string | null; image: string | null };
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("zh-CN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

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
      <textarea
        name="body"
        required
        rows={3}
        placeholder="写下你的评论…"
        className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-accent"
      />
      {state.errors?.body && (
        <p className="text-sm text-red-400">{state.errors.body[0]}</p>
      )}
      {state.errors?._form && (
        <p className="text-sm text-red-400">{state.errors._form[0]}</p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-accent px-4 py-1.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "发送中…" : "发表评论"}
      </button>
    </form>
  );
}

export function CommentSection({
  postId,
  postSlug,
  comments,
  isLoggedIn,
  currentUserId,
  userRole,
}: {
  postId: string;
  postSlug: string;
  comments: Comment[];
  isLoggedIn: boolean;
  currentUserId?: string;
  userRole?: UserRole;
}) {
  return (
    <section className="mt-8 space-y-4">
      <h2 className="text-lg font-semibold">评论 ({comments.length})</h2>

      {isLoggedIn ? (
        <div className="rounded-xl border border-border bg-card p-4">
          <CommentForm postId={postId} />
        </div>
      ) : (
        <p className="text-sm text-muted">
          <a href="/login" className="text-accent hover:underline">
            登录
          </a>{" "}
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
              <div className="mb-1 flex items-center gap-2 text-xs text-muted">
                <span className="font-medium text-foreground">
                  {comment.author.name ?? "匿名"}
                </span>
                <time dateTime={comment.createdAt.toISOString()}>
                  {formatDate(comment.createdAt)}
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
          <p className="text-sm text-muted">暂无评论，来抢沙发吧。</p>
        )}
      </div>
    </section>
  );
}
