import fetch from 'isomorphic-unfetch'
import camelize from 'camelize'
import ReactDOM from 'react-dom'
import React, { useState, useEffect } from 'react'

// Common
import { sleep, toto } from './utils'
import { snakize } from '../lib/snakize'
import { globalCtx } from 'pages/_app'

export const queryDb = async (query, variables) => {
    variables = snakize(variables)
    console.log(`sending query`, `${query}`, 'variables', JSON.stringify(variables, 0, 2))

    let { data, err, timeOut } = await postApi({
        url: '/db/db-forward',
        json: { query, variables },
        iWillProcess400Error: true,
    })
    console.log('{ data, err, timeOut }', { data, err, timeOut })
    if (data && data.data) {
        data = camelize(data.data)
        return { data, err, timeOut }
    } else if (err || timeOut) {
        return { data, err, timeOut }
    } else {
        console.log('data.errors', JSON.stringify(data.errors, null, 2))
        return { queryError: data.errors }
    }
}

export const useQuery = query => {
    const [data, setData] = useState(undefined)
    const [err, setErr] = useState(undefined)
    const [timeOut, setTimeOut] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            const { data, err, timeOut } = await query()
            await sleep(1000)
            ReactDOM.unstable_batchedUpdates(() => {
                setData(data)
                setErr(err)
                setTimeOut(timeOut)
                setLoading(false)
            })
        }
        fetchData()
    }, [])
    return { data, loading, timeOut, err }
}

function setCookieFromResponse(ctx, res) {
    const cookie = res.headers.get('Set-Cookie')
    console.log('cookie', cookie)
    if (!cookie) {
        return
    }

    let cookies = []
    cookies.push(cookie)

    console.log('cookies', cookies)

    ctx.res.setHeader('Set-Cookie', cookies)
    console.log('setting ctx cookie')
}

export const postApi = async ({ url, ...props }) => {
    let base
    if (process.browser) {
        base = process.env.API_URL
    } else if (process.env.NODE_ENV === 'development') {
        base = process.env.API_URL
    } else {
        base = process.env.API_URL_DOCKER
    }
    url = `${base}/api${url}`
    return post({ url, ...props })
}

export const post = async ({
    url,
    json,
    iWillProcess400Error,
    timeOut: _timeOut,
    headers = {},
}) => {
    console.log('url', url)
    let options = {
        method: 'POST',
        accept: '*/*',
        body: JSON.stringify(json || {}),
    }
    Object.assign(headers, { 'Content-Type': 'application/json' })

    if (!process.browser) {
        headers.cookie = globalCtx.req.headers.cookie
    } else {
        options['credentials'] = 'include'
    }
    options.headers = headers

    const { err, timeOut, data } = await toto(
        fetch(url, options)
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
            .then(res => {
                if (globalCtx) {
                    console.log('setCookieFromResponse')
                    setCookieFromResponse(globalCtx, res)
                }
                console.log('res to json')
                return res.json()
            }),
        _timeOut || 30000
    )
    if (data) {
        // console.log(
        //     `post to ${url} with ${JSON.stringify(
        //         json,
        //         0,
        //         2
        //     )}\n success\n returning ${JSON.stringify(data, 0, 2)}`
        // )
    } else if (err) {
        console.error('post err', err.message, err.response)
    } else if (timeOut) {
        console.errror('post timeOut', timeOut)
    }
    return { data, err, timeOut }
}
