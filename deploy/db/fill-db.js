const post = require('./utils/post')

var env = require(`../../env-config-${process.env.DEPLOY_ENV}.js`)

// var args = process.argv.slice(2)
// const machine = args[0]
// console.log('args', args)

let url
url = `http://localhost:${env.API_PORT_HOST}/api/admin/fill-db`
console.log('url', url)

post(url)
    .then(d => console.log('d', d))
    .catch(err => console.log('err.message', err.message))
