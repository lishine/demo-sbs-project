import React, { useState, useEffect } from 'react'

// Common
import { Flex, H3, Box, Span, Button, SvgIcon, Grid, H4 } from 'styles/ss-components'
import { usePathStore, usePathActions } from 'common/hooks/hooks'
import { translate } from 'utils/langugae'

// Local
import { path } from './_user'

export const DeleteModal = ({ onClickClose }) => {
    const { deleting, result } = usePathStore(path)(['deleting', 'result'])
    const { setErr, deleteUser } = usePathActions(path)(['setErr', 'deleteUser'])

    useEffect(() => {
        setErr(undefined)
    }, [])

    return (
        <Flex
            px={2}
            pb={3}
            pt={2}
            height="100%"
            flexDirection="column"
            justifyContent="center"
        >
            <H3 mb={5} textAlign="center">
                {translate('You are about to delete user, are you sure?')}
            </H3>
            <Grid gridAutoFlow="column" justifyContent="space-between">
                <Button
                    mt={2}
                    width={150}
                    className="btn-table"
                    onClick={deleteUser}
                    disabled={deleting}
                    loading={deleting}
                >
                    {translate('Delete')}
                </Button>
                <Button mt={2} width={150} className="btn-table" onClick={onClickClose}>
                    {translate('Close')}
                </Button>
            </Grid>
            {result && <Flex py={2}>{result.message}</Flex>}
        </Flex>
    )
}
