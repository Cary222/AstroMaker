# 本地环境一键初始化（需已安装 Docker Desktop 与 Node.js）
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..

Write-Host ">> 启动 PostgreSQL..."
docker compose up -d

Write-Host ">> 等待数据库就绪..."
Start-Sleep -Seconds 5

Write-Host ">> 执行数据库迁移..."
npm run db:migrate

Write-Host ">> 种子分类数据..."
npm run db:seed

Write-Host ">> 完成。运行 npm run dev 启动开发服务器。"
