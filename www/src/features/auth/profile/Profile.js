import React, { useState, useEffect } from 'react'

// Common
import { Flex, H3, Box, Span, Button, Grid } from 'styles/ss-components'
import { usePathStore, usePathActions } from 'common/hooks/hooks'
import { translate } from 'utils/langugae'

// Local
import { path } from './_profile'

export const Profile = () => {
    const { name, phone } = usePathStore('auth')('profile.user')
    const showLogin = usePathActions('auth')('showLogin')
    const { openModal } = usePathActions()(['openModal'])

    return (
        <Flex width={500} mx="auto" flexDirection="column">
            <H3 mx="auto" pt={4} pb={10}>
                {translate('Profile')}
            </H3>
            <Box>
                <Box pb={3} display="grid" gridRowGap={2}>
                    <Grid
                        gridAutoFlow="column"
                        gridAutoColumns="1fr"
                        alignItems="center"
                        justifyContent="center"
                        pt={2}
                    >
                        <Span>
                            <strong>{translate('Name')}</strong>
                        </Span>
                        <Span>{name}</Span>
                        <Button
                            w={112}
                            mis="auto"
                            className="btn btn-primary"
                            onClick={() =>
                                openModal({
                                    component: 'ProfileEditForm',
                                    params: { initialValues: { name } },
                                })
                            }
                        >
                            {translate('Edit')}
                        </Button>
                    </Grid>
                    <Grid
                        gridAutoFlow="column"
                        gridAutoColumns="1fr"
                        alignItems="center"
                        justifyContent="center"
                        borderTop="2px solid var(--onwhite-normal)"
                        pt={2}
                    >
                        <Span>
                            <strong>{translate('Phone')}</strong>
                        </Span>
                        <Span>{phone}</Span>
                        <Button
                            w={112}
                            className="btn btn-primary"
                            justifySelf="end"
                            onClick={() => showLogin({ mode: 'UpdatePhone' })}
                        >
                            {translate('New Phone')}
                        </Button>
                    </Grid>
                </Box>
            </Box>
        </Flex>
    )
}
