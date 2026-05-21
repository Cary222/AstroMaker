"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { searchTopics, type TopicData } from "@/actions/topic";

type TopicInputProps = {
  value: string[];
  onChange: (tags: string[]) => void;
  maxTags?: number;
  placeholder?: string;
};

function CloseIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export function TopicInput({
  value,
  onChange,
  maxTags = 5,
  placeholder = "添加标签...",
}: TopicInputProps) {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<TopicData[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Search topics with debounce
  useEffect(() => {
    if (!input.trim()) {
      setSuggestions([]);
      return;
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const results = await searchTopics(input);
        // Filter out already selected tags
        setSuggestions(results.filter((t) => !value.includes(t.name)));
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [input, value]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const addTag = useCallback(
    (tagName: string) => {
      if (value.length >= maxTags) return;
      if (value.includes(tagName)) return;

      onChange([...value, tagName]);
      setInput("");
      setSuggestions([]);
      setShowDropdown(false);
      inputRef.current?.focus();
    },
    [value, maxTags, onChange]
  );

  const removeTag = useCallback(
    (tagName: string) => {
      onChange(value.filter((t) => t !== tagName));
    },
    [value, onChange]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const tag = input.trim();
      if (tag && !value.includes(tag)) {
        addTag(tag);
      }
    } else if (e.key === "Backspace" && !input && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">标签（可选，最多 {maxTags} 个）</label>

      <div className="relative">
        {/* Selected tags */}
        <div className="flex flex-wrap gap-2 p-2 min-h-[42px] border rounded-md bg-background">
          {value.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2 py-1 text-sm rounded-md bg-primary/10 text-primary"
            >
              #{tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="hover:text-destructive"
              >
                <CloseIcon />
              </button>
            </span>
          ))}
          {value.length < maxTags && (
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              onKeyDown={handleKeyDown}
              placeholder={value.length === 0 ? placeholder : ""}
              className="flex-1 min-w-[120px] bg-transparent outline-none text-sm placeholder:text-muted-foreground"
            />
          )}
        </div>

        {/* Dropdown */}
        {showDropdown && (suggestions.length > 0 || loading || input) && (
          <div
            ref={dropdownRef}
            className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-lg max-h-60 overflow-y-auto"
          >
            {loading && (
              <div className="px-3 py-2 text-sm text-muted-foreground">
                搜索中...
              </div>
            )}
            {!loading && suggestions.length === 0 && input && (
              <div className="px-3 py-2">
                <button
                  type="button"
                  onClick={() => addTag(input.trim())}
                  className="text-sm text-primary hover:underline"
                >
                  创建标签 &quot;#{input.trim()}&quot;
                </button>
              </div>
            )}
            {suggestions.map((topic) => (
              <button
                key={topic.id}
                type="button"
                onClick={() => addTag(topic.name)}
                className="w-full px-3 py-2 text-left text-sm hover:bg-accent flex items-center justify-between"
              >
                <span>#{topic.name}</span>
                <span className="text-xs text-muted-foreground">
                  {topic.posts} 帖子
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        输入后按 Enter 或逗号添加，最多 {maxTags} 个标签
      </p>
    </div>
  );
}
