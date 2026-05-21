# 社区项目 — 需求路线图

## 已完成

### 一期（MVP 认证）
- [x] 邮箱 + 密码注册 / 登录（Auth.js + JWT）
- [x] PostgreSQL + Prisma 迁移
- [x] 部署至 `192.168.1.14:~/work/company/community`（systemd + PostgreSQL 14）

### 二期（内容与互动）
- [x] 分类种子（综合 / 技术 / 生活）
- [x] 发帖（Markdown）、帖子详情
- [x] 评论（含回复展示，最多 2 层缩进）
- [x] 首页信息流

### 三期（基础管理）
- [x] 用户角色 `USER` / `MOD` / `ADMIN`
- [x] 作者或版主可删自己的帖子 / 评论
- [x] 版主可删任意帖（管理后台 `/admin`）
- [x] `npm run db:promote-admin -- <邮箱>` 提升管理员

---

## 四期建议（优先）

### 4.1 体验与内容
| 需求 | 说明 | 优先级 |
|------|------|--------|
| 帖子编辑 | 作者在一定时间内可编辑标题/正文 | P1 |
| 分页 / 无限滚动 | 首页与评论列表分页，避免一次拉全表 | P1 |
| 按分类筛选 | `/c/[slug]` 分类页 | P2 |
| 搜索 | 标题/正文全文搜索（PostgreSQL `tsvector` 或 Meilisearch） | P2 |
| 图片上传 | 帖子内图片（本地存储或 S3/MinIO） | P2 |

### 4.2 管理增强
| 需求 | 说明 | 优先级 |
|------|------|--------|
| 用户封禁 | `User.bannedAt`，封禁后禁止登录发帖 | P1 |
| 管理后台用户列表 | 查用户、改角色、封禁 | P1 |
| 置顶 / 加精 | `Post.pinned`、`Post.featured` | P2 |
| 操作审计日志 | `ModerationLog` 表记录删帖/封禁操作 | P3 |

### 4.3 通知
| 需求 | 说明 | 优先级 |
|------|------|--------|
| 站内通知 | 被回复、帖子被删等写入 `Notification` 表 | P1 |
| 未读角标 | Header 显示未读数 | P2 |
| 邮件通知 | 可选 SMTP（回复提醒） | P3 |

### 4.4 认证扩展
| 需求 | 说明 | 优先级 |
|------|------|--------|
| GitHub OAuth | Auth.js provider，与现有 Credentials 并存 | P2 |
| 邮箱验证 | 注册后发验证链接（`VerificationToken` 已有） | P3 |
| 找回密码 | 邮件重置流程 | P2 |

---

## 五期建议（基础设施）

| 需求 | 说明 |
|------|------|
| Nginx 反代 + HTTPS | `community.example.com`，Let’s Encrypt |
| 本机 ↔ 服务器同步 | CI（GitHub Actions）或 rsync 脚本，减少手工 tar |
| 数据库备份 | `pg_dump` 定时任务 |
| 监控 | 健康检查、`/api/health`、Uptime |
| Docker 化 | 可选：应用 + Postgres 统一 compose（与现 systemd 二选一） |

---

## 四期实施顺序（推荐）

```mermaid
flowchart LR
  A[封禁 + 用户管理] --> B[帖子编辑 + 分页]
  B --> C[站内通知]
  C --> D[搜索 / 分类页]
  D --> E[OAuth / HTTPS]
```

1. **封禁 + 后台用户管理** — 完善三期管理能力  
2. **帖子编辑 + 列表分页** — 日常可用性  
3. **站内通知** — 提升互动留存  
4. **搜索 / 分类筛选** — 内容变多后的刚需  
5. **OAuth + 域名 HTTPS** — 对外正式运营  

---

## 验收标准（四期入口）

- [ ] 管理员可在后台封禁用户，被封禁用户无法登录  
- [ ] 首页 20+ 帖子时分页正常  
- [ ] 用户收到「被回复」类站内通知并可标记已读  
- [ ] 生产环境 HTTPS 可访问（若上五期 Nginx）

---

## 相关文档

- 本地开发：[`README.md`](../README.md)
- 服务器运维： [`.cursor/skills/community-server/SKILL.md`](../.cursor/skills/community-server/SKILL.md)
- 冒烟测试：`node scripts/smoke-test.mjs`
