# Schema 字段参考

定义源：[`prisma/schema.prisma`](../../../prisma/schema.prisma)

## enum UserRole

| 值 | 用途 |
|----|------|
| USER | 默认；删自己的帖/评 |
| MOD | 管理后台；删任意帖/评 |
| ADMIN | 同 MOD；`db:promote-admin` 设置 |

## User

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | String | PK, cuid | |
| name | String? | | 显示名 |
| email | String | unique | 登录标识 |
| emailVerified | DateTime? | | Auth.js 邮箱验证 |
| image | String? | | 头像 URL |
| passwordHash | String? | | bcrypt；Credentials 必填 |
| role | UserRole | default USER | 权限 |
| createdAt | DateTime | default now | |
| updatedAt | DateTime | @updatedAt | |

关系：`accounts[]` `sessions[]` `posts[]` `comments[]`

## Account（Auth.js）

| 字段 | 说明 |
|------|------|
| provider + providerAccountId | 联合唯一 |
| userId | FK → User，onDelete Cascade |
| refresh_token, access_token, … | OAuth 令牌（Text） |

## Session（Auth.js）

| 字段 | 说明 |
|------|------|
| sessionToken | unique |
| userId | FK → User，Cascade |
| expires | DateTime |

当前部署：`session.strategy = "jwt"`，此表可能无行。

## VerificationToken（Auth.js）

| 字段 | 说明 |
|------|------|
| identifier + token | 联合唯一 |
| expires | DateTime |

## Category

| 字段 | 类型 | 约束 |
|------|------|------|
| id | String | PK（种子可用固定 id） |
| name | String | |
| slug | String | unique |
| createdAt | DateTime | default now |

种子数据：

| id | name | slug |
|----|------|------|
| cat_general | 综合讨论 | general |
| cat_tech | 技术交流 | tech |
| cat_life | 生活随笔 | life |

## Post

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | String | PK | |
| title | String | | |
| slug | String | unique | URL `/posts/[slug]` |
| body | String | @db.Text | Markdown 原文 |
| published | Boolean | default true |  false = 草稿（未做 UI） |
| authorId | String | FK User, Cascade | |
| categoryId | String? | FK Category, SetNull | |
| createdAt | DateTime | default now | 首页排序 |
| updatedAt | DateTime | @updatedAt | |

索引：`@@index([createdAt(sort: Desc)])`，`@@index([authorId])`

## Comment

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | String | PK | |
| body | String | @db.Text | |
| postId | String | FK Post, Cascade | |
| authorId | String | FK User, Cascade | |
| parentId | String? | FK Comment, Cascade | 回复 |
| createdAt | DateTime | default now | |

自关联：`parent` / `replies`（`CommentReplies`）

索引：`@@index([postId, createdAt])`

## _prisma_migrations

Prisma 内部表，记录已应用迁移；勿手动删改。
