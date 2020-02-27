import nookies, { destroyCookie } from 'nookies'

export const logout = async ({ res }) => {
    console.log('LOGOUTING')
    console.log('destroying cookie')
    nookies.set({ res }, 'demo2Token', '', {
        maxAge: -1,
        path: '/',
        domain: process.env.COOKIE_DOMAIN,
    })
    return { ok: true }
}
