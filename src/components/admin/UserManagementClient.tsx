"use client";

import { useState, useCallback, useEffect } from "react";
import {
  getUsersAction,
  updateUserRoleAction,
  banUserAction,
  unbanUserAction,
  type UserWithCounts,
} from "@/actions/admin";
import type { UserRole } from ".prisma/client";

export function UserManagementClient() {
  const [users, setUsers] = useState<UserWithCounts[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [loading, setLoading] = useState(false);
  const [pendingAction, setPendingAction] = useState<string | null>(null);

  const fetchUsers = useCallback(
    async (pageNum: number, searchVal: string, roleVal: string) => {
      setLoading(true);
      try {
        const result = await getUsersAction({
          page: pageNum,
          search: searchVal,
          role: roleVal,
        });
        if (!("error" in result) && result.users) {
          setUsers(result.users as UserWithCounts[]);
          setTotal(result.total ?? 0);
          setPage(result.page ?? 1);
          setTotalPages(result.totalPages ?? 1);
        }
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Initial load
  useEffect(() => {
    fetchUsers(1, "", "ALL");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchUsers(1, search, roleFilter);
  };

  const handleRoleFilter = (role: string) => {
    setRoleFilter(role);
    setPage(1);
    fetchUsers(1, search, role);
  };

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    setPendingAction(userId);
    try {
      await updateUserRoleAction(userId, newRole);
      await fetchUsers(page, search, roleFilter);
    } finally {
      setPendingAction(null);
    }
  };

  const handleBan = async (userId: string) => {
    setPendingAction(userId);
    try {
      await banUserAction(userId);
      await fetchUsers(page, search, roleFilter);
    } finally {
      setPendingAction(null);
    }
  };

  const handleUnban = async (userId: string) => {
    setPendingAction(userId);
    try {
      await unbanUserAction(userId);
      await fetchUsers(page, search, roleFilter);
    } finally {
      setPendingAction(null);
    }
  };

  return (
    <div className="user-management">
      {/* 搜索 + 筛选 */}
      <div className="admin-card">
        <div className="user-management-header">
          <div className="user-management-stats">
            <div className="stat-item">
              <span className="stat-value">{total}</span>
              <span className="stat-label">总用户</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">
                {users.filter(u => !u.bannedAt).length}
              </span>
              <span className="stat-label">活跃</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">
                {users.filter(u => u.bannedAt).length}
              </span>
              <span className="stat-label">已封禁</span>
            </div>
          </div>
        </div>

        <div className="user-management-filters">
          <form onSubmit={handleSearch} className="user-search-form">
            <div className="search-input-wrapper">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="search-icon">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="search"
                placeholder="搜索邮箱或昵称…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
              />
            </div>
            <button type="submit" className="search-btn">搜索</button>
          </form>

          <div className="filter-tabs">
            {["ALL", "USER", "MOD", "ADMIN"].map((r) => (
              <button
                key={r}
                onClick={() => handleRoleFilter(r)}
                className={`filter-tab${roleFilter === r ? " active" : ""}`}
              >
                {r === "ALL" ? "全部" : r === "USER" ? "普通用户" : r === "MOD" ? "版主" : "管理员"}
              </button>
            ))}
          </div>
        </div>

        {/* 用户表格 */}
        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>用户</th>
                <th>角色</th>
                <th>状态</th>
                <th>发帖/评论</th>
                <th>注册时间</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {loading && users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="table-loading">加载中…</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="table-empty">暂无用户</td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="user-cell">
                        <div className="user-avatar">
                          {(user.name ?? user.email)[0].toUpperCase()}
                        </div>
                        <div className="user-info">
                          <span className="user-name">{user.name ?? "未设置昵称"}</span>
                          <span className="user-email">{user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <select
                        value={user.role}
                        disabled={pendingAction === user.id}
                        onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                        className="role-select"
                      >
                        <option value="USER">普通用户</option>
                        <option value="MOD">版主</option>
                        <option value="ADMIN">管理员</option>
                      </select>
                    </td>
                    <td>
                      {user.bannedAt ? (
                        <span className="status-badge banned">
                          <span className="status-dot"></span>
                          已封禁
                        </span>
                      ) : (
                        <span className="status-badge active">
                          <span className="status-dot"></span>
                          正常
                        </span>
                      )}
                    </td>
                    <td className="count-cell">
                      <span className="count-posts">{user._count.posts}</span>
                      <span className="count-sep">/</span>
                      <span className="count-comments">{user._count.comments}</span>
                    </td>
                    <td className="date-cell">
                      {new Date(user.createdAt).toLocaleDateString("zh-CN")}
                    </td>
                    <td>
                      {user.bannedAt ? (
                        <button
                          disabled={pendingAction === user.id}
                          onClick={() => handleUnban(user.id)}
                          className="action-btn unban"
                        >
                          解除封禁
                        </button>
                      ) : (
                        <button
                          disabled={pendingAction === user.id}
                          onClick={() => handleBan(user.id)}
                          className="action-btn ban"
                        >
                          封禁
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 分页 */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              disabled={page <= 1 || loading}
              onClick={() => fetchUsers(page - 1, search, roleFilter)}
              className="pagination-btn"
            >
              上一页
            </button>
            <span className="pagination-info">
              第 <strong>{page}</strong> / {totalPages} 页，共 {total} 条
            </span>
            <button
              disabled={page >= totalPages || loading}
              onClick={() => fetchUsers(page + 1, search, roleFilter)}
              className="pagination-btn"
            >
              下一页
            </button>
          </div>
        )}
      </div>

      <style>{`
        .user-management {
          width: 100%;
        }

        .user-management-header {
          padding: 20px 20px 0;
        }

        .user-management-stats {
          display: flex;
          gap: 32px;
          padding-bottom: 20px;
          border-bottom: 1px solid #e8e8e8;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1f1f1f;
          line-height: 1;
        }

        .stat-label {
          font-size: 0.8125rem;
          color: #8c8c8c;
          margin-top: 4px;
        }

        .user-management-filters {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 16px 20px;
          border-bottom: 1px solid #e8e8e8;
          flex-wrap: wrap;
        }

        .user-search-form {
          display: flex;
          gap: 8px;
          flex: 1;
          min-width: 200px;
          max-width: 320px;
        }

        .search-input-wrapper {
          flex: 1;
          position: relative;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #bfbfbf;
        }

        .search-input {
          width: 100%;
          padding: 8px 12px 8px 36px;
          border: 1px solid #d9d9d9;
          border-radius: 6px;
          font-size: 0.875rem;
          color: #1f1f1f;
          background: white;
          outline: none;
          transition: border-color 0.15s;
        }

        .search-input:focus {
          border-color: #1677ff;
        }

        .search-input::placeholder {
          color: #bfbfbf;
        }

        .search-btn {
          padding: 8px 16px;
          background: #1677ff;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.15s;
        }

        .search-btn:hover {
          background: #0958d9;
        }

        .filter-tabs {
          display: flex;
          gap: 4px;
        }

        .filter-tab {
          padding: 6px 14px;
          border: 1px solid #d9d9d9;
          border-radius: 6px;
          background: white;
          color: #595959;
          font-size: 0.8125rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s;
        }

        .filter-tab:hover {
          color: #1677ff;
          border-color: #1677ff;
        }

        .filter-tab.active {
          background: #1677ff;
          color: white;
          border-color: #1677ff;
        }

        .table-wrapper {
          overflow-x: auto;
        }

        .admin-table {
          width: 100%;
          border-collapse: collapse;
        }

        .admin-table th {
          text-align: left;
          padding: 12px 20px;
          font-size: 0.8125rem;
          font-weight: 600;
          color: #8c8c8c;
          background: #fafafa;
          border-bottom: 1px solid #e8e8e8;
        }

        .admin-table td {
          padding: 14px 20px;
          font-size: 0.875rem;
          color: #1f1f1f;
          border-bottom: 1px solid #f0f0f0;
        }

        .admin-table tbody tr:last-child td {
          border-bottom: none;
        }

        .admin-table tbody tr:hover {
          background: #fafafa;
        }

        .table-loading,
        .table-empty {
          text-align: center;
          color: #8c8c8c;
          padding: 48px 20px !important;
        }

        .user-cell {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .user-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, #1677ff, #722ed1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 0.875rem;
          flex-shrink: 0;
        }

        .user-info {
          display: flex;
          flex-direction: column;
        }

        .user-name {
          font-weight: 600;
          color: #1f1f1f;
        }

        .user-email {
          font-size: 0.75rem;
          color: #8c8c8c;
        }

        .role-select {
          padding: 4px 10px;
          border: 1px solid #d9d9d9;
          border-radius: 4px;
          background: white;
          color: #1f1f1f;
          font-size: 0.8125rem;
          cursor: pointer;
          outline: none;
        }

        .role-select:focus {
          border-color: #1677ff;
        }

        .role-select:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .status-badge.active {
          background: #f6ffed;
          color: #52c41a;
        }

        .status-badge.banned {
          background: #fff2f0;
          color: #ff4d4f;
        }

        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }

        .status-badge.active .status-dot {
          background: #52c41a;
        }

        .status-badge.banned .status-dot {
          background: #ff4d4f;
        }

        .count-cell {
          color: #8c8c8c;
        }

        .count-sep {
          margin: 0 4px;
        }

        .date-cell {
          color: #8c8c8c;
        }

        .action-btn {
          padding: 4px 12px;
          border-radius: 4px;
          font-size: 0.8125rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s;
        }

        .action-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .action-btn.ban {
          background: #fff2f0;
          color: #ff4d4f;
          border: 1px solid #ffccc7;
        }

        .action-btn.ban:hover:not(:disabled) {
          background: #ff4d4f;
          color: white;
          border-color: #ff4d4f;
        }

        .action-btn.unban {
          background: white;
          color: #595959;
          border: 1px solid #d9d9d9;
        }

        .action-btn.unban:hover:not(:disabled) {
          color: #1677ff;
          border-color: #1677ff;
        }

        .pagination {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 16px 20px;
          border-top: 1px solid #e8e8e8;
        }

        .pagination-btn {
          padding: 6px 16px;
          border: 1px solid #d9d9d9;
          border-radius: 6px;
          background: white;
          color: #595959;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s;
        }

        .pagination-btn:hover:not(:disabled) {
          color: #1677ff;
          border-color: #1677ff;
        }

        .pagination-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .pagination-info {
          font-size: 0.875rem;
          color: #8c8c8c;
        }

        .pagination-info strong {
          color: #1f1f1f;
        }
      `}</style>
    </div>
  );
}
