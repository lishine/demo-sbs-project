import React, { useState, useEffect } from 'react'
import { css } from '@emotion/core'

// Common
import { Flex, H3, Box, Span, Button, SvgIcon, H4 } from 'styles/ss-components'
import { RTable } from 'common/rtable/RTable'
import { RouteLink } from 'common/RouteLink'
import { useRTable } from 'common/rtable/useRTable'
import { router } from 'routes'
import { useToggle, usePathStore, usePathActions } from 'common/hooks/hooks'
import { translate } from 'utils/langugae'

// Local
import { path } from './_devices'
import { columnsTemplate } from './columnsTemplate'

export const Table = () => {
    const { loading, data } = usePathStore(path)(['loading', 'data'])
    const { load, setDeviceNames } = usePathActions(path)(['load', 'setDeviceNames'])

    const tableInstanceProps = useRTable({
        tableStateInit: { pageCount: 0, pageSize: 3 },
        tableProps: {
            data,
            columns: columnsTemplate,
            manualSorting: true,
            manualFilters: true,
            manualPagination: true,
            disableMultiSort: false,
            disableGrouping: true,
            disableSorting: true,
            disableFilters: true,
        },
    })
    const {
        setTotalCount,
        tableState,
        totalRowsSelected,
        rowsSelected,
    } = tableInstanceProps
    useEffect(() => {
        const deviceNames = []
        rowsSelected.forEach((selected, index) => {
            if (selected) {
                deviceNames.push(data[index].deviceName)
            }
        })
        setDeviceNames(deviceNames)
    }, [rowsSelected])

    const { sortBy, filters, pageIndex, pageSize } = tableState

    useEffect(() => {
        load({ tableState, setTotalCount, columns: columnsTemplate })
    }, [sortBy, filters, pageIndex, pageSize])

    return (
        <RTable
            {...{
                loading,
                onRowClick: ({ index }) =>
                    router.pushRoute('manageDevice', {
                        deviceName: data[index].deviceName,
                    }),
                ...tableInstanceProps,
            }}
        />
    )
}
