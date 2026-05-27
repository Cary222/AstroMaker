"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignOutButton } from "@/components/auth/SignOutButton";

type MobileMenuProps = {
  session: { user?: { id?: string; name?: string | null; email?: string; image?: string | null; role?: string } } | null;
};

export function MobileMenu({ session }: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* 汉堡按钮 (md 以下显示) */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => setOpen(!open)}
        aria-label="菜单"
      >
        {open ? <CloseIcon /> : <MenuIcon />}
      </Button>

      {/* 下拉菜单 */}
      {open && (
        <>
          {/* 遮罩 */}
          <div
            className="fixed inset-0 top-14 z-40 bg-black/50 md:hidden"
            onClick={() => setOpen(false)}
          />

          {/* 菜单面板 */}
          <div className="absolute right-0 top-full z-50 w-full bg-card px-4 pb-4 pt-2 shadow-lg ring-1 ring-border md:hidden">
            {/* 移动端搜索框 */}
            <div className="relative mb-3">
              <SearchIcon />
              <input
                type="search"
                placeholder="搜索..."
                className="w-full rounded-full border border-border bg-input-bg px-4 py-2 pl-9 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
              />
            </div>

            {/* 导航链接 */}
            <nav className="space-y-1 border-t border-border pt-3">
              <Link
                href="/"
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-input-bg"
                onClick={() => setOpen(false)}
              >
                <HomeIcon />
                首页
              </Link>
              <Link
                href="/?category=tech"
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-input-bg hover:text-foreground"
                onClick={() => setOpen(false)}
              >
                <CodeIcon />
                技术
              </Link>
              <Link
                href="/?category=life"
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-input-bg hover:text-foreground"
                onClick={() => setOpen(false)}
              >
                <CoffeeIcon />
                生活
              </Link>
              <Link
                href="/?category=general"
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-input-bg hover:text-foreground"
                onClick={() => setOpen(false)}
              >
                <MessageIcon />
                闲聊
              </Link>
              <Link
                href="/posts/new"
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-input-bg hover:text-foreground"
                onClick={() => setOpen(false)}
              >
                <PenIcon />
                发布帖子
              </Link>
            </nav>

            {/* 用户操作 */}
            <div className="mt-3 border-t border-border pt-3">
              {session?.user ? (
                <div className="space-y-1">
                  <div className="mb-2 px-3 text-sm text-muted-foreground">
                    {session.user.name ?? session.user.email}
                  </div>
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-input-bg hover:text-foreground"
                    onClick={() => setOpen(false)}
                  >
                    个人中心
                  </Link>
                  <SignOutButton />
                </div>
              ) : (
                <div className="flex gap-2">
                  <Link href="/login" className="flex-1" onClick={() => setOpen(false)}>
                    <Button variant="outline" className="w-full">
                      登录
                    </Button>
                  </Link>
                  <Link href="/register" className="flex-1" onClick={() => setOpen(false)}>
                    <Button className="w-full">注册</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function HomeIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9,22 9,12 15,12 15,22" /></svg>;
}
function CodeIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16,18 22,12 16,6" /><polyline points="8,6 2,12 8,18" /></svg>;
}
function CoffeeIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 010 8h-1" /><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" /><line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" /></svg>;
}
function MessageIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>;
}
function PenIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>;
}
