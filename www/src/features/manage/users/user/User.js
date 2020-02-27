import React, { useState, useEffect } from 'react'

// Common
import { Flex, H3, Box, Span, Button, SvgIcon, Grid, H4 } from 'styles/ss-components'
import { RouteLink } from 'common/RouteLink'
import { Loading, mapToObject, Map } from 'utils/utils'
import { usePathStore, usePathActions } from 'common/hooks/hooks'
import { router } from 'routes'
import { translate } from 'utils/langugae'

// Local
import { path } from './_user'
import { Chevron, ChevronDown } from 'svg/icons/index'
import { Modal } from 'common/modal/Modal'
import { DeleteModal } from './DeleteModal'

const Content = () => {
    const { err, user, loading } = usePathStore(path)(['err', 'user', 'loading'])
    const { loadUser } = usePathActions(path)(['loadUser'])

    useEffect(() => {
        loadUser()
    }, [])

    if (err) {
        return (
            <Flex flex={1} alignItems="center" justifyContent="center">
                {err.message}
            </Flex>
        )
    }

    return (
        <Loading loading={loading}>
            <Grid py={5} px={20} gridRowGap={1}>
                <Grid gridAutoFlow="column" gridTemplateColumns="1fr 3fr">
                    <Span>
                        <strong>Name:</strong>
                    </Span>
                    <Span>{user.name}</Span>
                </Grid>
                <Grid gridAutoFlow="column" gridAutoColumns="1fr 3fr">
                    <Span>
                        <strong>Phone:</strong>
                    </Span>
                    <Span>{user.phone}</Span>
                </Grid>
                <Grid gridAutoFlow="column" gridAutoColumns="1fr 3fr">
                    <Span>
                        <strong>Role:</strong>
                    </Span>
                    <Span>{user.role}</Span>
                </Grid>
            </Grid>
        </Loading>
    )
}
export const User = () => {
    const { query } = usePathStore('router')()
    const { setUserId, setInitialized, reset, onDeleteModalClosing } = usePathActions(
        path
    )(['setUserId', 'setInitialized', 'reset', 'onDeleteModalClosing'])
    const { userId, isInitialized, user } = usePathStore(path)([
        'userId',
        'isInitialized',
        'user',
    ])

    useEffect(() => {
        const { userId } = query
        setUserId(userId)
        setInitialized(true)
        return () => reset()
    }, [query])
    if (!isInitialized) {
        return null
    }

    return (
        <Flex w={1000} mx="auto" flexDirection="column" justifyContent="flex-start">
            <H3 noBaselineShift mx="auto">
                User {user && user.phone}
            </H3>
            <Grid
                px={5}
                gridAutoFlow="column"
                justifyContent="space-between"
                alignItems="grid-start"
            >
                <Button
                    width={200}
                    className="btn-table"
                    onClick={() => router.replaceRoute('manageUsers')}
                >
                    <Span>
                        <SvgIcon flipXIfRTL mis="-6px">
                            <Chevron transform="rotate(180)" />
                        </SvgIcon>
                        {translate('Back')}
                    </Span>
                </Button>

                <Grid>
                    <RouteLink route="editUser" userId={userId}>
                        <Button width={200} className="btn-table">
                            {translate('Edit')}
                        </Button>
                    </RouteLink>
                    <Modal
                        onClosing={onDeleteModalClosing}
                        Trigger={
                            <Button mt={2} width={200} className="btn-table">
                                {translate('Delete')}
                            </Button>
                        }
                        bg="grey"
                        width={400}
                        height={300}
                    >
                        <DeleteModal />
                    </Modal>
                </Grid>
            </Grid>
            <Content />
        </Flex>
    )
}
