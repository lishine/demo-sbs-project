import React, { useState, useEffect, useMemo } from 'react'
import {
    useTable,
    useColumns,
    useRows,
    useFilters,
    useSortBy,
    useExpanded,
    usePagination,
    useFlexLayout,
    useSelectRow,
    useTableState,
} from 'lib/react-table/index'

export const useRTable = ({ tableStateInit, tableProps }) => {
    const [tableState, setTableState] = useTableState(tableStateInit)
    const [totalCount, _setTotalCount] = useState(0)

    const tableInstance = useTable(
        { state: [tableState, setTableState], ...tableProps },
        useColumns,
        useRows,
        useFilters,
        useSortBy,
        useExpanded,
        usePagination,
        useFlexLayout,
        useSelectRow
    )
    const { rows } = tableInstance

    const { rowsSelected, totalRowsSelected } = useMemo(() => {
        let totalRowsSelected = 0
        let rowsSelected = []
        rows.forEach(({ isSelected, index }) => {
            rowsSelected[index] = isSelected
            if (isSelected) {
                totalRowsSelected += 1
            }
        })
        return { rowsSelected, totalRowsSelected }
    }, [rows])

    const setTotalCount = totalCount => {
        _setTotalCount(totalCount)
        const { pageSize } = tableState
        setTableState(old => ({
            ...old,
            pageCount: Math.ceil(totalCount / pageSize),
        }))
    }

    return {
        tableInstance,
        totalCount,
        setTotalCount,
        tableState,
        totalRowsSelected,
        rowsSelected,
    }
}
