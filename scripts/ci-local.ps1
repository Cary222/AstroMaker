# 本机 CI：推送前执行
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..

Write-Host ">> npm run lint"
npm run lint

Write-Host ">> npx prisma validate"
npx prisma validate

Write-Host ">> npm run build"
npm run build

Write-Host ">> CI passed"
