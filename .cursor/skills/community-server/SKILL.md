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
| 对外访问 | http://192.168.1.14:8080（外放）；本机生产 `127.0.0.1:3000` |

```bash
ssh hxy@192.168.1.14
cd ~/work/company/community
```

**Git 远端（已配置）**：

| 项 | 路径 |
|----|------|
| 裸仓库（`origin`） | `hxy@192.168.1.14:work/company/community.git` |
| 运行目录（工作区） | `~/work/company/community`（由 bare clone，含 `.env`） |

**日常发布（推荐）** — 见 Skill **`community-database`** 与同仓库 [`docs/CICD.md`](../../../docs/CICD.md)：

```powershell
cd d:\WorkSpace\Discord
.\scripts\push-origin.ps1
```

`git push origin main` 后 **post-receive** 自动：pull → `npm ci` → `prisma migrate deploy` → build → 重启。日志：`~/work/company/community/deploy.log`。

更新 hook：`bash ~/work/company/community/deploy/install-hook.sh`

**说明**：本机 `origin` 即 bare 仓库；`.env` 仅在服务器工作区，不入库。

### 兜底部署（无 Git / hook 失效）

```powershell
tar -czf community-deploy.tgz --exclude=node_modules --exclude=.next --exclude=*.tgz .
scp community-deploy.tgz hxy@192.168.1.14:/home/hxy/work/company/
ssh hxy@192.168.1.14 "tar -xzf ~/work/company/community-deploy.tgz -C ~/work/company/community && cd ~/work/company/community && npm ci && npx prisma migrate deploy && npm run build && bash deploy/install-services.sh"
```

## 服务启停（双端口）

| 服务 | 端口 | 说明 |
|------|------|------|
| `community.service` | `127.0.0.1:3000` | Next.js 生产进程，不对外网卡暴露 |
| `community-proxy.service` | `0.0.0.0:8080` | `deploy/port-proxy.mjs` 转发到外放 |

安装/更新单元：`bash ~/work/company/community/deploy/install-services.sh`

```bash
systemctl --user status community.service community-proxy.service
systemctl --user restart community.service community-proxy.service
journalctl --user -u community.service -f
journalctl --user -u community-proxy.service -f
```

端口配置：[`deploy/ports.env`](../../../deploy/ports.env)。

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
- `AUTH_URL` — `http://192.168.1.14:8080`（须与外放端口一致）

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
bash deploy/install-services.sh

# 健康检查
curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:3000/
curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:8080/
ss -tlnp | grep -E '3000|8080'
```

## 首次安装脚本（仅新机）

- `deploy/remote-setup.sh` — PostgreSQL + Node（需 `SUDO_PASS`）
- `deploy/migrate-and-build.sh` — 写 `.env`、迁移、build
- `deploy/install-services.sh` — 双端口 systemd（`start-service.sh` 为其入口）
- `deploy/install-hook.sh` — 安装 post-receive

上传脚本后：`sed -i 's/\r$//' deploy/*.sh`

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
| 8080 无响应 | 查 `community-proxy.service`；生产端口先确认 `curl http://127.0.0.1:3000/` |
| 3000 无响应 | `systemctl --user status community.service`；看 `journalctl --user -u community.service -n 50` |
| 数据库连接失败 | `sudo systemctl start postgresql`；检查 `.env` 中 `DATABASE_URL` |
| Prisma P1001 | PostgreSQL 未启动或 URL 格式错误（勿含 PowerShell 破坏的换行） |
| 局域网无法访问 | 防火墙放行 TCP **8080**（3000 仅本机，无需外放） |
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
