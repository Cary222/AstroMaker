"use client";

import { useState } from "react";

const MOCK_USERS = [
  { id: "1", name: "星空漫游者", handle: "stargazer", fans: 1280, isNew: true },
  { id: "2", name: "DeepSky 摄影师", handle: "deepsky_photo", fans: 941, isNew: false },
  { id: "3", name: "天文小白", handle: "astro_noob", fans: 326, isNew: true },
];

export function SuggestedUsersPanel() {
  const [followed, setFollowed] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setFollowed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="sidebar-card">
      <div className="section-header">
        <div className="sidebar-card-title" style={{ marginBottom: 0 }}>
          <UsersIcon />
          活跃用户
        </div>
        <a href="#" className="section-more">更多</a>
      </div>
      <div>
        {MOCK_USERS.map((user) => (
          <div
            key={user.id}
            className="suggest-user-item"
          >
            <div className="suggest-user-avatar">
              {user.name[0]}
            </div>
            <div className="suggest-user-info">
              <div className="suggest-user-name">
                {user.name}
                {user.isNew && (
                  <span style={{
                    marginLeft: 5,
                    fontSize: "0.6rem",
                    background: "var(--color-success)",
                    color: "white",
                    borderRadius: 3,
                    padding: "1px 4px",
                    fontWeight: 700,
                    verticalAlign: "middle",
                  }}>
                    新
                  </span>
                )}
              </div>
              <div className="suggest-user-fans">
                {user.fans >= 1000 ? (user.fans / 1000).toFixed(1) + "k" : user.fans} 粉丝
              </div>
            </div>
            <button
              className="follow-btn"
              onClick={() => toggle(user.id)}
              style={followed.has(user.id) ? {
                background: "var(--color-card-hover)",
                color: "var(--color-muted)",
                borderColor: "var(--color-border)",
              } : {}}
            >
              {followed.has(user.id) ? "已关注" : "关注"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function UsersIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-purple)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 00-3-3.87"/>
      <path d="M16 3.13a4 4 0 010 7.75"/>
    </svg>
  );
}
