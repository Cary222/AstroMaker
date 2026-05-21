#!/usr/bin/env bash
set -e
cd "$HOME/work/company/community"

if [ ! -f .env ] || grep -q 'change-me-run-openssl' .env 2>/dev/null; then
  AUTH_SECRET=$(openssl rand -base64 32)
  cat > .env <<EOF
DATABASE_URL="postgresql://community:community@localhost:5432/community?schema=public"
AUTH_SECRET="${AUTH_SECRET}"
AUTH_URL="http://192.168.1.14:3000"
EOF
fi

npm install
npx prisma generate
npx prisma migrate deploy
npm run db:seed || true
npm run build

NODE_BIN=$(dirname "$(command -v node)")
NPM_BIN=$(command -v npm)
mkdir -p "$HOME/.config/systemd/user"
cat > "$HOME/.config/systemd/user/community.service" <<EOF
[Unit]
Description=Community Next.js App
After=network.target postgresql.service

[Service]
Type=simple
WorkingDirectory=$HOME/work/company/community
Environment=NODE_ENV=production
Environment=PATH=${NODE_BIN}:${PATH}
ExecStart=${NPM_BIN} start
Restart=on-failure
RestartSec=5

[Install]
WantedBy=default.target
EOF

systemctl --user daemon-reload
systemctl --user enable community.service
systemctl --user restart community.service
loginctl enable-linger "$USER" 2>/dev/null || true

sleep 2
systemctl --user status community.service --no-pager
ss -tlnp | grep 3000 || true
echo "Done: http://192.168.1.14:3000"
