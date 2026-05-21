---
name: community-server
description: Connects to and operates the Next.js community app on hxy@192.168.1.14 under ~/work/company/community (PostgreSQL, systemd). Use when deploying, restarting, SSHing, updating migrations, checking logs, or when the user mentions 192.168.1.14, company server, remote community, or 社区服务启停.
---

# 社区服务器（192.168.1.14）

## 连接

| 项 | 值 |
|----|-----|
| 主机 | `192.168.1.14` |
| 用户 | `hxy` |
| SSH | `ssh hxy@192.168.1.14`（Windows 已配置 `~/.ssh/id_ed25519`，免密） |
| 项目路径 | `/home/hxy/work/company/community` |
| 对外访问 | http://192.168.1.14:3000 |

```bash
ssh hxy@192.168.1.14
cd ~/work/company/community
```

**说明**：本机工作区 `d:\WorkSpace\Discord` 与服务器代码为两套目录；未做远程软链。改代码后需同步到服务器再构建（见下方「更新部署」）。

## 服务启停

应用由 **systemd 用户服务** `community.service` 管理（非 Docker）。

```bash
# 状态
systemctl --user status community.service

# 启动 / 停止 / 重启
systemctl --user start community.service
systemctl --user stop community.service
systemctl --user restart community.service

# 开机自启（用户级，已 enable）
systemctl --user enable community.service

# 日志（实时）
journalctl --user -u community.service -f
```

生产进程：`npm start` → Next.js 监听 **3000**（`NODE_ENV=production`）。

## 依赖服务

| 服务 | 说明 |
|------|------|
| PostgreSQL 14 | 系统服务 `postgresql`，仅本机 `127.0.0.1:5432` |
| Node.js | v22（系统 apt / NodeSource，非 nvm） |

```bash
sudo systemctl status postgresql   # 需 sudo 密码
```

数据库（服务器 `.env` 已配置，勿提交仓库）：

- 库名：`community`
- 用户：`community` / 密码：`community`
- `DATABASE_URL`：`postgresql://community:community@localhost:5432/community?schema=public`

## 环境变量

服务器上 `~/work/company/community/.env`：

- `DATABASE_URL` — 见上
- `AUTH_SECRET` — 部署时 `openssl rand -base64 32` 生成
- `AUTH_URL` — `http://192.168.1.14:3000`

本地开发复制 [`.env.example`](../../../.env.example)，`AUTH_URL` 改为 `http://localhost:3000`。

## 常用运维

```bash
cd ~/work/company/community

# 数据库迁移（生产）
npx prisma migrate deploy
npm run db:seed          # 可选，补分类

# 重新构建并重启
npm install              # 依赖变更时
npm run build
systemctl --user restart community.service

# 健康检查
curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:3000/
ss -tlnp | grep 3000
```

## 从 Windows 更新部署

在 **PowerShell**（项目根 `d:\WorkSpace\Discord`）：

```powershell
# 1. 打包（排除 node_modules、.next）
tar -czf community-deploy.tgz --exclude=node_modules --exclude=.next --exclude=community-deploy.tgz .

# 2. 上传并解压
scp community-deploy.tgz hxy@192.168.1.14:/home/hxy/work/company/
ssh hxy@192.168.1.14 "tar -xzf ~/work/company/community-deploy.tgz -C ~/work/company/community"

# 3. 远程构建重启（SSH 单条命令，避免 PowerShell 解析 $()）
ssh hxy@192.168.1.14 "cd ~/work/company/community && npm install && npx prisma migrate deploy && npm run build && systemctl --user restart community.service"
```

服务器脚本（已存在）：

- `deploy/migrate-and-build.sh` — 写 `.env`、迁移、seed、build
- `deploy/start-service.sh` — 注册并启动 systemd
- `deploy/remote-setup.sh` — 首次装 PostgreSQL（需 `SUDO_PASS`）

上传脚本后先 `sed -i 's/\r$//' deploy/*.sh` 去 CRLF。

## 目录结构（服务器）

```
/home/hxy/work/company/
├── community/          # 本仓库部署目录
├── testweb/            # 其他项目
├── LuoBoCameraSDK/
└── ...
```

## 故障排查

| 现象 | 处理 |
|------|------|
| 3000 无响应 | `systemctl --user status community.service`；看 `journalctl --user -u community.service -n 50` |
| 数据库连接失败 | `sudo systemctl start postgresql`；检查 `.env` 中 `DATABASE_URL` |
| Prisma P1001 | PostgreSQL 未启动或 URL 格式错误（勿含 PowerShell 破坏的换行） |
| 局域网无法访问 | 服务器防火墙放行 TCP 3000 |
| 构建失败 | 在服务器执行 `npm run build` 看完整错误；确认 Node ≥ 18 |

数据库 schema、迁移、查表见 Skill **`community-database`**。

## 冒烟测试

```bash
cd ~/work/company/community
node scripts/smoke-test.mjs
```

## 提升管理员

```bash
npm run db:promote-admin -- user@example.com
# 用户需重新登录后 JWT 才带 ADMIN 角色
```

## 本地开发（Windows）

无 Docker 时无法连库；有 Docker 则 `docker compose up -d` + `npm run db:migrate` + `npm run dev`。

与服务器关系：**同源代码，独立 `.env` 与数据库**；不要假设本机改动能自动同步到 192.168.1.14。
