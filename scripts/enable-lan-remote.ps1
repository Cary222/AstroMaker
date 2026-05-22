# 在本机运行：SSH 到服务器并执行 enable-lan-access（会提示输入 sudo 密码）
$ErrorActionPreference = "Stop"
Write-Host ">> 连接 hxy@192.168.1.14，执行 deploy/enable-lan-access.sh（需输入服务器 sudo 密码）"
ssh -t hxy@192.168.1.14 "bash ~/work/company/community/deploy/enable-lan-access.sh 2>/dev/null || sudo bash ~/work/company/community/deploy/enable-lan-access.sh"
