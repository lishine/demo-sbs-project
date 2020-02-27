import fetch from 'isomorphic-unfetch'
import get from 'lodash/fp/get'
import camelize from 'camelize'
import { default as fpFind } from 'lodash/fp/find'
import { default as fpPick } from 'lodash/fp/pick'
import { default as freduce } from 'lodash/fp/reduce'
import trim from 'lodash/trim'
import { snakize } from 'lib/snakize'

export const find = fpFind.convert({ cap: false })
export const pick = fpPick
export const reduce = freduce.convert({ cap: false })

export const trimObjectProperties = obj => {
    const newObj = {}
    for (const [key, value] of Object.entries(obj)) {
        newObj[key] = trim(value)
    }
    return newObj
}

export const mapToObject = func => arrayOrObject =>
    reduce((acc, value, key) => {
        return Object.assign(acc, func(value, key))
    }, {})(arrayOrObject)

export const mapValuesToObject = func => arrayOrObject =>
    reduce((acc, value, key) => {
        return Object.assign(acc, { [key]: func(value) })
    }, {})(arrayOrObject)

export const queryDb = user => (query, variables) => {
    variables = snakize(variables)
    const url = process.env.DB_GRAPHQL_URL
    console.log(
        `sending query to url ${url}, userId ${user.id}, role ${user.role}`,
        `query ${query}`,
        'variables',
        JSON.stringify(variables, 0, 2)
    )

    return post(
        url,
        { query, variables },
        {
            'x-hasura-admin-secret': process.env.HASURA_GRAPHQL_ADMIN_SECRET,
            'x-hasura-user-id': user.id,
            'x-hasura-role': user.role,
        },
        true
    ).then(d => {
        if (!d.data) {
            const firstError = d.errors[0]
            const { message } = firstError
            console.log('d.errors', d.errors)
            const { code } = firstError.extensions
            const error = Error()
            error.message = message
            error.code = code
            error.query = query
            error.vars = variables
            error.errorArray = d.errors
            throw error
        } else {
            console.log('d', JSON.stringify(d))
        }
        return camelize(d.data)
    })
}

export const post = (url, json, headers, iWillProcess400Error) =>
    fetch(url, {
        method: 'POST',
        headers: Object.assign({ 'Content-Type': 'application/json' }, headers),
        body: JSON.stringify(json || {}),
    })
        .then(async res => {
            if (res.ok) {
                console.log('res.ok')
                return res
            } else {
                if (iWillProcess400Error) {
                    return res
                }
                console.log('res not ok')
                let data
                try {
                    data = await res.json()
                } catch (error) {
                    console.log('error', error)
                }
                const err = new Error(`Request rejected with status ${res.status}`)
                err.response = { res, data, status: res.status }
                throw err
            }
        })
        .then(response => response.json())

export const toto = (p, t) => {
    const promise = get('promise')(p) || p
    const timeOut = get('timeOut')(p) || t
    return timeOutPromise({ promise, timeOut })
        .then(data => ({ data }))
        .catch(err => {
            if (err.message === 'timeOut') {
                return { timeOut: true }
            } else {
                return { err }
            }
        })
}

function timeOutPromise({ timeOut, promise }) {
    let handle
    if (!timeOut) {
        return promise
    }

    return Promise.race([
        promise,
        new Promise((resolve, reject) => {
            handle = setTimeout(() => {
                reject(new Error('timeOut'))
            }, timeOut)
        }),
    ]).then(
        v => {
            clearTimeout(handle)
            return v
        },
        err => {
            clearTimeout(handle)
            throw err
        }
    )
}

export const sleep = ms => {
    return new Promise(resolve => setTimeout(resolve, ms))
}
