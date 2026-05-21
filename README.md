# 社区（Next.js + PostgreSQL）

全栈社区：注册 / 登录、发帖、评论、首页信息流（Next.js + Auth.js + Prisma + PostgreSQL）。

## 前置要求

- Node.js 18+
- Docker Desktop（本地 PostgreSQL；未安装时需自行提供可访问的 PostgreSQL 并修改 `DATABASE_URL`）

## 快速开始

```bash
# 1. 安装依赖
npm install

# 2. 环境变量
cp .env.example .env
# 编辑 .env，设置 AUTH_SECRET（可用: openssl rand -base64 32）

# 3. 启动数据库
docker compose up -d

# 4. 数据库迁移
npm run db:migrate

# 5.（可选）补充分类种子数据
npm run db:seed

# 6. 开发服务器
npm run dev
```

访问 http://localhost:3000

## 脚本

| 命令 | 说明 |
|------|------|
| `npm run dev` | 开发模式 |
| `npm run build` | 生产构建 |
| `npm run db:migrate` | Prisma 迁移 |
| `npm run db:studio` | Prisma Studio |

## 路由

- `/` — 首页信息流
- `/posts/new` — 发帖（需登录）
- `/posts/[slug]` — 帖子详情与评论
- `/register` — 注册
- `/login` — 登录
- `/dashboard` — 受保护示例页

## 功能

- 邮箱密码注册 / 登录（Auth.js + JWT 会话）
- 发帖（Markdown 正文、可选分类）
- 评论（支持回复，最多 2 层缩进展示）
- 默认分类：综合讨论、技术交流、生活随笔
- 删帖/删评论（作者或版主）；管理后台 `/admin`（`MOD` / `ADMIN`）

提升管理员：`npm run db:promote-admin -- your@email.com`（需重新登录生效）

## 文档

| 文档 | 说明 |
|------|------|
| [`docs/TECH_STACK_AND_ROADMAP.md`](docs/TECH_STACK_AND_ROADMAP.md) | **技术选型 + 四至六期路线图（主文档）** |
| [`docs/NEXT_PHASE.md`](docs/NEXT_PHASE.md) | 期次 checklist（简版） |

## 远程服务器（192.168.1.14）

生产部署在 `hxy@192.168.1.14:~/work/company/community`，访问 http://192.168.1.14:3000。

- 服务器运维：Skill **`community-server`**（`.cursor/skills/community-server/SKILL.md`）
- 数据库 / 迁移 / 查数：Skill **`community-database`**（`.cursor/skills/community-database/SKILL.md`）

