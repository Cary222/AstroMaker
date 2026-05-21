#!/usr/bin/env bash
set -e
cd "$HOME/work/company/community"

AUTH_SECRET=$(openssl rand -base64 32)
cat > .env <<EOF
DATABASE_URL="postgresql://community:community@localhost:5432/community?schema=public"
AUTH_SECRET="${AUTH_SECRET}"
AUTH_URL="http://192.168.1.14:3000"
EOF

npx prisma migrate deploy
npm run db:seed || true
npm run build
echo MIGRATE_BUILD_OK
