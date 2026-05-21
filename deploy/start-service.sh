#!/usr/bin/env bash
set -e
APP="$HOME/work/company/community"
NPM_BIN=$(command -v npm)

mkdir -p "$HOME/.config/systemd/user"
cat > "$HOME/.config/systemd/user/community.service" <<EOF
[Unit]
Description=Community Next.js App
After=network.target postgresql.service

[Service]
Type=simple
WorkingDirectory=${APP}
Environment=NODE_ENV=production
ExecStart=${NPM_BIN} start
Restart=on-failure
RestartSec=5

[Install]
WantedBy=default.target
EOF

systemctl --user daemon-reload
systemctl --user enable community.service
systemctl --user restart community.service
loginctl enable-linger hxy 2>/dev/null || true
sleep 3
systemctl --user status community.service --no-pager || true
ss -tlnp | grep 3000 || true
