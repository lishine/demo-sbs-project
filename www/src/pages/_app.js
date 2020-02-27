// Node Modules
import React, { useEffect } from 'react'
import Head from 'next/head'
import { withRouter, default as nextRouter } from 'next/router'
import withRedux from 'next-redux-wrapper'
import cookie from 'cookie'
import { destroyCookie } from 'nookies'
import jwtDecode from 'jwt-decode'
import App, { Container } from 'next/app'
import { StoreProvider } from 'easy-peasy'
import { ThemeProvider } from 'emotion-theming'

// Common
import { isRouteEnable, getRouteName, router } from 'routes'
import { makeStore } from 'features/makeStore'
import { GlobalCss, theme } from 'styles/theme'

// Local
import { ModalSelect } from 'common/modal/ModalSelect'
import { Header } from 'features/Header'

import 'scss/index.scss'
import { Flex } from 'styles/ss-components'
import { usePathStore } from 'common/hooks/hooks'

export let store

export const redirect = (ctx, path) => {
    if (process.browser) {
        nextRouter.push(path)
    } else {
        ctx.res.writeHead(301, { Location: path })
        ctx.res.end()
    }
}

// if (process.env.NODE_ENV !== 'production') {
//     const whyDidYouRender = require('@welldone-software/why-did-you-render')
//     whyDidYouRender(React)
// }

export let globalCtx

class MyApp extends App {
    static async getInitialProps({ Component, ctx }) {
        console.log('iiiin _app')
        console.log('process.env.NODE_ENV', process.env.NODE_ENV)
        console.log('process.env.DEPLOY_ENV', process.env.DEPLOY_ENV)

        globalCtx = ctx
        const { store, pathname, query, asPath } = ctx
        store.getActions().reset()
        const route = getRouteName(pathname)
        store.getActions().router.set({
            pathname,
            query,
            asPath: asPath.split('?')[0],
            route,
        })

        if (process.browser) {
            console.log('* IN BROWSER')
        } else {
            console.log('* NOT in browser')
            if (asPath === '/logout') {
                console.log('pushing logout')
                destroyCookie(ctx, 'demo2Token')
                await store.getActions().auth.showLogin()
                redirect(ctx, '/')
            } else {
                try {
                    const { demo2Token } = cookie.parse(ctx.req.headers.cookie) || {}
                    console.log('demo2Token', demo2Token)
                    const { expireIn, timestamp } = jwtDecode(demo2Token)
                    const now = new Date().getTime()
                    if (timestamp + expireIn < now) {
                        console.log('Access token is expired')
                        destroyCookie(ctx, 'demo2Token')
                        await store.getActions().auth.showLogin()
                    } else {
                        await store.getActions().auth.enter()
                    }
                } catch (error) {
                    await store.getActions().auth.showLogin()
                    console.log('No token')
                }
            }
        }

        const pageProps = Component.getInitialProps
            ? await Component.getInitialProps(ctx)
            : {}
        // else if (store.getState().auth.isAuth && pathname === '/login') {
        // console.log('redirecting to home')
        // redirect(ctx, '/')
        // }
        return { pageProps }
    }
    constructor(props) {
        super(props)
        store = props.store

        if (process.browser) {
            console.log('* BROWSER in constructor')
        } else {
            console.log('* SERVER in constructor')
        }
    }

    render() {
        const { Component, pageProps, store } = this.props

        if (process.browser) {
            console.log('$ BROWSER in render _app')

            const { pathname, query, asPath } = this.props.router
            console.log('{ pathname, query, asPath }', {
                pathname,
                query,
                asPath,
            })
            store.getActions().router.set({
                pathname,
                query,
                asPath,
                route: getRouteName(pathname),
            })
        } else {
            console.log('$ SERVER in render _app')
        }

        return (
            <Container>
                <Head>
                    <title>demo2</title>
                </Head>
                <StoreProvider store={store}>
                    <ThemeProvider theme={theme}>
                        <GlobalCss />
                        <div className="page-container">
                            <Header />
                            <ModalSelect />
                            <IsAuth>
                                {({ authorized }) =>
                                    authorized ? (
                                        <Component store={store} {...pageProps} />
                                    ) : (
                                        <Flex justifyContent="center">
                                            NOT AUTHORIZED
                                        </Flex>
                                    )
                                }
                            </IsAuth>
                        </div>
                    </ThemeProvider>
                </StoreProvider>
            </Container>
        )
    }
}

const IsAuth = ({ children }) => {
    const { route } = usePathStore('router')()
    const { isAuth, profile } = usePathStore('auth')()

    let authorized = false
    if (isAuth) {
        const { role, deviceCount } = profile.user
        if (isRouteEnable({ route, role, deviceCount })) {
            authorized = true
        } else {
            console.error(`route ${route} not enabled for role ${role}`)
        }
    }
    console.log('authorized', authorized)

    return children({ authorized })
}

export default withRedux(makeStore, { debug: false })(withRouter(MyApp))
