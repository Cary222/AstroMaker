"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { deletePostAction } from "@/actions/moderation";
import { deleteCommentAction } from "@/actions/moderation";

interface DeletePostButtonProps {
  postId: string;
  size?: "sm" | "xs";
  children?: React.ReactNode;
  className?: string;
}

interface DeleteCommentButtonProps {
  commentId: string;
  postSlug: string;
  size?: "sm" | "xs";
  children?: React.ReactNode;
  className?: string;
}

export function DeletePostButton({
  postId,
  size = "sm",
  children = "删除",
  className,
}: DeletePostButtonProps) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="outline"
      size={size}
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await deletePostAction(postId);
        })
      }
      className={cn(
        "border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:border-red-300 hover:text-red-700",
        className
      )}
    >
      {children}
    </Button>
  );
}

export function DeleteCommentButton({
  commentId,
  postSlug,
  size = "xs",
  children = "删除",
  className,
}: DeleteCommentButtonProps) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      variant="ghost"
      size={size}
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await deleteCommentAction(commentId, postSlug);
        })
      }
      className={cn(
        "text-red-500 hover:bg-red-50 hover:text-red-600",
        className
      )}
    >
      {children}
    </Button>
  );
}
