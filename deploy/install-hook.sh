#!/usr/bin/env bash
set -euo pipefail

SRC="$HOME/work/company/community/deploy/post-receive"
DEST="$HOME/work/company/community.git/hooks/post-receive"

sed -i 's/\r$//' "$SRC"
cp "$SRC" "$DEST"
chmod +x "$DEST"
echo "Installed hook: $DEST"
