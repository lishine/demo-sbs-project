let client = new WebSocket('ws://localhost:9000')
client.onopen = function f() {
    console.log('client opening')
}
client.onclose = function f() {
    console.log('client closing')
}
client.onmessage = function message(event) {
    console.log(`message ${event.data}`)
}
