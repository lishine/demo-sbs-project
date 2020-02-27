import React, { useState, useEffect } from 'react'
import { css } from '@emotion/core'
import styled from '@emotion/styled'

// Common
import {
    Select,
    Input,
    Header,
    Table,
    HeaderRow,
    Cell,
    Row,
    Button,
    Pagination,
} from './styled'
import { Flex, H3, Box, Span } from 'styles/ss-components'
import { Map } from 'utils/utils'
import { translate } from 'utils/langugae'

export const Filter = header => {
    return (
        <Box w={1}>
            <Input
                placeholder={`${translate('Search')}...`}
                value={header.filterValue || ''}
                onChange={e => header.setFilter(e.target.value)}
            />
        </Box>
    )
}

export const SelectFilter = header => {
    return (
        <Box w={1}>
            <Select
                value={header.filterValue || ''}
                onChange={e => header.setFilter(e.target.value)}
            >
                <Map collection={header.selectFilterOptions}>
                    {({ value, text }) => <option value={value}>{text}</option>}
                </Map>
            </Select>
        </Box>
    )
}

export const RTable = ({ loading, onRowClick, tableInstance, totalCount }) => {
    const {
        getTableProps,
        headerGroups,
        rows,
        getRowProps,
        pageOptions,
        page,
        state: [{ pageIndex, pageSize, sortBy, groupBy, filters }],
        gotoPage,
        prepareRow,
        previousPage,
        nextPage,
        setPageSize,
        canPreviousPage,
        canNextPage,
    } = tableInstance

    const renderRow = (row, index, style = {}) => {
        if (!row) {
            return (
                <Row {...{ style, even: index % 2 }}>
                    <Cell>Loading more...</Cell>
                </Row>
            )
        }
        prepareRow(row)
        return (
            <Row
                onClick={() => onRowClick({ index })}
                {...row.getRowProps({ style, even: index % 2, selected: row.isSelected })}
            >
                {row.cells.map(cell => {
                    return (
                        <Cell
                            {...cell.getCellProps()}
                            onClick={e => {
                                if (cell.column.id === 'selectRow') {
                                    e.stopPropagation()
                                }
                            }}
                        >
                            <span>{cell.render('Cell')}</span>
                        </Cell>
                    )
                })}
            </Row>
        )
    }
    const tableBody = page && page.length ? page.map((row, i) => renderRow(row, i)) : null

    const pagination = pageOptions.length ? (
        <Pagination {...getRowProps()}>
            <Cell>
                <Box flex={1}>
                    <Box
                        display="grid"
                        gridAutoFlow="column"
                        gridAutoColumns={150}
                        gridColumnGap={2}
                        justifyContent="stretch"
                        width={200}
                    >
                        <Button
                            onClick={() => previousPage()}
                            disabled={!canPreviousPage}
                        >
                            {translate('Previous')}
                        </Button>
                        <Button onClick={() => nextPage()} disabled={!canNextPage}>
                            {translate('Next')}
                        </Button>
                    </Box>
                </Box>
                {(canNextPage || canPreviousPage) && (
                    <Flex flex={1} justifyContent="center">
                        <span>
                            Page{' '}
                            <strong>
                                {pageIndex + 1} of {pageOptions.length}
                            </strong>
                        </span>
                    </Flex>
                )}
                <Flex flex={1} justifyContent="flex-end" alignItems="center">
                    {(canNextPage || canPreviousPage) && (
                        <>
                            <Span> Go to page: </Span>
                            <Span mis={2} width={70}>
                                <Input
                                    type="number"
                                    defaultValue={pageIndex + 1}
                                    onChange={e => {
                                        const page = e.target.value
                                            ? Number(e.target.value) - 1
                                            : 0
                                        gotoPage(page)
                                    }}
                                    style={{ width: '100px' }}
                                />
                            </Span>
                        </>
                    )}
                    <Span mis={5}>
                        <Select
                            value={pageSize}
                            onChange={e => {
                                setPageSize(Number(e.target.value))
                            }}
                        >
                            {[3, 10, 20, 30, 40, 50].map(pageSize => (
                                <option key={pageSize} value={pageSize}>
                                    {`${translate('Show')} ${pageSize}`}
                                </option>
                            ))}
                        </Select>
                    </Span>
                </Flex>
            </Cell>
        </Pagination>
    ) : null

    return (
        <Table {...getTableProps()}>
            {headerGroups.map(headerGroup => (
                <HeaderRow {...headerGroup.getRowProps()}>
                    {headerGroup.headers.map(column => (
                        <Header
                            {...column.getHeaderProps()}
                            sorted={column.sorted}
                            sortedDesc={column.sortedDesc}
                            sortedIndex={column.sortedIndex}
                            css={{ userSelect: 'none' }}
                        >
                            <Flex
                                {...column.getSortByToggleProps()}
                                mt="-0.6rem"
                                w={1}
                                py={1}
                                justifyContent="center"
                                alignItems="center"
                            >
                                {column.render('Header')}
                            </Flex>
                            {column.canFilter ? (
                                <div>{column.render('Filter')}</div>
                            ) : null}
                        </Header>
                    ))}
                </HeaderRow>
            ))}
            {tableBody}
            <Row {...getRowProps()}>
                {loading ? (
                    <Cell>
                        <strong>Loading...</strong>
                    </Cell>
                ) : (
                    <Cell>
                        <Span mis="11px">{`${translate(
                            'Total Records'
                        )} ${totalCount}`}</Span>
                    </Cell>
                )}
            </Row>
            {pagination}
        </Table>
    )
}

// {
//     Header: 'Profile Progress',
//     accessor: 'progress',
//     aggregate: 'average',
//     minWidth: 200,
//     Cell: row => (
//         <div
//             style={{
//                 width: `${row.value}%`,
//                 minWidth: '5px',
//                 height: '20px',
//                 backgroundColor: `hsla(${row.value}, 100%, 45%, 1)`,
//                 borderRadius: '2px',
//                 transition: 'all .4s ease',
//             }}
//         />
//     ),
// },
