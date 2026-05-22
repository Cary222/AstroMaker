import Link from "next/link";
import { auth } from "@/lib/auth";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { isModerator } from "@/lib/permissions";

export async function Header() {
  const session = await auth();

  return (
    <header className="border-b border-border bg-card/80 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-semibold text-foreground">
          社区
        </Link>
        <nav className="flex items-center gap-2">
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
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
