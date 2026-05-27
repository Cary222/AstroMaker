"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { markAsReadAction, markAllAsReadAction } from "@/actions/notification";
import { formatDate } from "@/lib/date";
import type { NotificationItem } from "@/actions/notification";

export function NotificationPanel({
  initialCount,
}: {
  initialCount: number;
}) {
  const [count, setCount] = useState(initialCount);
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  const loadNotifications = useCallback(async () => {
    if (hasLoaded) return;
    setLoading(true);
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications ?? []);
        setHasLoaded(true);
      }
    } finally {
      setLoading(false);
    }
  }, [hasLoaded]);

  const toggleOpen = async () => {
    if (!open) {
      await loadNotifications();
    }
    setOpen((v) => !v);
  };

  const handleMarkAllRead = async () => {
    await markAllAsReadAction();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setCount(0);
  };

  const handleMarkOneRead = async (id: string) => {
    await markAsReadAction(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
    setCount((c) => Math.max(0, c - 1));
  };

  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={toggleOpen}
        className="relative flex h-8 w-8 items-center justify-center rounded-full text-[var(--color-muted)] hover:bg-[var(--color-card-hover)] hover:text-[var(--color-foreground)] transition-colors"
        title="通知"
      >
        <BellIcon />
        {count > 0 && (
          <span
            style={{
              position: "absolute",
              top: 4,
              right: 4,
              minWidth: 16,
              height: 16,
              borderRadius: 9999,
              background: "#ff4d4f",
              color: "white",
              fontSize: "0.625rem",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 4px",
              lineHeight: 1,
            }}
          >
            {count > 99 ? "99+" : count}
          </span>
        )}
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            style={{ position: "fixed", inset: 0, zIndex: 40 }}
            onClick={() => setOpen(false)}
          />

          {/* Dropdown */}
          <div
            style={{
              position: "absolute",
              right: 0,
              top: "calc(100% + 8px)",
              width: 340,
              background: "var(--color-card)",
              border: "1px solid var(--color-border)",
              borderRadius: 12,
              boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
              zIndex: 50,
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 16px",
                borderBottom: "1px solid var(--color-border)",
              }}
            >
              <span style={{ fontWeight: 700, fontSize: "0.9375rem", color: "var(--color-foreground)" }}>
                通知
              </span>
              {unread > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--color-accent)",
                    fontSize: "0.8125rem",
                    cursor: "pointer",
                  }}
                >
                  全部已读
                </button>
              )}
            </div>

            {/* List */}
            <div style={{ maxHeight: 400, overflowY: "auto" }}>
              {loading ? (
                <div style={{ padding: "24px", textAlign: "center", color: "var(--color-muted)", fontSize: "0.875rem" }}>
                  加载中…
                </div>
              ) : notifications.length === 0 ? (
                <div style={{ padding: "32px 16px", textAlign: "center", color: "var(--color-muted)" }}>
                  <div style={{ fontSize: "2rem", marginBottom: 8 }}>🔔</div>
                  <div style={{ fontSize: "0.875rem" }}>暂无通知</div>
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                      padding: "12px 16px",
                      borderBottom: "1px solid var(--color-border-light)",
                      background: n.read ? "transparent" : "rgba(22,119,255,0.04)",
                      transition: "background 0.15s",
                    }}
                    onClick={() => !n.read && handleMarkOneRead(n.id)}
                  >
                    {/* Avatar */}
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, var(--color-accent), var(--color-purple))",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontWeight: 700,
                        fontSize: "0.875rem",
                        flexShrink: 0,
                      }}
                    >
                      {n.actor?.name?.[0]?.toUpperCase() ?? "U"}
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: "0.875rem",
                          color: "var(--color-foreground)",
                          lineHeight: 1.45,
                          fontWeight: n.read ? 400 : 600,
                        }}
                      >
                        {n.content}
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "var(--color-muted)", marginTop: 3 }}>
                        {formatDate(new Date(n.createdAt))}
                      </div>
                    </div>

                    {/* Unread dot */}
                    {!n.read && (
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: "var(--color-accent)",
                          flexShrink: 0,
                          marginTop: 6,
                        }}
                      />
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div
              style={{
                padding: "10px 16px",
                borderTop: "1px solid var(--color-border)",
                textAlign: "center",
              }}
            >
              <Link
                href="/notifications"
                style={{
                  fontSize: "0.8125rem",
                  color: "var(--color-accent)",
                  textDecoration: "none",
                }}
              >
                查看全部通知
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function BellIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 01-3.46 0"/>
    </svg>
  );
}
