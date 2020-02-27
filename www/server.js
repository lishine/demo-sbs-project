const express = require('express')
const next = require('next')
const { router } = require('./src/routes')

const dev = process.env.NODE_ENV === 'development'
const dir = process.env.NODE_ENV === 'development' ? './src' : './'
const app = next({ dev, dir })
const server = express()
const handle = router.getRequestHandler(app)

app.prepare().then(() => {
    server.get('*', (req, res) => {
        return handle(req, res)
    })
    server.listen(3000)
})
