import { queryDb } from 'utils/fetch'
import { thunk } from 'easy-peasy'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/fp/get'

// Common
import { translate } from 'utils/langugae'

import { path as pathProfile } from 'features/auth/profile/_profile'
const getActions = props =>
    queryDb(
        /* GraphQL */ `
            query {
                action {
                    show
                    code
                    params
                    roles
                }
            }
        `,
        props
    )

export const loadActions = thunk(
    async (actions, ___, { getState, getStoreState, getStoreActions }) => {
        if (getState().loading) {
            return
        }
        if (!isEmpty(getState().actions)) {
            return
        }
        actions.setLoading(true)

        let { data, err, timeOut, queryError } = await getActions()

        if (data) {
            const { role } = get(pathProfile)(getStoreState()).user
            console.log('data.action', data.action)
            actions.setActions(
                data.action.filter(
                    action => action.roles && action.roles.includes(role) && action.show
                )
            )
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
