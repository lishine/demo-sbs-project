import React, { useState, useEffect } from 'react'
import isEmpty from 'lodash/isEmpty'

// Common
import { Flex, H3, Box, Span, Button, SvgIcon, Grid, H4 } from 'styles/ss-components'
import { RouteLink } from 'common/RouteLink'
import { useToggle, usePathStore, usePathActions } from 'common/hooks/hooks'
import { Loading, mapToObject, Map } from 'utils/utils'
import { router } from 'routes'
import { translate } from 'utils/langugae'

// Local
import { path } from './_device'
import { Chevron, ChevronDown } from 'svg/icons/index'
import { Actions } from '../actions/Actions'
import { JsonTree } from './JsonTree'
import { Modal } from 'common/modal/Modal'
import { DeleteModal } from './DeleteModal'

const Content = () => {
    const { err, data, loading = !data } = usePathStore(path)(['err', 'data', 'loading'])
    const { loadDevice } = usePathActions(path)(['loadDevice'])

    useEffect(() => {
        loadDevice()
    }, [])

    if (loading || err) {
        return (
            <Flex flex={1} mt="200px" alignItems="center" justifyContent="center">
                {err ? err.message : <Loading loading />}
            </Flex>
        )
    }

    if (isEmpty(data)) {
        return null
    }

    return (
        <Grid
            mt={2}
            mbs={10}
            gridAutoFlow="column"
            gridRowGap={1}
            gridColumnGap={3}
            gridTemplateRows="auto 400px"
            gridAutoColumns="1fr"
        >
            <H4 pl="28px">{translate('Details')}</H4>
            <JsonTree data={data.details} />
            <H4 pl={1}>{translate('Residents')}</H4>
            <JsonTree data={data.residents} />
            <H4 pl={1}>{translate('Owners')}</H4>
            <JsonTree data={data.owners} />
        </Grid>
    )
}

export const Device = () => {
    const { query } = usePathStore('router')()
    const { deviceName } = usePathStore(path)(['deviceName'])
    const { setDeviceName, onDeleteModalClosing } = usePathActions(path)([
        'setDeviceName',
        'onDeleteModalClosing',
    ])
    useEffect(() => {
        const { deviceName } = query
        setDeviceName(deviceName)
    }, [query])

    return (
        <Flex width={1024} mx="auto" flexDirection="column" justifyContent="flex-start">
            <H3 mx="auto" mt={2} mb={6}>
                {translate('Device')} {deviceName}
            </H3>
            {deviceName && (
                <>
                    <Grid
                        gridAutoFlow="column"
                        justifyContent="space-between"
                        alignContent="space-between"
                    >
                        <Button
                            width={200}
                            className="btn-table"
                            onClick={() => router.replaceRoute('manageDevices')}
                        >
                            <Span>
                                <SvgIcon flipXIfRTL mis="-6px">
                                    <Chevron transform="rotate(180)" />
                                </SvgIcon>
                                {translate('Back')}
                            </Span>
                        </Button>
                        <Grid>
                            <RouteLink route="editDevice" deviceName={deviceName}>
                                <Button width={200} className="btn-table">
                                    {translate('Edit Device')}
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
                    <H4 pt={1} my={2}>
                        {translate('Actions')}
                    </H4>
                    <Actions mis={1} pb={2} />
                    <Content />
                </>
            )}
        </Flex>
    )
}
