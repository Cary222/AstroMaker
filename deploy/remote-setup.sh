#!/usr/bin/env bash
# 在服务器 ~/work/company/community 下执行
set -euo pipefail

APP_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$APP_DIR"

SUDO_PASS="${SUDO_PASS:-}"
sudo_cmd() {
  if [ -n "$SUDO_PASS" ]; then
    echo "$SUDO_PASS" | sudo -S "$@"
  else
    sudo "$@"
  fi
}

echo "==> 安装系统依赖 (PostgreSQL)..."
sudo_cmd apt-get update -qq
sudo_cmd DEBIAN_FRONTEND=noninteractive apt-get install -y -qq postgresql postgresql-contrib curl ca-certificates

echo "==> 配置 PostgreSQL 用户与数据库..."
sudo_cmd -u postgres psql -tc "SELECT 1 FROM pg_roles WHERE rolname='community'" | grep -q 1 \
  || sudo_cmd -u postgres psql -c "CREATE USER community WITH PASSWORD 'community';"
sudo_cmd -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname='community'" | grep -q 1 \
  || sudo_cmd -u postgres psql -c "CREATE DATABASE community OWNER community;"
sudo_cmd -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE community TO community;"
sudo_cmd systemctl enable postgresql
sudo_cmd systemctl start postgresql

echo "==> 安装 nvm + Node.js 22..."
export NVM_DIR="$HOME/.nvm"
if [ ! -d "$NVM_DIR" ]; then
  curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.2/install.sh | bash
fi
# shellcheck source=/dev/null
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm install 22
nvm use 22

echo "==> 写入 .env..."
if [ ! -f .env ]; then
  AUTH_SECRET=$(openssl rand -base64 32)
  cat > .env <<EOF
DATABASE_URL="postgresql://community:community@localhost:5432/community?schema=public"
AUTH_SECRET="${AUTH_SECRET}"
AUTH_URL="http://192.168.1.14:8080"
EOF
fi

echo "==> npm install & build..."
npm install
npx prisma generate
npx prisma migrate deploy
npm run db:seed || true
npm run build

echo "==> 安装 systemd 用户服务..."
mkdir -p "$HOME/.config/systemd/user"
NODE_BIN="$(command -v node)"
NPM_BIN="$(dirname "$NODE_BIN")/npm"
cat > "$HOME/.config/systemd/user/community.service" <<EOF
[Unit]
Description=Community Next.js App
After=network.target postgresql.service

[Service]
Type=simple
WorkingDirectory=${APP_DIR}
Environment=NODE_ENV=production
Environment=PATH=${HOME}/.nvm/versions/node/v22.22.0/bin:/usr/local/bin:/usr/bin:/bin
ExecStart=${NPM_BIN} start
Restart=on-failure
RestartSec=5

[Install]
WantedBy=default.target
EOF

# 修正 Node 路径为当前版本
NODE_VER=$(node -v)
sed -i "s|v22.22.0|${NODE_VER#v}|" "$HOME/.config/systemd/user/community.service"
sed -i "s|ExecStart=.*|ExecStart=${NPM_BIN} start|" "$HOME/.config/systemd/user/community.service"

systemctl --user daemon-reload
systemctl --user enable community.service
systemctl --user restart community.service
loginctl enable-linger "$USER" 2>/dev/null || true

echo "==> 部署完成"
echo "    访问: http://192.168.1.14:8080"
systemctl --user status community.service --no-pager || true
