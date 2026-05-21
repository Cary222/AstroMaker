"use client";

import { useTransition } from "react";
import { deleteCommentAction } from "@/actions/moderation";

export function DeleteCommentButton({
  commentId,
  postSlug,
}: {
  commentId: string;
  postSlug: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await deleteCommentAction(commentId, postSlug);
        })
      }
      className="mt-1 text-xs text-red-400 hover:text-red-300 disabled:opacity-50"
    >
      {pending ? "删除中…" : "删除"}
    </button>
  );
}
