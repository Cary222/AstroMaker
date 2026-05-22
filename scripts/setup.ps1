# 本地环境初始化（数据库在服务器，经 SSH 隧道连接）
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..

& "$PSScriptRoot\db-tunnel.ps1"

Write-Host ">> 执行数据库迁移（连接服务器库）..."
npm run db:migrate

Write-Host ">> 种子分类数据..."
npm run db:seed

Write-Host ">> 完成。运行 npm run dev 启动开发服务器。"
