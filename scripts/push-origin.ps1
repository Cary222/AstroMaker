# 先跑 CI，再 push 到服务器 bare 仓库（触发 post-receive CD）
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..

& "$PSScriptRoot\ci-local.ps1"

Write-Host ">> git push origin main"
git push origin main

Write-Host ">> pushed. 若已安装 post-receive，服务器将自动部署。"
