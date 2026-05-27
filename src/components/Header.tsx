"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { ThemeToggle } from "@/components/ThemeToggle";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { NotificationPanel } from "@/components/layout/NotificationPanel";
import type { Session } from "next-auth";

export function Header({
  session,
  initialUnreadCount = 0,
}: {
  session: Session | null;
  initialUnreadCount?: number;
}) {
  const [unreadCount, setUnreadCount] = useState(initialUnreadCount);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    if (!session?.user) return;
    const fetchCount = async () => {
      try {
        const res = await fetch("/api/notifications/unread-count");
        if (res.ok) {
          const data = await res.json();
          setUnreadCount(data.count ?? 0);
        }
      } catch {
        // ignore
      }
    };
    fetchCount();
    // Poll every 30 seconds
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, [session?.user, initialUnreadCount]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--color-border)] bg-[var(--color-card)]/95 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex h-14 max-w-[1280px] items-center gap-4 px-4">

        {/* 左：Logo + 品牌名 */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-accent)] text-white shadow-sm">
            <TelescopeIcon />
          </div>
          <span className="hidden font-bold text-[var(--color-foreground)] text-base sm:block">
            AstroMaker
          </span>
        </Link>

        {/* 中：主导航 (lg 及以上显示) */}
        <nav className="hidden lg:flex items-center gap-1 ml-4">
          <Link href="/" className="header-nav-link">首页</Link>
          <Link href="/?category=discover" className="header-nav-link">发现</Link>
          <Link href="/?category=shop" className="header-nav-link">商城</Link>
          <Link href="/?category=social" className="header-nav-link active">社区</Link>
          <Link href="/?category=forum" className="header-nav-link">论坛</Link>
        </nav>

        {/* 搜索框 */}
        <div className="flex-1 flex justify-center mx-2">
          <form
            action="/search"
            method="get"
            className="relative w-full max-w-sm"
            style={{ display: "flex" }}
          >
            <SearchIcon />
            <input
              type="search"
              name="q"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="搜索帖子、话题、用户..."
              className="w-full rounded-full border border-[var(--color-border)] bg-[var(--color-input-bg)] px-4 py-2 pl-9 text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20 transition-all"
            />
          </form>
        </div>

        {/* 右：操作按钮 */}
        <div className="hidden shrink-0 items-center gap-2 lg:flex">
          {session?.user ? (
            <>
              <Link
                href="/posts/new"
                className="flex items-center gap-1.5 rounded-full bg-[var(--color-accent)] px-4 py-1.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 shadow-sm"
              >
                <PlusIcon />
                发帖
              </Link>
              {session.user.role === "MOD" || session.user.role === "ADMIN" ? (
                <Link
                  href="/admin"
                  className="rounded-lg px-3 py-1.5 text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-card-hover)] transition-colors"
                >
                  管理
                </Link>
              ) : null}
              {/* 通知按钮 */}
              <NotificationPanel initialCount={unreadCount} onCountChange={setUnreadCount} />
              {/* 用户头像 */}
              <div className="flex items-center gap-2 cursor-pointer group">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-purple)] flex items-center justify-center text-white font-bold text-sm shadow-sm">
                  {(session.user.name ?? session.user.email ?? "U")[0].toUpperCase()}
                </div>
                <span className="hidden xl:block text-sm font-medium text-[var(--color-foreground)] group-hover:text-[var(--color-accent)] transition-colors max-w-[100px] truncate">
                  {session.user.name ?? session.user.email}
                </span>
              </div>
              <SignOutButton />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg px-4 py-1.5 text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-card-hover)] transition-colors"
              >
                登录
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-[var(--color-accent)] px-4 py-1.5 text-sm font-semibold text-white hover:bg-[var(--color-accent-hover)] transition-colors shadow-sm"
              >
                注册
              </Link>
            </>
          )}
        </div>

        {/* 主题切换 + 移动端菜单 */}
        <div className="ml-auto flex shrink-0 items-center gap-1 lg:ml-0">
          <ThemeToggle />
          <MobileMenu session={session as Parameters<typeof MobileMenu>[0]["session"]} />
        </div>
      </div>

      <style>{`
        .header-nav-link {
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 0.9375rem;
          font-weight: 500;
          color: var(--color-muted);
          text-decoration: none;
          transition: color 0.15s, background 0.15s;
          white-space: nowrap;
        }
        .header-nav-link:hover {
          color: var(--color-foreground);
          background: var(--color-card-hover);
        }
        .header-nav-link.active {
          color: var(--color-accent);
          background: var(--color-accent-light);
          font-weight: 600;
        }
      `}</style>
    </header>
  );
}

function TelescopeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="2"/>
      <path d="M4.93 4.93l4.24 4.24"/>
      <path d="M14.83 9.17l4.24-4.24"/>
      <path d="M14.83 14.83l4.24 4.24"/>
      <path d="M4.93 19.07l4.24-4.24"/>
      <line x1="12" y1="2" x2="12" y2="4"/>
      <line x1="12" y1="20" x2="12" y2="22"/>
      <line x1="2" y1="12" x2="4" y2="12"/>
      <line x1="20" y1="12" x2="22" y2="12"/>
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]"
      width="15"
      height="15"
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

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  );
}
