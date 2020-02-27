import WebSocket from 'ws'

// Local
import { PING_PONG_INTERVAL } from '../constants'

function heartbeat() {
    clearTimeout(this.pingTimeout)
    console.log('client received ping')
    // Use `WebSocket#terminate()`, which immediately destroys the connection,
    // instead of `WebSocket#close()`, which waits for the close timer.
    // Delay should be equal to the interval at which your server
    // sends out pings plus a conservative assumption of the latency.
    this.pingTimeout = setTimeout(() => {
        console.log('client terminating')
        this.terminate()
    }, PING_PONG_INTERVAL + 5000)
}

if (process.env.NODE_ENV === 'development') {
    console.log('ws client')

    const client = new WebSocket('ws://localhost:9000')
    client.on('open', heartbeat)
    client.on('ping', heartbeat)
    client.on('close', function clear() {
        console.log('client closing')
        clearTimeout(this.pingTimeout)
    })

    // setTimeout(() => client.terminate(), 40000)
}
