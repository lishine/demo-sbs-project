import { queryDb } from 'utils/fetch'
import { thunk } from 'easy-peasy'
import isEmpty from 'lodash/isEmpty'

// Common
import { rTableToHasura } from 'common/rtable/utils'
import { translate } from 'utils/langugae'

const getDevices = props =>
    queryDb(
        /* GraphQL */ `
            query(
                $limit: Int!
                $offset: Int!
                $order_by: [device_order_by!]
                $filter_by: [device_bool_exp!]
            ) {
                device(
                    limit: $limit
                    offset: $offset
                    where: { _and: $filter_by }
                    order_by: $order_by
                ) {
                    id
                    device_name
                    registered
                    city
                    street
                    house
                    gate_phone
                    door_code
                }
                device_aggregate(where: { _and: $filter_by }, order_by: $order_by) {
                    aggregate {
                        count
                    }
                }
            }
        `,
        props
    )

export const loadDevices = thunk(
    async (
        actions,
        { tableState, setTotalCount, columns },
        { getState, getStoreState, getStoreActions }
    ) => {
        if (getState().loading) {
            return
        }
        actions.setLoading(true)
        const { sortBy, filters, pageIndex, pageSize } = tableState

        let { data, err, timeOut, queryError } = await getDevices(
            rTableToHasura({ columns, sortBy, filters, pageIndex, pageSize })
        )

        if (data) {
            setTotalCount(data.deviceAggregate.aggregate.count)
            data = data.device
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
