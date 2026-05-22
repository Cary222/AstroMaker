#!/usr/bin/env bash
# 安装/更新 systemd 用户服务：community（本机生产）+ community-proxy（外放）
set -euo pipefail

APP="${APP:-$HOME/work/company/community}"
NPM_BIN=$(command -v npm)
NODE_BIN=$(command -v node)
NEXT_BIN="${APP}/node_modules/.bin/next"
UNIT_DIR="$HOME/.config/systemd/user"

if [[ -f "$APP/deploy/ports.env" ]]; then
  # shellcheck disable=SC1091
  source "$APP/deploy/ports.env"
fi

PROD_HOST="${PROD_HOST:-127.0.0.1}"
PROD_PORT="${PROD_PORT:-3001}"
EXTERNAL_PORT="${EXTERNAL_PORT:-3000}"

mkdir -p "$UNIT_DIR"

cat >"$UNIT_DIR/community.service" <<EOF
[Unit]
Description=Community Next.js App (production port, localhost only)
After=network.target postgresql.service

[Service]
Type=simple
WorkingDirectory=${APP}
Environment=NODE_ENV=production
ExecStart=${NEXT_BIN} start -H ${PROD_HOST} -p ${PROD_PORT}
Restart=on-failure
RestartSec=5

[Install]
WantedBy=default.target
EOF

cat >"$UNIT_DIR/community-proxy.service" <<EOF
[Unit]
Description=Community external port proxy -> production port
After=community.service
Requires=community.service

[Service]
Type=simple
WorkingDirectory=${APP}
Environment=PROD_HOST=${PROD_HOST}
Environment=PROD_PORT=${PROD_PORT}
Environment=EXTERNAL_HOST=0.0.0.0
Environment=EXTERNAL_PORT=${EXTERNAL_PORT}
ExecStart=${NODE_BIN} ${APP}/deploy/port-proxy.mjs
Restart=on-failure
RestartSec=3

[Install]
WantedBy=default.target
EOF

if [[ -f "$APP/.env" ]]; then
  if grep -qE 'AUTH_URL=.*(:3000|localhost:3000)' "$APP/.env" 2>/dev/null; then
    sed -i -E 's|AUTH_URL="http://[^"]*"|AUTH_URL="http://192.168.1.14:'"${EXTERNAL_PORT}"'"|' "$APP/.env"
    echo "Updated AUTH_URL -> http://192.168.1.14:${EXTERNAL_PORT}"
  fi
fi

systemctl --user daemon-reload
systemctl --user enable community.service community-proxy.service
systemctl --user restart community.service
sleep 2
systemctl --user restart community-proxy.service
loginctl enable-linger hxy 2>/dev/null || true

echo "Production: http://${PROD_HOST}:${PROD_PORT}"
echo "External:   http://192.168.1.14:${EXTERNAL_PORT}"
systemctl --user is-active community.service community-proxy.service
ss -tlnp | grep 3000 || true
ss -tlnp | grep 8080 || true
