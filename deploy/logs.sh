#!/bin/bash

echo running logs on remote
cd "$(dirname "$0")"
node to-env.js
source .env-local

TAIL=100

echo $REMOTE_IP
echo cd $REMOTE_DIR_BASE/$REMOTE_DIR

ssh $REMOTE_IP "cd $REMOTE_DIR_BASE/$REMOTE_DIR && docker-compose logs -f -t --tail=$TAIL && cd ../reverse-proxy && docker-compose logs -f -t --tail=$TAIL"
