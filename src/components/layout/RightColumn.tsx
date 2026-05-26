"use client";

import { useState } from "react";
import { AIChatPanel } from "./AIChatPanel";
import { ShopBOMPanel } from "./ShopBOMPanel";
import { HotTopicsPanel, type TopicData } from "./HotTopicsPanel";

type SuggestedUserData = {
  id: string;
  name: string | null;
  image: string | null;
  bio: string | null;
  followersCount: number;
};

type RightColumnProps = {
  hotTopics?: TopicData[];
  suggestedUsers?: SuggestedUserData[];
};

export function RightColumn({
  hotTopics = [],
  suggestedUsers = [],
}: RightColumnProps) {
  const [messages, setMessages] = useState([
    { role: "assistant" as const, content: "你好！有什么可以帮你的？" },
  ]);
  const [input, setInput] = useState("");

  const handleSend = (text: string) => {
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "这是一个简单的 AI 助手 Demo，后续可接入真实 API（如 Claude / GPT）提供更智能的回答。",
        },
      ]);
    }, 800);
  };

  return (
    <aside className="col-right flex flex-col gap-4">
      <AIChatPanel
        messages={messages}
        input={input}
        onInputChange={setInput}
        onSend={handleSend}
      />
      <ShopBOMPanel />
      <HotTopicsPanel topics={hotTopics} />
    </aside>
  );
}
