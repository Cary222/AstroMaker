import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { UserManagementClient } from "@/components/admin/UserManagementClient";

export default async function AdminUsersPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="admin-layout">
      {/* 侧边栏 */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <div className="admin-logo">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>
            </svg>
          </div>
          <span className="admin-logo-text">管理后台</span>
        </div>

        <nav className="admin-nav">
          <a href="/admin" className="admin-nav-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
              <polyline points="14,2 14,8 20,8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10,9 9,9 8,9"/>
            </svg>
            <span>帖子管理</span>
          </a>
          <a href="/admin/users" className="admin-nav-item active">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 00-3-3.87"/>
              <path d="M16 3.13a4 4 0 010 7.75"/>
            </svg>
            <span>用户管理</span>
          </a>
          <a href="/admin/audit" className="admin-nav-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <span>操作日志</span>
          </a>
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            <div className="admin-user-avatar">
              {(session.user.name ?? session.user.email ?? "A")[0].toUpperCase()}
            </div>
            <div className="admin-user-details">
              <span className="admin-user-name">{session.user.name ?? "管理员"}</span>
              <span className="admin-user-role">{session.user.role}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* 主内容区 */}
      <main className="admin-main">
        <header className="admin-header">
          <div className="admin-header-left">
            <h1 className="admin-page-title">用户管理</h1>
            <span className="admin-page-subtitle">管理员 · {session.user.name ?? session.user.email}</span>
          </div>
          <div className="admin-header-right">
            <Link href="/" className="admin-back-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"/>
                <polyline points="12,19 5,12 12,5"/>
              </svg>
              返回首页
            </Link>
          </div>
        </header>

        <div className="admin-content">
          <UserManagementClient />
        </div>
      </main>

      <style>{`
        .admin-layout {
          display: flex;
          min-height: calc(100vh - 57px);
          background: #f5f6f8;
        }

        /* 侧边栏 */
        .admin-sidebar {
          width: 240px;
          background: #1a1a2e;
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
        }

        .admin-sidebar-header {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 20px 16px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }

        .admin-logo {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #1677ff, #0958d9);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .admin-logo-text {
          font-size: 1rem;
          font-weight: 700;
          color: white;
        }

        .admin-nav {
          flex: 1;
          padding: 12px 8px;
        }

        .admin-nav-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 8px;
          color: rgba(255,255,255,0.65);
          text-decoration: none;
          font-size: 0.9375rem;
          font-weight: 500;
          transition: all 0.15s;
          margin-bottom: 4px;
        }

        .admin-nav-item:hover {
          background: rgba(255,255,255,0.08);
          color: white;
        }

        .admin-nav-item.active {
          background: #1677ff;
          color: white;
        }

        .admin-sidebar-footer {
          padding: 16px;
          border-top: 1px solid rgba(255,255,255,0.08);
        }

        .admin-user-info {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .admin-user-avatar {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: linear-gradient(135deg, #1677ff, #722ed1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 0.875rem;
        }

        .admin-user-details {
          display: flex;
          flex-direction: column;
        }

        .admin-user-name {
          font-size: 0.875rem;
          font-weight: 600;
          color: white;
        }

        .admin-user-role {
          font-size: 0.75rem;
          color: rgba(255,255,255,0.5);
        }

        /* 主内容区 */
        .admin-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .admin-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px;
          background: white;
          border-bottom: 1px solid #e8e8e8;
        }

        .admin-header-left {
          display: flex;
          align-items: baseline;
          gap: 12px;
        }

        .admin-page-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1f1f1f;
        }

        .admin-page-subtitle {
          font-size: 0.875rem;
          color: #8c8c8c;
        }

        .admin-header-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .admin-back-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 6px;
          border: 1px solid #d9d9d9;
          background: white;
          color: #595959;
          font-size: 0.875rem;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.15s;
        }

        .admin-back-btn:hover {
          color: #1677ff;
          border-color: #1677ff;
        }

        .admin-content {
          padding: 24px;
          flex: 1;
        }

        @media (max-width: 768px) {
          .admin-sidebar {
            display: none;
          }
          .admin-layout {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
