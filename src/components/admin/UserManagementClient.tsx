"use client";

import { useState, useCallback, useEffect } from "react";
import {
  getUsersAction,
  updateUserRoleAction,
  banUserAction,
  unbanUserAction,
  type UserWithCounts,
} from "@/actions/admin";
import type { UserRole } from "@prisma/client";

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
    <div className="space-y-4">
      {/* 搜索 + 筛选 */}
      <div
        style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <form onSubmit={handleSearch} style={{ display: "flex", gap: 8, flex: 1, minWidth: 200 }}>
          <input
            type="search"
            placeholder="搜索邮箱或昵称…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1,
              padding: "7px 14px",
              borderRadius: 8,
              border: "1px solid var(--color-border)",
              background: "var(--color-input-bg)",
              color: "var(--color-foreground)",
              fontSize: "0.875rem",
              outline: "none",
            }}
          />
          <button type="submit" className="btn-primary" style={{ padding: "7px 16px" }}>
            搜索
          </button>
        </form>

        <div style={{ display: "flex", gap: 4 }}>
          {["ALL", "USER", "MOD", "ADMIN"].map((r) => (
            <button
              key={r}
              onClick={() => handleRoleFilter(r)}
              className={`tag-pill${roleFilter === r ? " active" : ""}`}
            >
              {r === "ALL" ? "全部" : r === "USER" ? "普通用户" : r === "MOD" ? "版主" : "管理员"}
            </button>
          ))}
        </div>
      </div>

      {/* 用户表格 */}
      <div className="sidebar-card" style={{ padding: 0, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
          <thead>
            <tr
              style={{
                borderBottom: "1px solid var(--color-border)",
                background: "var(--color-card-hover)",
              }}
            >
              <th style={{ padding: "10px 16px", textAlign: "left", fontWeight: 600, color: "var(--color-muted)" }}>用户</th>
              <th style={{ padding: "10px 16px", textAlign: "left", fontWeight: 600, color: "var(--color-muted)" }}>角色</th>
              <th style={{ padding: "10px 16px", textAlign: "left", fontWeight: 600, color: "var(--color-muted)" }}>状态</th>
              <th style={{ padding: "10px 16px", textAlign: "left", fontWeight: 600, color: "var(--color-muted)" }}>发帖/评论</th>
              <th style={{ padding: "10px 16px", textAlign: "left", fontWeight: 600, color: "var(--color-muted)" }}>注册时间</th>
              <th style={{ padding: "10px 16px", textAlign: "left", fontWeight: 600, color: "var(--color-muted)" }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: "32px 16px", textAlign: "center", color: "var(--color-muted)" }}>
                  暂无用户
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user.id}
                  style={{ borderBottom: "1px solid var(--color-border-light)" }}
                >
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
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
                        {(user.name ?? user.email)[0].toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: "var(--color-foreground)" }}>
                          {user.name ?? "未设置昵称"}
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "var(--color-muted)" }}>
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <select
                      value={user.role}
                      disabled={pendingAction === user.id}
                      onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                      style={{
                        padding: "3px 8px",
                        borderRadius: 6,
                        border: "1px solid var(--color-border)",
                        background: "var(--color-input-bg)",
                        color: "var(--color-foreground)",
                        fontSize: "0.8125rem",
                        cursor: pendingAction === user.id ? "not-allowed" : "pointer",
                        opacity: pendingAction === user.id ? 0.5 : 1,
                      }}
                    >
                      <option value="USER">USER</option>
                      <option value="MOD">MOD</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    {user.bannedAt ? (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          background: "rgba(255,77,79,0.1)",
                          color: "#ff4d4f",
                          borderRadius: 4,
                          padding: "2px 8px",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                        }}
                      >
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ff4d4f" }} />
                        已封禁
                      </span>
                    ) : (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          background: "rgba(82,196,26,0.1)",
                          color: "#52c41a",
                          borderRadius: 4,
                          padding: "2px 8px",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                        }}
                      >
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#52c41a" }} />
                        正常
                      </span>
                    )}
                  </td>
                  <td style={{ padding: "12px 16px", color: "var(--color-muted)", fontSize: "0.8125rem" }}>
                    {user._count.posts} / {user._count.comments}
                  </td>
                  <td style={{ padding: "12px 16px", color: "var(--color-muted)", fontSize: "0.8125rem" }}>
                    {new Date(user.createdAt).toLocaleDateString("zh-CN")}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    {user.bannedAt ? (
                      <button
                        disabled={pendingAction === user.id}
                        onClick={() => handleUnban(user.id)}
                        style={{
                          padding: "4px 12px",
                          borderRadius: 6,
                          border: "1px solid var(--color-border)",
                          background: "var(--color-input-bg)",
                          color: "var(--color-foreground)",
                          fontSize: "0.8125rem",
                          cursor: pendingAction === user.id ? "not-allowed" : "pointer",
                          opacity: pendingAction === user.id ? 0.5 : 1,
                        }}
                      >
                        解除封禁
                      </button>
                    ) : (
                      <button
                        disabled={pendingAction === user.id}
                        onClick={() => handleBan(user.id)}
                        style={{
                          padding: "4px 12px",
                          borderRadius: 6,
                          border: "1px solid rgba(255,77,79,0.3)",
                          background: "rgba(255,77,79,0.08)",
                          color: "#ff4d4f",
                          fontSize: "0.8125rem",
                          cursor: pendingAction === user.id ? "not-allowed" : "pointer",
                          opacity: pendingAction === user.id ? 0.5 : 1,
                        }}
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
        <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
          <button
            disabled={page <= 1 || loading}
            onClick={() => fetchUsers(page - 1, search, roleFilter)}
            className="btn-outline"
            style={{ padding: "5px 14px", fontSize: "0.8125rem" }}
          >
            上一页
          </button>
          <span style={{ padding: "5px 12px", color: "var(--color-muted)", fontSize: "0.875rem" }}>
            第 {page} / {totalPages} 页，共 {total} 条
          </span>
          <button
            disabled={page >= totalPages || loading}
            onClick={() => fetchUsers(page + 1, search, roleFilter)}
            className="btn-outline"
            style={{ padding: "5px 14px", fontSize: "0.8125rem" }}
          >
            下一页
          </button>
        </div>
      )}

      {loading && (
        <div style={{ textAlign: "center", color: "var(--color-muted)", fontSize: "0.875rem" }}>
          加载中…
        </div>
      )}
    </div>
  );
}
