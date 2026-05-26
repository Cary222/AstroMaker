"use client";

import { useRef, useEffect } from "react";

type Message = { role: "user" | "assistant"; content: string };

type AIChatPanelProps = {
  messages: Message[];
  input: string;
  onInputChange: (v: string) => void;
  onSend: (text: string) => void;
};

export function AIChatPanel({
  messages,
  input,
  onInputChange,
  onSend,
}: AIChatPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="sidebar-card" style={{ display: "flex", flexDirection: "column", height: 260 }}>
      <div className="section-header" style={{ marginBottom: 10 }}>
        <div className="sidebar-card-title" style={{ marginBottom: 0 }}>
          <AIIcon />
          AI 天文助手
        </div>
        <span style={{
          fontSize: "0.6875rem",
          background: "linear-gradient(90deg, var(--color-accent), var(--color-purple))",
          color: "white",
          borderRadius: 4,
          padding: "1px 6px",
          fontWeight: 600,
        }}>
          BETA
        </span>
      </div>
      <div
        ref={scrollRef}
        style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8 }}
      >
        {messages.map((m, i) => (
          <div key={i} style={{ textAlign: m.role === "user" ? "right" : "left" }}>
            <span
              style={{
                display: "inline-block",
                maxWidth: "85%",
                borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                padding: "7px 12px",
                fontSize: "0.8125rem",
                lineHeight: 1.5,
                background: m.role === "user"
                  ? "var(--color-accent)"
                  : "var(--color-input-bg)",
                color: m.role === "user" ? "white" : "var(--color-foreground)",
                border: m.role === "user" ? "none" : "1px solid var(--color-border)",
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 10, display: "flex", gap: 6 }}>
        <input
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && input.trim()) {
              onSend(input.trim());
              onInputChange("");
            }
          }}
          placeholder="问问天文问题..."
          style={{
            flex: 1,
            borderRadius: 20,
            border: "1px solid var(--color-border)",
            background: "var(--color-input-bg)",
            padding: "6px 14px",
            fontSize: "0.8125rem",
            color: "var(--color-foreground)",
            outline: "none",
          }}
        />
        <button
          onClick={() => {
            if (input.trim()) {
              onSend(input.trim());
              onInputChange("");
            }
          }}
          style={{
            flexShrink: 0,
            borderRadius: 20,
            background: "var(--color-accent)",
            border: "none",
            padding: "6px 14px",
            fontSize: "0.8125rem",
            fontWeight: 600,
            color: "white",
            cursor: "pointer",
            transition: "opacity 0.15s",
          }}
        >
          发送
        </button>
      </div>
    </div>
  );
}

function AIIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
    </svg>
  );
}
