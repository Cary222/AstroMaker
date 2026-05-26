import Link from "next/link";
import { auth } from "@/lib/auth";

export async function LeftColumn() {
  const session = await auth();

  return (
    <aside className="col-left">

      {/* 用户信息卡片 */}
      <div className="sidebar-card">
        {session?.user ? (
          <div className="user-info-card">
            <div className="user-avatar-wrap">
              <div className="user-avatar-large">
                {session.user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={session.user.image}
                    alt={session.user.name ?? "用户"}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <span>
                    {(session.user.name ?? session.user.email ?? "U")[0].toUpperCase()}
                  </span>
                )}
              </div>
            </div>
            <div className="user-name">
              {session.user.name ?? "未设置昵称"}
            </div>
            <div className="user-email">
              {session.user.email}
            </div>
            <div className="user-stats">
              <div>
                <div className="user-stat-num">0</div>
                <div className="user-stat-label">发帖</div>
              </div>
              <div>
                <div className="user-stat-num">0</div>
                <div className="user-stat-label">关注</div>
              </div>
              <div>
                <div className="user-stat-num">0</div>
                <div className="user-stat-label">粉丝</div>
              </div>
            </div>
            <Link
              href="/posts/new"
              className="btn-primary w-full text-center"
              style={{ display: "block", textAlign: "center" }}
            >
              发布帖子
            </Link>
          </div>
        ) : (
          <div className="text-center">
            <div className="mb-3" style={{ fontSize: "2.5rem" }}>🔭</div>
            <div style={{ fontSize: "0.9375rem", fontWeight: 600, color: "var(--color-foreground)", marginBottom: 4 }}>
              加入 AstroMaker
            </div>
            <p className="mb-4 text-sm" style={{ color: "var(--color-muted)" }}>
              探索宇宙，与天文爱好者共同创作
            </p>
            <Link
              href="/login"
              className="btn-primary"
              style={{ display: "block", textAlign: "center", marginBottom: 8 }}
            >
              登录
            </Link>
            <Link
              href="/register"
              className="btn-outline"
              style={{ display: "block", textAlign: "center" }}
            >
              注册账号
            </Link>
          </div>
        )}
      </div>

      {/* 社区导航菜单 */}
      <div className="sidebar-card">
        <div className="sidebar-card-title">
          <CompassIcon />
          社区导航
        </div>
        <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <NavLink href="/" icon={<HomeIcon />} active>
            动态广场
          </NavLink>
          <NavLink href="/?section=hot" icon={<FlameIcon />}>
            热门讨论
          </NavLink>
          <NavLink href="/?section=topics" icon={<HashIcon />}>
            话题标签
          </NavLink>
          <NavLink href="/?section=notify" icon={<BellIcon />}>
            公众通知
          </NavLink>
        </nav>
      </div>

      {/* 创作工具 */}
      <div className="sidebar-card">
        <div className="sidebar-card-title">
          <PenIcon />
          创作中心
        </div>
        <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <NavLink href="/posts/new" icon={<EditIcon />}>
            发布帖子
          </NavLink>
          <NavLink href="/?section=works" icon={<ImageIcon />}>
            作品分享
          </NavLink>
          <NavLink href="/?section=upload" icon={<UploadIcon />}>
            上传模型
          </NavLink>
        </nav>
      </div>

      {/* 热门话题标签 */}
      <div className="sidebar-card">
        <div className="sidebar-card-title">
          <TagIcon />
          热门标签
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {["#3D打印", "#天文摄影", "#望远镜DIY", "#ASIAIR", "#赤道仪", "#目镜", "#天文台", "#流星雨"].map((tag) => (
            <Link key={tag} href={`/?tag=${tag.slice(1)}`} className="tag-pill">
              {tag}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}

function NavLink({
  href,
  icon,
  children,
  active,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <Link href={href} className={`nav-link${active ? " active" : ""}`}>
      <span className="nav-icon">{icon}</span>
      {children}
    </Link>
  );
}

function HomeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <polyline points="9,22 9,12 15,12 15,22" />
    </svg>
  );
}

function FlameIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z"/>
    </svg>
  );
}

function HashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="9" x2="20" y2="9"/>
      <line x1="4" y1="15" x2="20" y2="15"/>
      <line x1="10" y1="3" x2="8" y2="21"/>
      <line x1="16" y1="3" x2="14" y2="21"/>
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 01-3.46 0"/>
    </svg>
  );
}

function PenIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9"/>
      <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
    </svg>
  );
}

function EditIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  );
}

function ImageIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
      <circle cx="8.5" cy="8.5" r="1.5"/>
      <polyline points="21,15 16,10 5,21"/>
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16,16 12,12 8,16"/>
      <line x1="12" y1="12" x2="12" y2="21"/>
      <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/>
    </svg>
  );
}

function CompassIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88 16.24,7.76"/>
    </svg>
  );
}

function TagIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/>
      <line x1="7" y1="7" x2="7.01" y2="7"/>
    </svg>
  );
}
