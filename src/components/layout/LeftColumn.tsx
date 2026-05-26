import Link from "next/link";
import { auth } from "@/lib/auth";

export async function LeftColumn() {
  const session = await auth();

  return (
    <aside className="col-left">

      {/* 用户信息卡片 */}
      <div className="sidebar-card">
        {session?.user ? (
          <div className="text-center">
            <div className="post-item-avatar mx-auto mb-3">
              {session.user.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={session.user.image}
                  alt={session.user.name ?? "用户"}
                  className="post-item-avatar"
                />
              ) : (
                <span>
                  {(
                    session.user.name ?? session.user.email ?? "U"
                  )[0].toUpperCase()}
                </span>
              )}
            </div>
            <div className="font-semibold text-foreground">
              {session.user.name ?? "未设置昵称"}
            </div>
            <div className="text-sm text-muted-foreground">
              {session.user.email}
            </div>
            <div className="mt-3 flex justify-center gap-6 text-sm">
              <div>
                <div className="font-semibold text-foreground">0</div>
                <div className="text-muted-foreground">关注</div>
              </div>
              <div>
                <div className="font-semibold text-foreground">0</div>
                <div className="text-muted-foreground">粉丝</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p className="mb-3 text-sm text-muted-foreground">
              登录后查看你的信息
            </p>
            <Link
              href="/login"
              className="inline-block w-full rounded-full bg-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90"
            >
              登录
            </Link>
          </div>
        )}
      </div>

      {/* 导航菜单 */}
      <div className="sidebar-card">
        <div className="sidebar-card-title">导航</div>
        <nav className="space-y-1">
          <NavLink href="/" icon={<HomeIcon />}>
            首页
          </NavLink>
          <NavLink href="/?category=tech" icon={<CodeIcon />}>
            技术
          </NavLink>
          <NavLink href="/?category=life" icon={<CoffeeIcon />}>
            生活
          </NavLink>
          <NavLink href="/?category=general" icon={<MessageIcon />}>
            闲聊
          </NavLink>
          <NavLink href="/posts/new" icon={<PenSquareIcon />}>
            发布帖子
          </NavLink>
        </nav>
      </div>
    </aside>
  );
}

function NavLink({
  href,
  icon,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-input-bg hover:text-foreground"
    >
      {icon}
      {children}
    </Link>
  );
}

function HomeIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <polyline points="9,22 9,12 15,12 15,22" />
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="16,18 22,12 16,6" />
      <polyline points="8,6 2,12 8,18" />
    </svg>
  );
}

function CoffeeIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 8h1a4 4 0 010 8h-1" />
      <path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" />
      <line x1="6" y1="1" x2="6" y2="4" />
      <line x1="10" y1="1" x2="10" y2="4" />
      <line x1="14" y1="1" x2="14" y2="4" />
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  );
}

function PenSquareIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}
