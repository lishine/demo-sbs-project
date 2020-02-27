import React, { useState, useEffect } from 'react'
import { css } from '@emotion/core'

// Common
import { Flex, H3, Box, Span, Button, SvgIcon } from 'styles/ss-components'
import { RTable } from '../../../common/rtable/RTable'
import { useRTable } from '../../../common/rtable/useRTable'
import { router } from 'routes'
import { usePathStore, usePathActions } from 'common/hooks/hooks'
import { translate } from 'utils/langugae'

// Local
import { path } from './_users'

export const Table = ({ columns }) => {
    const { loading, users } = usePathStore(path)(['users', 'loading'])
    const { loadUsers } = usePathActions(path)(['loadUsers'])

    const tableInstanceProps = useRTable({
        tableStateInit: { pageCount: 0, pageSize: 3 },
        tableProps: {
            data: users,
            columns,
            manualSorting: true,
            manualFilters: true,
            manualPagination: true,
            disableMultiSort: false,
            disableGrouping: true,
            disableSorting: true,
            disableFilters: true,
        },
    })
    const { setTotalCount, tableState } = tableInstanceProps
    const { sortBy, filters, pageIndex, pageSize } = tableState
    useEffect(() => {
        loadUsers({ tableState, setTotalCount })
    }, [sortBy, filters, pageIndex, pageSize])

    return (
        <RTable
            {...{
                loading,
                onRowClick: ({ index }) =>
                    router.pushRoute('manageUser', { userId: users[index].id }),
                ...tableInstanceProps,
            }}
        />
    )
}
