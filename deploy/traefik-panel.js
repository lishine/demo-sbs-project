const execSync = require('child_process').execSync
const opn = require('opn')

const env = require(`../env-config-deploy-common`)

console.log(
    execSync(
        `ssh -L ${env.TRAEFIK_PANEL_PORT}:localhost:${env.TRAEFIK_PANEL_PORT} ${env.REMOTE_IP}`,
        { encoding: 'utf8' }
    )
)
opn(`http://localhost:${env.TRAEFIK_PANEL_PORT}`)
