import React, { useState, useEffect } from 'react'
import { css } from '@emotion/core'

// Common
import { Flex, H3, Box, Span, Button, SvgIcon } from 'styles/ss-components'
import { RouteLink } from 'common/RouteLink'
import { Loading, titleCase } from 'utils/utils'
import { usePathStore, usePathActions } from 'common/hooks/hooks'
import { translate } from 'utils/langugae'

// Local
import { path } from './_users'
import { Table } from './Table'
import { columnsTemplate } from './columnsTemplate'

export const Users = () => {
    const { loading, columns } = usePathStore(path)(['loading', 'columns'])
    const { loadRoles, setColumns } = usePathActions(path)(['loadRoles', 'setColumns'])

    let err
    useEffect(() => {
        const _loadRolesSelector = async () => {
            let data
            ;({ data, err } = await loadRoles())
            if (data) {
                const column = columnsTemplate.find(column => column.id === 'role')
                column.selectFilterOptions = data.map(role => ({
                    value: role,
                    text: titleCase(role),
                }))
                column.selectFilterOptions.unshift({ value: '', text: translate('ALL') })
                setColumns(columnsTemplate)
            }
        }
        _loadRolesSelector()
    }, [])

    return (
        <Flex width={1024} mx="auto" flexDirection="column" justifyContent="flex-start">
            <H3 mx="auto" mt={2} mb={6}>
                {translate('Users')}
            </H3>

            <Loading loading={loading}>
                <Flex mb="3px" justifyContent="space-between">
                    <RouteLink route="createUser">
                        <Button width={208} className="btn-table">
                            {translate('Create User')}
                        </Button>
                    </RouteLink>
                </Flex>

                {err ? (
                    <Flex flex={1} alignItems="center" justifyContent="center">
                        {err.message}
                    </Flex>
                ) : (
                    columns && <Table columns={columns} />
                )}
            </Loading>
        </Flex>
    )
}
