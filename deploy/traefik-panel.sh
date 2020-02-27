#!/bin/bash

echo running traefik panel on remote
cd "$(dirname "$0")"
node to-env.js
source .env-local

TAIL=100

wsl-open http://localhost:${TRAEFIK_PANEL_PORT}
ssh -L ${TRAEFIK_PANEL_PORT}:localhost:${TRAEFIK_PANEL_PORT} $REMOTE_IP