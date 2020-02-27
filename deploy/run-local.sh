#!/bin/bash

# export DEPLOY_ENV=$NODE_ENV
echo DEPLOY_ENV=$DEPLOY_ENV
export NODE_ENV=production
echo NODE_ENV=$NODE_ENV
cd "$(dirname "$0")"
node to-env.js
source .env-local

echo "ip $REMOTE_IP"
echo "dir-base: $REMOTE_DIR_BASE"
echo "dir: $REMOTE_DIR"

# OPTION_LOGS=true

while test $# -gt 0
do
    case "$1" in
        config) echo "-->" CONFIG
			OPTION_CONFIG=true
            ;;
        all) echo "-->" ALL
			OPTION_CONFIG=true
			OPTION_API=true
			OPTION_WWW=true
			OPTION_DB=true
			OPTION_REVERSE_PROXY=true
			OPTION_LOGS=true
            ;;
        fresh) echo "-->" FRESH
			CLEAN=true
			OPTION_CONFIG=true
			OPTION_API=true
			OPTION_WWW=true
			OPTION_FILL_DB=true
			OPTION_DB=true
			OPTION_REVERSE_PROXY=true
			OPTION_LOGS=true
            ;;
        api) echo "-->" API
			OPTION_API=true
            ;;
        www) echo "-->" WWW
			OPTION_WWW=true
            ;;
        db) echo "-->" DB
			OPTION_DB=true
            ;;
        fill-db) echo "-->" FILL-DB
			OPTION_FILL_DB=true
            ;;
        db-clean) echo "-->" DB-CLEAN
			OPTION_DB=true
			CLEAN=true
            ;;
        reverse-proxy) echo "-->" REVERSE-PROXY
			OPTION_REVERSE_PROXY=true
            ;;
        logs) echo "-->" LOGS
			OPTION_LOGS=true
            ;;
        *) echo "ARGUMENT $1"
            ;;
    esac
    shift
done

if [ $OPTION_CONFIG ]; then
	echo @@@--------------------------CONFIG----------------------------@@@
	echo Copying base deploy files
	ssh $REMOTE_IP "mkdir -p $REMOTE_DIR_BASE/$REMOTE_DIR"
	rsync -hvrPt -e ssh remote-run.sh .env remote-run.sh docker-compose.yml $REMOTE_IP:$REMOTE_DIR_BASE/$REMOTE_DIR/
fi

if [ $OPTION_DB ]; then
	echo @@@-------------------------DB-----------------------------------@@@
	echo Copying DB files
	rsync -hvrPt  -e ssh ../db/migrations $REMOTE_IP:$REMOTE_DIR_BASE/$REMOTE_DIR/db/
	echo Running DB
	if [ $CLEAN ]
	then
		ssh $REMOTE_IP "cd $REMOTE_DIR_BASE/$REMOTE_DIR && docker-compose down --volumes && docker-compose up --force-recreate -d db hasura"
	else
		ssh $REMOTE_IP "cd $REMOTE_DIR_BASE/$REMOTE_DIR && docker-compose up --force-recreate -d db hasura"
	fi
fi

if [ $OPTION_API ]; then
	echo @@@-------------------------API----------------------------------@@@
	cd ../api
	echo Building API
	npm run build
	echo Copying API files
	if [ $CLEAN ]
	then
        echo deleting api
		ssh $REMOTE_IP "cd $REMOTE_DIR_BASE/$REMOTE_DIR && rm -rf api"
	fi
	rsync -hvrPt -e ssh dist .dockerignore.yml Dockerfile yarn.lock package.json $REMOTE_IP:$REMOTE_DIR_BASE/$REMOTE_DIR/api/
	echo Running api
	ssh $REMOTE_IP "cd $REMOTE_DIR_BASE/$REMOTE_DIR && docker-compose build api && docker-compose up -d api"
	cd -
fi


if [ $OPTION_WWW ]; then
	echo @@@-------------------------WWW----------------------------------@@@
	cd ../www
	# rm -rf build
	echo Building WWW
	npm run build
	echo Copying WWW files
	if [ $CLEAN ]
	then
        echo deleting www
		ssh $REMOTE_IP "cd $REMOTE_DIR_BASE/$REMOTE_DIR && rm -rf www"
	fi
	rsync -hvrPt -e ssh server.js .next .dockerignore.yml Dockerfile package.json package-lock.json yarn.lock $REMOTE_IP:$REMOTE_DIR_BASE/$REMOTE_DIR/www/
	rsync -hvrPt -e ssh src/routes.js $REMOTE_IP:$REMOTE_DIR_BASE/$REMOTE_DIR/www/src/
	ssh $REMOTE_IP "cd $REMOTE_DIR_BASE/$REMOTE_DIR && docker-compose build www && docker-compose up -d www"
	cd -
fi

if [ $OPTION_REVERSE_PROXY ]; then
	echo @@@--------------------REVERSE_PROXY-----------------------------@@@
	echo Copying reverse-proxy
	ssh $REMOTE_IP "mkdir -p $REMOTE_DIR_BASE/reverse-proxy/traefik"
	ssh $REMOTE_IP "cd $REMOTE_DIR_BASE/reverse-proxy/traefik && touch acme.json && chmod 600 acme.json"
	rsync -hvrPt -e ssh reverse-proxy $REMOTE_IP:$REMOTE_DIR_BASE/
	echo Running reverse-proxy
	ssh $REMOTE_IP "cd $REMOTE_DIR_BASE/reverse-proxy && docker-compose up -d"
fi

if [ $OPTION_FILL_DB ]; then
	echo @@@-------------------------FILL-DB-----------------------------@@@
    ./fill-db.sh
fi

if [ $OPTION_LOGS ]; then
	echo @@@------------------------LOGS----------------------------------@@@
	./logs.sh
fi