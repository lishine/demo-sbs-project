const fs = require('fs')

const env = require(`../env-config-${process.env.DEPLOY_ENV || 'deploy-common'}`)

let str
str = `export REMOTE_IP='${env.REMOTE_IP}'\n`
str = `${str}export REMOTE_DIR='${env.REMOTE_DIR}'\n`
str = `${str}export REMOTE_DIR_BASE='${env.REMOTE_DIR_BASE}'\n`
str = `${str}HASURA_CONSOLE_PORT=${env.HASURA_CONSOLE_PORT}\n`
str = `${str}TRAEFIK_PANEL_PORT=${env.TRAEFIK_PANEL_PORT}\n`
str = `${str}API_PORT_HOST=${env.API_PORT_HOST}\n`
fs.writeFileSync('.env-local', str)

str = `NODE_ENV=${process.env.NODE_ENV}\n`
str = `${str}DEPLOY_ENV=${process.env.DEPLOY_ENV}\n`
str = `${str}COMPOSE_PROJECT_NAME=${process.env.DEPLOY_ENV}\n`
str = `${str}API_SUBDOMAIN=${env.API_SUBDOMAIN}\n`
str = `${str}WWW_SUBDOMAIN=${env.WWW_SUBDOMAIN}\n`
str = `${str}WS_SUBDOMAIN=${env.WS_SUBDOMAIN}\n`
str = `${str}POSTGRES_USER=${env.POSTGRES_USER}\n`
str = `${str}POSTGRES_PASSWORD=${env.POSTGRES_PASSWORD}\n`
str = `${str}POSTGRES_DB=${env.POSTGRES_DB}\n`
str = `${str}HASURA_GRAPHQL_DATABASE_URL=${env.HASURA_GRAPHQL_DATABASE_URL}\n`
str = `${str}HASURA_GRAPHQL_ADMIN_SECRET=${env.HASURA_GRAPHQL_ADMIN_SECRET}\n`
str = `${str}HASURA_CONSOLE_PORT=${env.HASURA_CONSOLE_PORT}\n`
str = `${str}API_PORT_HOST=${env.API_PORT_HOST}\n`
fs.writeFileSync('.env', str)

str = `TRAEFIK_PANEL_PORT=${env.TRAEFIK_PANEL_PORT}\n`
fs.writeFileSync('./reverse-proxy/.env', str)
