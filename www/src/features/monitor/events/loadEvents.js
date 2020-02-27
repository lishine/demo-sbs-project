import { queryDb } from 'utils/fetch'
import { thunk } from 'easy-peasy'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/fp/get'

import { translate } from 'utils/langugae'

const getEvents = props =>
    queryDb(
        /* GraphQL */ `
            query($limit: Int!) {
                device_event(limit: $limit, order_by: { created_at: desc }) {
                    id
                    created_at
                    device_name
                    code
                }
            }
        `,
        props
    )

export const loadEvents = thunk(
    async (actions, ___, { getState, getStoreState, getStoreActions }) => {
        if (getState().loading) {
            return
        }
        actions.setLoading(true)
        let { data, err, timeOut, queryError } = await getEvents({ limit: 10 })

        if (data) {
            actions.setEvents(data.deviceEvent)
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
