#!/usr/bin/env bash
# 兼容旧名：安装双端口 systemd 服务
set -e
APP="${APP:-$HOME/work/company/community}"
exec bash "$APP/deploy/install-services.sh"
