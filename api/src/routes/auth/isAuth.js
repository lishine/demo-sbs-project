import isEmpty from 'lodash/isEmpty'

import { throwError, throwIf } from 'utils/error'
import { queryDb as _queryDb } from 'utils/utils'
import { decodeToken } from './common/token'
import { getCookie } from './common/cookie'
import { destroyCookie } from 'nookies'

const queryDb = _queryDb({ role: 'auth' })

const getUser = props =>
    queryDb(
        /* GraphQL */ `
            query getUser($id: Int!) {
                user(where: { id: { _eq: $id } }) {
                    role
                }
            }
        `,
        props
    ).then(d => d.user[0] || {})

export const isAuth = async ({ body, req, res }) => {
    let token =
        body.token || (req.headers.Authorization && req.headers.Authorization.token)
    if (!token) {
        token = getCookie(req).demo2Token
        console.log('req.headers.cookie', req.headers.cookie)
        console.log('token', token)
    }

    throwIf(!token, 400, 'No token')()

    const { userId, expireIn, timestamp } = decodeToken(token, 'access')
    const now = new Date().getTime()

    console.log('{ userId, expireIn, timestamp }', {
        userId,
        expireIn,
        timestamp,
    })
    console.log('now', now)
    console.log('timestamp + expireIn - now', timestamp + expireIn - now)

    if (timestamp + expireIn < now) {
        destroyCookie(res, 'demo2Token', {})
        console.log('DESTROYING COOKIE')
        throwIf(true, 400, 'NO AUTHORIZATION')
    }

    const { role } = await getUser({ id: userId })
    return { user: { id: userId, role } }
}
