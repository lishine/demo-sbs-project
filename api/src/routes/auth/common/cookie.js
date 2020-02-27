import nookies from 'nookies'

export const createCookie = (res, token) =>
    nookies.set({ res }, 'demo2Token', token, {
        domain: process.env.COOKIE_DOMAIN,
        maxAge: +process.env.ACCESS_TOKEN_EXPIRE_IN / 1000,
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production',
    })

export const getCookie = req => nookies.get({ req })
