const fs = require('fs')

const env = require('../env-config-development')

let str
str = `POSTGRES_USER=${env.POSTGRES_USER}\n`
str = `${str}POSTGRES_PASSWORD=${env.POSTGRES_PASSWORD}\n`
str = `${str}POSTGRES_DB=${env.POSTGRES_DB}\n`
str = `${str}HASURA_GRAPHQL_DATABASE_URL=${env.HASURA_GRAPHQL_DATABASE_URL}\n`
str = `${str}HASURA_GRAPHQL_ADMIN_SECRET=${env.HASURA_GRAPHQL_ADMIN_SECRET}\n`

fs.writeFileSync('.env', str)
