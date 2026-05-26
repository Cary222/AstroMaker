"use client";

import { useState } from "react";

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
  return (
    <div className="sidebar-card flex flex-col" style={{ height: 300 }}>
      <div className="sidebar-card-title flex items-center gap-2">
        <img src="/images/ai-icon.svg" alt="AI" className="h-5 w-5" />
        AI 助手
      </div>
      <div className="flex-1 space-y-2 overflow-y-auto text-sm">
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
            <span
              className={`inline-block max-w-[85%] rounded-xl px-3 py-1.5 ${
                m.role === "user"
                  ? "bg-accent text-white"
                  : "bg-input-bg text-foreground"
              }`}
            >
              {m.content}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <input
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && input.trim()) onSend(input.trim());
          }}
          placeholder="问点什么..."
          className="flex-1 rounded-lg border border-border bg-input-bg px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
        />
        <button
          onClick={() => input.trim() && onSend(input.trim())}
          className="shrink-0 rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          发送
        </button>
      </div>
    </div>
  );
}
