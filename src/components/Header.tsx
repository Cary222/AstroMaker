import Link from "next/link";
import { auth } from "@/lib/auth";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { isModerator } from "@/lib/permissions";
import { MobileMenu } from "@/components/layout/MobileMenu";

export async function Header() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-[1400px] items-center gap-3 px-4">
        {/* 左：Logo */}
        <Link href="/" className="shrink-0">
          <img src="/images/logo.svg" alt="AstroMaker" className="h-8 w-auto" />
        </Link>

        {/* 中：搜索框 (md 及以上显示) */}
        <div className="hidden flex-1 justify-center md:flex">
          <div className="relative w-full max-w-md">
            <SearchIcon />
            <input
              type="search"
              placeholder="搜索帖子、用户或话题..."
              className="w-full rounded-full border border-border bg-input-bg px-4 py-2 pl-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
        </div>

        {/* 右：操作按钮 (md 及以上显示) */}
        <div className="hidden shrink-0 items-center gap-2 lg:flex">
          {session?.user ? (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/posts/new">发帖</Link>
              </Button>
              {isModerator(session.user.role) && (
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/admin">管理</Link>
                </Button>
              )}
              <span className="px-2 text-sm text-muted-foreground">
                {session.user.name ?? session.user.email}
              </span>
              <SignOutButton />
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">登录</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/register">注册</Link>
              </Button>
            </>
          )}
        </div>

        {/* 主题切换 + 移动端菜单（始终显示，push 到最右侧） */}
        <div className="ml-auto flex shrink-0 items-center gap-1">
          <ThemeToggle />
          <MobileMenu session={session} />
        </div>
      </div>
    </header>
  );
}

function SearchIcon() {
  return (
    <svg
      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
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
