"use client";

import { useTransition } from "react";
import { deleteCommentAction } from "@/actions/moderation";
import { Button } from "@/components/ui/button";

export function DeleteCommentButton({
  commentId,
  postSlug,
}: {
  commentId: string;
  postSlug: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await deleteCommentAction(commentId, postSlug);
        })
      }
      className="mt-1 h-auto text-xs text-destructive hover:text-destructive"
    >
      {pending ? "删除中…" : "删除"}
    </Button>
  );
}
