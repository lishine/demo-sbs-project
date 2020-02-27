import path from 'path'
import kebabCase from 'lodash/fp/kebabCase'
import micro, { json, run } from 'micro'
import { router, post, options } from 'micro-fork'

// Common
import { throwError } from './error'
import { isAuth } from 'routes/auth/isAuth'
import { queryDb } from 'utils/utils'

const API_PATH = '/api'

const handleError = fn => (req, res) =>
    fn(req, res).catch(err => {
        console.log('err.message', err.message)
        err.data = { message: err.message }
        console.log('err.originalMessage', err.originalMessage)
        console.log('err.status', err.status)
        micro.send(res, err.status || 500, err)
    })

const convertData = fn => async (req, res) =>
    fn({ body: await json(req), host: req.headers.host, req, res })

const auth = fn => async props => {
    const { url, headers } = props.req
    const { host } = headers
    console.log('host', host)
    if (RegExp(`${API_PATH}/auth`).test(url)) {
        console.log('confirmed AUTH url', host, url)
        return fn(props)
    } else if (RegExp(`${API_PATH}/admin`).test(url) && RegExp('^localhost').test(host)) {
        console.log('confirmed ADMIN url', host, url)
        return fn(props)
    } else {
        console.log('confirmed REGULAR url', host, url)
        const { user } = await isAuth(props)
        return fn({ user, queryDb: queryDb(user), ...props })
    }
}

const wrapService = fn => (req, res) => run(req, res, handleError(convertData(auth(fn))))

const notfound = (req, res) => micro.send(res, 404, 'Not found route')
// For the cors preflight
const notfoundOptions = (req, res) => micro.send(res, 200, 'Not found route')

export const postRouter = (routesObject, dirname) => {
    const routes = Object.entries(routesObject).reduce((acc, [route, routeFn]) => {
        return [
            ...acc,
            post(
                path.join(`${API_PATH}/`, path.basename(dirname), kebabCase(route)),
                wrapService(routeFn)
            ),
        ]
    }, [])
    return router()(...routes, post('/*', notfound), options('/*', notfoundOptions))
}

export const localPostRouter = routesObject => {
    const routes = Object.entries(routesObject).reduce((acc, [route, routeFn]) => {
        return [...acc, post(path.join('/api/', kebabCase(route), '/*'), routeFn)]
    }, [])
    console.log('-----------RRRREEEAAADDDYYY--------------')
    return router()(...routes, post('/*', notfound), options('/*', notfoundOptions))
}
