import React from 'react'

import { router, isRouteEnable } from 'routes'
import { boxCss } from 'styles/ss-utils'
import { usePathStore } from './hooks/hooks'

export const RouteLink = boxCss.toClassName(
    ({ decorate, style, route, className, children, ...props }) => {
        const { Link, getRoutePath } = router
        const asPath = usePathStore('router')('asPath')
        const { role, deviceCount } = usePathStore('auth')('profile.user')
        const href = getRoutePath(route, props)

        if (asPath === href) {
            className = `${className || ''} active`
        }

        style = style || {}
        style.textDecoration = decorate ? 'underline' : 'none'

        if (!isRouteEnable({ route, role, deviceCount })) {
            return null
        }

        return (
            <Link {...{ route }} {...props} prefetch shallow>
                <a style={style} className={className}>
                    {children}
                </a>
            </Link>
        )
    }
)
