import React, { useState, useEffect } from 'react'

// Common
import { Filter, SelectFilter } from 'common/rtable/RTable'
import { titleCase } from 'utils/utils'
import { translate } from 'utils/langugae'

export const columnsTemplate = [
    { Header: translate('Index'), accessor: (row, index) => index, width: 100 },
    {
        Header: translate('Name'),
        accessor: 'name',
        canFilter: true,
        filterProperties: { kind: 'textContains' },
        Filter,
        canSortBy: true,
    },
    {
        Header: translate('Phone'),
        accessor: 'phone',
        canFilter: true,
        filterProperties: { kind: 'textBeginning' },
        Filter,
    },
    {
        Header: translate('Role'),
        id: 'role',
        accessor: row => titleCase(row.role),
        canFilter: true,
        filterProperties: { kind: 'textBeginning' },
        Filter: SelectFilter,
        selectFilterOptions: [],
    },
]
