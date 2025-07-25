#!/usr/bin/env bash
set -euo pipefail

npm ci --legacy-peer-deps || echo "ooops $?"

exec "$@"

