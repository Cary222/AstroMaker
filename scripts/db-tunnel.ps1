# 将本机 5432 转发到服务器 PostgreSQL（数据库只在 192.168.1.14 上）
$ErrorActionPreference = "Stop"
$LocalPort = 5432
$Remote = "hxy@192.168.1.14"

$existing = Get-NetTCPConnection -LocalPort $LocalPort -State Listen -ErrorAction SilentlyContinue
if ($existing) {
  Write-Host ">> 端口 $LocalPort 已在监听（可能已有隧道或本地 Postgres）。跳过启动。"
  exit 0
}

Write-Host ">> 启动 SSH 隧道: 127.0.0.1:${LocalPort} -> ${Remote}:5432"
Start-Process -FilePath "ssh" -ArgumentList @(
  "-N", "-L", "${LocalPort}:127.0.0.1:5432", $Remote
) -WindowStyle Hidden

Start-Sleep -Seconds 2
Write-Host ">> 隧道已后台运行。关闭请结束 ssh 进程或: Get-Process ssh | Stop-Process"
