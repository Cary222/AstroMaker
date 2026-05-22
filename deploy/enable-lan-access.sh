#!/usr/bin/env bash
# 在服务器上执行（需 sudo 密码）：开放局域网访问 Web(3000) 与 PostgreSQL(5432)
set -euo pipefail

PG_VER="${PG_VER:-14}"
PG_CONF="/etc/postgresql/${PG_VER}/main/postgresql.conf"
PG_HBA="/etc/postgresql/${PG_VER}/main/pg_hba.conf"
LAN_CIDR="${LAN_CIDR:-192.168.1.0/24}"

if [[ "$(id -u)" -ne 0 ]]; then
  echo "请使用: sudo bash $0"
  exit 1
fi

echo ">> PostgreSQL 监听所有网卡"
sed -i "s/^#listen_addresses = 'localhost'/listen_addresses = '*'/" "$PG_CONF"
sed -i "s/^listen_addresses = 'localhost'/listen_addresses = '*'/" "$PG_CONF"
if ! grep -qE "^listen_addresses\s*=\s*'\*'" "$PG_CONF"; then
  echo "listen_addresses = '*'" >>"$PG_CONF"
fi

echo ">> pg_hba 允许 ${LAN_CIDR}"
MARKER="# community LAN access"
if ! grep -qF "$MARKER" "$PG_HBA"; then
  cat >>"$PG_HBA" <<EOF

$MARKER
host    community    community    ${LAN_CIDR}    scram-sha-256
EOF
fi

echo ">> 重启 PostgreSQL"
systemctl restart postgresql
ss -tlnp | grep 5432 || true

echo ">> 防火墙（若启用 ufw）"
if command -v ufw >/dev/null && ufw status 2>/dev/null | grep -q "Status: active"; then
  ufw allow from "${LAN_CIDR}" to any port 3000 proto tcp comment 'community web'
  ufw allow from "${LAN_CIDR}" to any port 5432 proto tcp comment 'community postgres'
  ufw status numbered | tail -10
else
  echo "   ufw 未启用，跳过"
fi

IP=$(hostname -I | awk '{print $1}')
echo ""
echo "完成。局域网访问："
echo "  Web:  http://${IP}:3000"
echo "  DB:   postgresql://community:community@${IP}:5432/community"
