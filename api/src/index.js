import micro from 'micro'
import microCors from 'micro-cors'
import './ws/ws-server'

// Local
import { localPostRouter } from 'utils/microWrappers'
import * as routes from './routes/routesIndex'

const origin = process.env.SITE_URL

console.log('origin', origin)

const cors = microCors({
    allowHeaders: [
        'X-Requested-With',
        'Access-Control-Allow-Origin',
        'X-HTTP-Method-Override',
        'Content-Type',
        'Authorization',
        'Accept',
        'credentials',
    ],
    allowMethods: ['POST'],
    origin,
})

const server = micro(cors(localPostRouter(routes)))

console.log('process.env.NODE_ENV', process.env.NODE_ENV)
console.log('process.env.DEPLOY_ENV', process.env.DEPLOY_ENV)

const API_PORT = 8000
console.log(`api listening on port ${API_PORT}`)
server.listen(API_PORT)
