import React, { useState, useEffect } from 'react'
import { css } from '@emotion/core'
import styled from '@emotion/styled'

// Common
import { Flex, H3, Box, Span, Button, SvgIcon, Grid } from 'styles/ss-components'
import { usePathStore, usePathActions } from 'common/hooks/hooks'
import { translate } from 'utils/langugae'

// Local
import { path } from './_events'
import { Map } from 'utils/utils'

const HeaderCell = ({ children, ...props }) => (
    <Box p={1} pl={2} border="1px solid #ccc" {...props}>
        {children}
    </Box>
)
const Cell = ({ children, ...props }) => (
    <Box p={1} {...props}>
        {children}
    </Box>
)

let timeoutLoadEvents

export const Events = () => {
    const events = usePathStore(path)('events')
    const loadEvents = usePathActions(path)('loadEvents')

    useEffect(() => {
        timeoutLoadEvents = setTimeout(() => loadEvents(), 2000)
        return () => {
            clearTimeout(timeoutLoadEvents)
        }
    }, [events])

    useEffect(() => {
        loadEvents()
    }, [])

    return (
        <Flex width={1024} mx="auto" flexDirection="column" justifyContent="flex-start">
            <H3 mx="auto" mt={2} mb={6}>
                {translate('Events')}
            </H3>
            <Grid
                mt={2}
                gridAutoFlow="row"
                gridRowGap={1}
                gridColumnGap={3}
                gridTemplateColumns="70px 1fr 1fr 1fr"
                gridAutoRows="1fr"
            >
                <HeaderCell>{translate('Index')}</HeaderCell>
                <HeaderCell>{translate('Created At')}</HeaderCell>
                <HeaderCell>{translate('Device Name')}</HeaderCell>
                <HeaderCell>{translate('Code')}</HeaderCell>
                <Map collection={events}>
                    {({ createdAt, deviceName, code }, index) => (
                        <>
                            <Cell>{index}</Cell>
                            <Cell>{createdAt}</Cell>
                            <Cell>{deviceName}</Cell>
                            <Cell>{code}</Cell>
                        </>
                    )}
                </Map>
            </Grid>
        </Flex>
    )
}
