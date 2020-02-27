#!/bin/bash

echo running hasura console on remote
cd "$(dirname "$0")"
node to-env.js
source .env-local

TAIL=100

echo go to http://localhost:${HASURA_CONSOLE_PORT}

# wsl-open http://localhost:${HASURA_CONSOLE_PORT}
python -m webbrowser http://localhost:${HASURA_CONSOLE_PORT}
ssh -L ${HASURA_CONSOLE_PORT}:localhost:${HASURA_CONSOLE_PORT} $REMOTE_IP