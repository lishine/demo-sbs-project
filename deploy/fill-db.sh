#!/bin/bash

cd "$(dirname "$0")"
node to-env.js
source .env-local
echo running fill-db on remote/${DEPLOY_ENV}

TAIL=100

ssh -fNT -L ${API_PORT_HOST}:localhost:${API_PORT_HOST} $REMOTE_IP
sleep 5s
node db/fill-db.js
# kill %1