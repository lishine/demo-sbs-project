import { queryDb } from 'utils/fetch'
import { thunk } from 'easy-peasy'
import isEmpty from 'lodash/isEmpty'

// Common
import { rTableToHasura } from 'common/rtable/utils'
import { translate } from 'utils/langugae'

const getUsers = props =>
    queryDb(
        /* GraphQL */ `
            query(
                $limit: Int!
                $offset: Int!
                $order_by: [user_order_by!]
                $filter_by: [user_bool_exp!]
            ) {
                user(
                    limit: $limit
                    offset: $offset
                    where: { _and: $filter_by }
                    order_by: $order_by
                ) {
                    id
                    name
                    phone
                    role
                }
                user_aggregate(where: { _and: $filter_by }, order_by: $order_by) {
                    aggregate {
                        count
                    }
                }
            }
        `,
        props
    )

export const loadUsers = thunk(
    async (
        actions,
        { tableState, setTotalCount },
        { getState, getStoreState, getStoreActions }
    ) => {
        if (getState().loading) {
            return
        }
        actions.setLoading(true)

        let data, err, timeOut, queryError
        const { columns } = getState()

        const { sortBy, filters, pageIndex, pageSize } = tableState
        ;({ data, err, timeOut, queryError } = await getUsers(
            rTableToHasura({ columns, sortBy, filters, pageIndex, pageSize })
        ))

        if (data) {
            setTotalCount(data.userAggregate.aggregate.count)
            actions.setUsers(data.user)
        } else if (queryError) {
            err = { message: translate('Query Error') }
        } else if (timeOut) {
            err = { message: translate('Timeout') }
        } else {
            err = { message: translate('Unknown error') }
        }

        actions.setData(data)
        actions.setErr(err)
        actions.setTimeOut(timeOut)

        actions.setLoading(false)
        return { data, err, timeOut, queryError }
    }
)
