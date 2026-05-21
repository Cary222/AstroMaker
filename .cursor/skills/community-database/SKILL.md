---
name: community-database
description: PostgreSQL and Prisma schema for the community app—tables, relations, migrations, seeds, inspection scripts, and production connection on 192.168.1.14. Use when designing or changing the database, running migrations, inspecting data, promoting admins, or when the user mentions 数据库、Prisma、schema、迁移、表结构.
---

# 社区数据库（PostgreSQL + Prisma）

## 源文件（改结构必改此处）

| 文件 | 用途 |
|------|------|
| [`prisma/schema.prisma`](../../../prisma/schema.prisma) | 唯一 schema 真相源 |
| [`prisma/migrations/`](../../../prisma/migrations/) | 已应用迁移历史 |
| [`prisma/seed.ts`](../../../prisma/seed.ts) | 分类种子 |
| [`prisma/promote-admin.ts`](../../../prisma/promote-admin.ts) | 提升 ADMIN |

本地 Docker 开发：[`docker-compose.yml`](../../../docker-compose.yml) + `.env` 中 `DATABASE_URL`。

## 连接

### 生产（192.168.1.14）

| 项 | 值 |
|----|-----|
| 引擎 | PostgreSQL **14**，系统服务 `postgresql` |
| 主机 | `127.0.0.1:5432`（仅服务器本机） |
| 库名 | `community` |
| 用户 / 密码 | `community` / `community` |
| Prisma URL | `postgresql://community:community@localhost:5432/community?schema=public` |
| 应用目录 | `/home/hxy/work/company/community`（`.env` 已配置） |

SSH 后所有 Prisma 命令在应用目录执行。应用启停见 skill **`community-server`**。

### 本地

```env
DATABASE_URL="postgresql://community:community@localhost:5432/community?schema=public"
```

`docker compose up -d` 后 `npm run db:migrate`。

## 模型总览

```mermaid
erDiagram
  User ||--o{ Account : has
  User ||--o{ Session : has
  User ||--o{ Post : writes
  User ||--o{ Comment : writes
  Category ||--o{ Post : optional
  Post ||--o{ Comment : has
  Comment ||--o{ Comment : parent
```

| 模型 | 分组 | 说明 |
|------|------|------|
| User, Account, Session, VerificationToken | Auth.js | 适配器标准表；登录用 Credentials + **JWT**（`Session` 表多为空） |
| Category | 业务 | 分类，`slug` 唯一 |
| Post | 业务 | 帖子，`slug` 唯一，`body` 为 Text |
| Comment | 业务 | 评论；`parentId` 自关联回复 |

主键均为 **`String @id @default(cuid())`**。

### User（业务字段摘要）

- `email` 唯一；`passwordHash` 可空（OAuth 预留）
- `role`: `USER` | `MOD` | `ADMIN`，默认 `USER`
- 删用户 → 级联删其 Post、Comment、Account、Session

### Post / Comment

- Post：`authorId` 必填；`categoryId` 可选；`published` 默认 `true`
- Comment：`postId` + `authorId`；`parentId` 可选（楼中楼）
- 索引：`Post(createdAt DESC)`、`Post(authorId)`、`Comment(postId, createdAt)`

### 级联删除

| 删除 | 效果 |
|------|------|
| User | 帖、评论、Account、Session 全删 |
| Post | 该帖所有 Comment 删 |
| Comment | `parentId` 指向它的子评论删 |
| Category | 帖子的 `categoryId` **SetNull** |

完整字段见 [schema-reference.md](schema-reference.md)。

## 迁移与种子

```bash
# 开发：创建并应用迁移
npm run db:migrate          # prisma migrate dev

# 生产：只应用已有迁移（服务器用这个）
npx prisma migrate deploy

# 生成 Client（改 schema 后）
npm run db:generate

# 推送 schema 无迁移文件（慎用，仅本地试验）
npm run db:push

# 种子分类（general / tech / life）
npm run db:seed

# 提升管理员（须重新登录才生效）
npm run db:promote-admin -- user@example.com

# GUI
npm run db:studio
```

### 已有迁移

| 目录 | 内容 |
|------|------|
| `20250521000000_init_auth` | User, Account, Session, VerificationToken |
| `20250521100000_posts_comments` | UserRole, Category, Post, Comment + 3 条分类 INSERT |

**改 schema 流程**：编辑 `schema.prisma` → `npm run db:migrate`（起名如 `add_user_ban`）→ 提交 migration SQL → 生产 `migrate deploy` → 重启应用（若涉及运行时逻辑）。

## 查看数据

```bash
# 推荐：表格快照（用户/分类/帖/评论 + 汇总）
node scripts/db-inspect.mjs

# 连通 + CRUD 冒烟（会创建并清理测试用户）
node scripts/smoke-test.mjs

# 原生 SQL（服务器）
PGPASSWORD=community psql -h 127.0.0.1 -U community -d community
```

`db-inspect` 不输出 `passwordHash`。测试邮箱：`smoke-test@community.local`（冒烟脚本会自动清理）。

## 与应用代码的对应

| 数据 | 代码位置 |
|------|----------|
| 查帖/流 | [`src/lib/posts.ts`](../../../src/lib/posts.ts) |
| 发帖 | [`src/actions/post.ts`](../../../src/actions/post.ts) |
| 评论 | [`src/actions/comment.ts`](../../../src/actions/comment.ts) |
| 删帖/删评 | [`src/actions/moderation.ts`](../../../src/actions/moderation.ts) |
| 权限 | [`src/lib/permissions.ts`](../../../src/lib/permissions.ts) + `User.role` |
| 会话中的 role | [`src/lib/auth.ts`](../../../src/lib/auth.ts) JWT callback |

## 四期 schema 扩展（未实现）

改库前对照 [`docs/NEXT_PHASE.md`](../../../docs/NEXT_PHASE.md)：

- `User.bannedAt` — 封禁
- `Notification` — 站内通知
- `Post.pinned` / `Post.featured` — 置顶加精
- `ModerationLog` — 审计

新增表/字段时保持：cuid 主键、明确 `onDelete`、为列表查询加 `@@index`。

## 故障排查

| 错误 | 处理 |
|------|------|
| P1001 连不上 | 生产：`sudo systemctl start postgresql`；检查 `.env` URL 无换行/损坏 |
| P2002 唯一冲突 | `email` / `slug` 重复 |
| 迁移失败 | `prisma migrate status`；勿手改 `_prisma_migrations` |
| 角色不生效 | JWT 缓存旧 role → **重新登录** |
| Windows 破坏 `.env` | 用 scp 上传或服务器脚本生成，勿在 PowerShell 里拼 heredoc |

## 相关 Skill

- **`community-server`** — SSH、systemd、部署、`.env` 位置
