"use client";

import { useState } from "react";
import { AIChatPanel } from "./AIChatPanel";
import { ShopBOMPanel } from "./ShopBOMPanel";
import { HotTopicsPanel, type TopicData } from "./HotTopicsPanel";
import { SuggestedUsersPanel } from "./SuggestedUsersPanel";

type RightColumnProps = {
  hotTopics?: TopicData[];
};

export function RightColumn({
  hotTopics = [],
}: RightColumnProps) {
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([
    { role: "assistant", content: "你好！我是 AstroMaker AI 助手，有什么天文问题可以问我 🔭" },
  ]);
  const [input, setInput] = useState("");

  const handleSend = (text: string) => {
    setMessages((prev) => [...prev, { role: "user" as const, content: text }]);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant" as const,
          content:
            "这是一个 AI 助手演示，后续将接入真实 AI 提供天文知识解答、设备推荐、拍摄技巧等专业支持。",
        },
      ]);
    }, 800);
  };

  return (
    <aside className="col-right flex flex-col gap-0">
      <AIChatPanel
        messages={messages}
        input={input}
        onInputChange={setInput}
        onSend={handleSend}
      />
      <SuggestedUsersPanel />
      <HotTopicsPanel topics={hotTopics} />
      <ShopBOMPanel />
    </aside>
  );
}
