import React, { useState, useEffect } from 'react'

// Common
import { Filter } from '../../../common/rtable/RTable'
import { Box, Flex } from 'styles/ss-components'
import { translate } from 'utils/langugae'

export const columnsTemplate = [
    {
        accessor: 'selectRow',
        Header: translate('Select'),
        Cell: ({ row: { toggleSelected, isSelected, index } }) => (
            <Flex
                pt="3px"
                h={1}
                justifyContent="center"
                alignItems="center"
                cursor="default"
                onClick={
                    toggleSelected
                        ? () => {
                              toggleSelected(index)
                          }
                        : () => {}
                }
            >
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}}
                    aria-label="Select row"
                />
            </Flex>
        ),
        width: 60,
    },
    { Header: translate('Index'), accessor: (row, index) => index, width: 100 },
    {
        Header: translate('Device Name'),
        accessor: 'deviceName',
        canFilter: true,
        filterProperties: { kind: 'textBeginning' },
        Filter,
    },
    {
        Header: translate('Door Code'),
        accessor: 'doorCode',
    },
    {
        Header: translate('Gate Phone'),
        accessor: 'gatePhone',
    },
    {
        Header: translate('City'),
        accessor: 'city',
        canFilter: true,
        filterProperties: { kind: 'textBeginning' },
        Filter,
        canSortBy: true,
    },
    {
        Header: translate('House'),
        accessor: 'house',
    },
    {
        Header: translate('Street'),
        accessor: 'street',
        canFilter: true,
        filterProperties: { kind: 'textContains' },
        Filter,
        canSortBy: true,
    },
]
