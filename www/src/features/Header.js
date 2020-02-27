import React from 'react'
import { Flex, NavLink, SvgIcon, Box } from 'styles/ss-components'
import styled from '@emotion/styled'

// Common
import { Login, Logout, Person } from 'svg/icons/index'
import { RouteLink } from 'common/RouteLink'
import { boxCss } from 'styles/ss-utils'
import { usePathStore, usePathActions } from 'common/hooks/hooks'
import { translate } from 'utils/langugae'

export const Header = () => {
    const {
        isAuth,
        profile: { user },
    } = usePathStore('auth')(['isAuth', 'profile'])
    const { showLogin, logout } = usePathActions('auth')(['showLogin', 'logout'])

    return (
        <Box mt={2} mb={3} className="padding-container">
            {isAuth ? (
                <Flex justifyContent="space-between">
                    <Flex
                        maxWidth={600}
                        flex={1}
                        justifyContent="space-between"
                        alignItems="flex-start"
                    >
                        <Link route="profile">{translate('Profile')}</Link>
                        <Link route="registerDevice">{translate('Register Device')}</Link>
                        {user.role === 'OWNER' && user.deviceCount === 1 ? (
                            <Link
                                route="manageDevice"
                                deviceName={user.device.deviceName}
                            >
                                {translate('Manage Device')}
                            </Link>
                        ) : (
                            <Link route="manageDevices">
                                {translate('Manage Devices')}
                            </Link>
                        )}
                        <Link route="manageUsers">{translate('Manage Users')}</Link>
                        <Link route="monitorEvents">{translate('Monitor Events')}</Link>
                    </Flex>
                    <Flex flexDirection="column" alignItems="center">
                        <NavLink onClick={logout}>
                            {translate('Sign Out')}
                            <SvgIcon flipXIfRTL mis={1}>
                                <Logout transform="rotate(180)" />
                            </SvgIcon>
                        </NavLink>
                        <Box>
                            <SvgIcon mie={[1]}>
                                <Person />
                            </SvgIcon>
                            {user.name}
                        </Box>
                    </Flex>
                </Flex>
            ) : (
                <Flex>
                    <NavLink onClick={() => showLogin({ mode: 'SignIn' })}>
                        {translate('Sign In')}
                        <SvgIcon flipXIfRTL mis={[1]}>
                            <Login />
                        </SvgIcon>
                    </NavLink>
                </Flex>
            )}
        </Box>
    )
}

const active = {
    textDecoration: 'none',
    borderBottom: '2px solid currentColor',
    color: 'primary',
}

const mainLinkStyle = {
    text: 'menu',
    p: 1,
    pb: '4px',
    color: 'dark-normal',
    borderBottom: '2px solid transparent',
    cursor: 'pointer',
    '&:hover': active,
    '&.active': active,
}

const Link = styled(RouteLink)(
    boxCss.css({
        ...mainLinkStyle,
        textAlign: 'center',
        width: 'min-content',
        wordSpacing: '100px',
    })
)
