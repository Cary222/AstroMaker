"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { togglePinPostAction, toggleFeaturePostAction } from "@/actions/moderation";

type PostModerationActionsProps = {
  postId: string;
  pinned: boolean;
  featured: boolean;
};

export function PostModerationActions({ postId, pinned, featured }: PostModerationActionsProps) {
  const [isPending, startTransition] = useTransition();
  const [isPinned, setIsPinned] = useState(pinned);
  const [isFeatured, setIsFeatured] = useState(featured);

  const handlePin = () => {
    startTransition(async () => {
      const result = await togglePinPostAction(postId);
      if (result.error) {
        toast.error(result.error);
      } else {
        setIsPinned(!isPinned);
        toast.success(!isPinned ? "已置顶" : "已取消置顶");
      }
    });
  };

  const handleFeature = () => {
    startTransition(async () => {
      const result = await toggleFeaturePostAction(postId);
      if (result.error) {
        toast.error(result.error);
      } else {
        setIsFeatured(!isFeatured);
        toast.success(!isFeatured ? "已加精" : "已取消加精");
      }
    });
  };

  return (
    <div style={{ display: "flex", gap: 8 }}>
      <button
        onClick={handlePin}
        disabled={isPending}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          padding: "4px 10px",
          fontSize: "0.75rem",
          fontWeight: 500,
          borderRadius: 4,
          border: isPinned ? "1px solid #ff4d4f" : "1px solid #d9d9d9",
          background: isPinned ? "rgba(255,77,79,0.1)" : "white",
          color: isPinned ? "#ff4d4f" : "#595959",
          cursor: isPending ? "not-allowed" : "pointer",
          opacity: isPending ? 0.6 : 1,
          transition: "all 0.15s",
        }}
      >
        <PinIcon />
        {isPinned ? "取消置顶" : "置顶"}
      </button>
      <button
        onClick={handleFeature}
        disabled={isPending}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          padding: "4px 10px",
          fontSize: "0.75rem",
          fontWeight: 500,
          borderRadius: 4,
          border: isFeatured ? "1px solid #fa8c16" : "1px solid #d9d9d9",
          background: isFeatured ? "rgba(250,140,22,0.1)" : "white",
          color: isFeatured ? "#fa8c16" : "#595959",
          cursor: isPending ? "not-allowed" : "pointer",
          opacity: isPending ? 0.6 : 1,
          transition: "all 0.15s",
        }}
      >
        <StarIcon />
        {isFeatured ? "取消加精" : "加精"}
      </button>
    </div>
  );
}

function PinIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="17" x2="12" y2="22"/>
      <path d="M5 17h14v-1.76a2 2 0 00-1.11-1.79l-1.78-.9A2 2 0 0115 10.76V6h1a2 2 0 000-4H8a2 2 0 000 4h1v4.76a2 2 0 01-1.11 1.79l-1.78.9A2 2 0 005 15.24z"/>
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
    </svg>
  );
}
