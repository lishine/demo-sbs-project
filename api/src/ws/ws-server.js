import * as WebSocket from 'ws'

// Local
import { PING_PONG_INTERVAL, AUTH_TIMESTAMP_LAG } from './constants'
import { unsign, getDevice, getDevicePre } from './auth'
import { insertEvent } from './events'
import { queryDb, toto } from 'utils/utils'
import { deleteDevice } from './deleteDevice'
import { initDevice } from './initDevice'

console.log('ws server')
const WS_PORT = 9000
const wss = new WebSocket.Server({ port: WS_PORT })
console.log(`ws listening on port ${WS_PORT}`)

wss.on('connection', function connection(ws, req) {
    ws.origin = req.headers['origin']
    ws.ip = req.headers['x-real-ip'] || req.connection.remoteAddress
    console.log(`connection from origin: ${ws.origin}, ip: ${ws.ip}`)
    ws.isAlive = true
    ws.isAuth = false
    ws.on('pong', () => {
        console.log(`pong from ip ${ws.ip}`)
        ws.isAlive = true
    })

    const send = ({ type, data }) => {
        ws.send(JSON.stringify({ type, data, deviceIP: ws.ip }))
        return true
    }

    ws.on('message', async message => {
        let json, type, data
        let sent

        const sendSyntaxError = () => {
            sent = true
            send({
                type: 'error',
                data: { message: 'syntax error' },
            })
        }

        let error
        try {
            json = JSON.parse(message)
            ;({ type, data } = json)
        } catch (e) {
            console.log('error parsing ws message')
            error = true
        }
        if (
            error ||
            !type ||
            !data ||
            typeof type !== 'string' ||
            typeof data !== 'object'
        ) {
            console.log(`server received ${JSON.stringify(message)} , from ip ${ws.ip}`)
            sendSyntaxError()
        } else {
            console.log('json', JSON.stringify(json))

            if (ws.isAuth) {
                if (type === 'result') {
                    if (ws.resolveResult) {
                        ws.resolveResult({ data })
                    }
                } else if (type === 'test') {
                    if (data.delete) {
                        try {
                            await deleteDevice({
                                queryDb: queryDb({ role: 'device' }),
                                deviceName: process.env.TEST_DEVICE_NAME,
                            })
                            sent = send({
                                type: 'result',
                                data: { message: 'Delete test device SUCCESS' },
                            })
                        } catch (error) {
                            sent = send({
                                type: 'error',
                                data: {
                                    message:
                                        'Error in the process of deleting test device',
                                },
                            })
                        }
                    }
                } else if (type === 'event') {
                    const { code } = data
                    if (!code) {
                        sent = send({
                            type: 'error',
                            data: { message: 'No code for event' },
                        })
                    } else {
                        try {
                            await insertEvent({ deviceName: ws.deviceName, code })
                            sent = send({
                                type: 'result',
                                data: { message: 'success' },
                            })
                        } catch (error) {
                            sent = send({
                                type: 'error',
                                data: {},
                            })
                        }
                    }
                }
            } else if (type === 'auth') {
                let publicKey
                let notRegistered
                const { deviceName, signedMessage } = data
                if (!deviceName || !signedMessage) {
                    sent = send({
                        type: 'error',
                        data: { message: 'auth syntax error' },
                    })
                } else {
                    try {
                        ;({ publicKey } = (await getDevice({ deviceName })) || {})
                    } catch (error) {
                        sent = send({
                            type: 'error',
                        })
                    }
                    if (!publicKey) {
                        notRegistered = true
                        try {
                            ;({ publicKey } = (await getDevicePre({ deviceName })) || {})
                        } catch (error) {}
                    }
                    if (!publicKey) {
                        sent = send({
                            type: 'error',
                            data: { message: 'auth deviceName not found' },
                        })
                    } else {
                        let unsignedDeviceName
                        let timestamp
                        let err
                        try {
                            const unsignedMessage = unsign({
                                publicKey,
                                signedMessage,
                            })
                            json = JSON.parse(unsignedMessage)
                            ;({ deviceName: unsignedDeviceName, timestamp } = json)
                        } catch (error) {
                            err = true
                            console.log('error:', error.message)
                            console.log('error parsing unsignedMessage')
                        }

                        if (err || !unsignedDeviceName || !timestamp) {
                            sent = send({
                                type: 'error',
                                data: { message: 'error parsing or opening' },
                            })
                        } else if (
                            unsignedDeviceName !== deviceName ||
                            new Date().getTime() - timestamp >= AUTH_TIMESTAMP_LAG
                        ) {
                            sent = send({
                                type: 'error',
                                data: { message: 'auth error' },
                            })
                        } else {
                            if (notRegistered) {
                                ws.registering = true
                                sent = send({
                                    type: 'command',
                                    data: { code: 'LIST_WIFI' },
                                })
                            } else {
                                ws.isAuth = true
                                sent = send({
                                    type: 'result',
                                    data: { message: 'success' },
                                })
                            }
                            ws.deviceName = deviceName
                        }
                    }
                }
            } else if (ws.registering && type === 'result' && data.wifi) {
                try {
                    // saving device and wifi
                    await initDevice({
                        deviceName: ws.deviceName,
                        wifi: data.wifi,
                    })
                    ws.registering = false
                    ws.isAuth = true
                    sent = send({
                        type: 'result',
                        data: { message: 'success' },
                    })
                } catch (err) {
                    sent = send({
                        type: 'error',
                    })
                }
            }
        }

        // Till now - syntax error checked && auth checked
        if (!sent) {
            if (!ws.isAuth) {
                console.log(`server not authenticated for ip ${ws.ip}`)
                send({
                    type: 'error',
                    data: { message: 'server not authenticated' },
                })
            } else {
                send({
                    type: 'info',
                    data: { message: `server received a message of type [${type}]` },
                })
            }
        }
    })
    send({ type: 'info', data: { message: 'server connected' } })
})

setInterval(function ping() {
    wss.clients.forEach(ws => {
        ws.isAlive = false
        ws.ping(() => {})
        console.log(`ping to ip ${ws.ip}`)
    })
}, PING_PONG_INTERVAL)

console.log(' wss.clients', wss.clients)

const setFind = (set, cb) => {
    for (const e of set) {
        if (cb(e)) {
            return e
        }
    }
    return undefined
}

const findConnection = deviceName =>
    setFind(wss.clients, ws => ws.deviceName === deviceName)

export const sendCommand = ({ deviceName, code, params }) => {
    const ws = findConnection(deviceName)
    if (!ws || !ws.isAuth) {
        return false
    } else {
        try {
            const promise = toto(
                new Promise(resolve => (ws.resolveResult = resolve)),
                30000
            )
            ws.send(JSON.stringify({ type: 'command', data: { code, params } }))
            return promise
        } catch (err) {
            return false
        }
    }
}
