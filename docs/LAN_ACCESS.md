# 局域网访问

## 站点（他人浏览器使用）

已监听 `0.0.0.0:3000`，同一网段直接打开：

**http://192.168.1.14:3000**

服务器 `.env` 中 `AUTH_URL` 须为上述地址（与入口端口一致）。

## 数据库（开发 / Prisma Studio）

默认仅本机 `127.0.0.1:5432`。要对局域网开放，在服务器执行一次（需 sudo）：

```bash
ssh hxy@192.168.1.14
sudo bash ~/work/company/community/deploy/enable-lan-access.sh
```

或在本机 PowerShell：

```powershell
.\scripts\enable-lan-remote.ps1
```

成功后局域网连接串：

```
postgresql://community:community@192.168.1.14:5432/community?schema=public
```

## 网段

脚本默认允许 `192.168.1.0/24`。若网段不同：

```bash
sudo LAN_CIDR=10.0.0.0/24 bash deploy/enable-lan-access.sh
```

## 安全说明

- 账号 `community` / 密码 `community` 仅适合内网演示，勿暴露到公网。
- 正式对外请改强密码、限制网段或仅开放 Web 端口。
