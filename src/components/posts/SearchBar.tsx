"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

type SearchBarProps = {
  initialValue?: string;
};

export function SearchBar({ initialValue = "" }: SearchBarProps) {
  const [value, setValue] = useState(initialValue);
  const router = useRouter();

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = value.trim();
      if (trimmed) {
        router.push(`/search?q=${encodeURIComponent(trimmed)}`);
      }
    },
    [value, router],
  );

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", gap: 12 }}>
      <div style={{ position: "relative", flex: 1 }}>
        <SearchIcon />
        <input
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="搜索帖子标题或内容..."
          style={{
            width: "100%",
            padding: "10px 12px 10px 38px",
            border: "1px solid var(--color-border)",
            borderRadius: 8,
            fontSize: "0.9375rem",
            background: "var(--color-input-bg)",
            color: "var(--color-foreground)",
            outline: "none",
            transition: "border-color 0.15s, box-shadow 0.15s",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "var(--color-accent)";
            e.target.style.boxShadow = "0 0 0 3px var(--color-accent-light)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "var(--color-border)";
            e.target.style.boxShadow = "none";
          }}
        />
      </div>
      <button
        type="submit"
        style={{
          padding: "10px 20px",
          background: "var(--color-accent)",
          color: "white",
          border: "none",
          borderRadius: 8,
          fontSize: "0.9375rem",
          fontWeight: 600,
          cursor: "pointer",
          transition: "opacity 0.15s",
        }}
        onMouseOver={(e) => (e.currentTarget.style.opacity = "0.9")}
        onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
      >
        搜索
      </button>
    </form>
  );
}

function SearchIcon() {
  return (
    <svg
      style={{
        position: "absolute",
        left: 12,
        top: "50%",
        transform: "translateY(-50%)",
        color: "var(--color-muted)",
      }}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
