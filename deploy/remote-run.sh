#!/bin/bash

# echo remote logs NODE_ENV=$NODE_ENV
# source .remote-env-exports

echo ----------- FIRST CREATION

# echo ----------- STOP CONTAINERS
# docker-compose rm -f
# docker stop $(docker ps -aq)
# docker rm $(docker ps -aq)
# docker rmi --force $(docker images -q)
# docker containers ls
# docker images ls

echo ----------- DB CONTAINER
# docker stop db
# docker stop hasura
cd db && docker-compose up --remove-orphans -d && cd ..

echo ----------- BUILD APP CONTAINER
# docker-compose build --no-cache
## docker-compose build --force-rm
docker-compose build
echo ----------- DEPLOY APP CONTAINER
# docker stop www
# docker stop api
## docker-compose up --remove-orphans --force-recreate -d
docker-compose up --remove-orphans -d

echo ----------- REVERSE-PROXY CONTAINER
# docker stop traefik
cd ../reverse-proxy && docker-compose up --remove-orphans -d && cd ..
