import { queryDb } from 'utils/fetch'
import { thunk } from 'easy-peasy'
import isEmpty from 'lodash/isEmpty'

import { translate } from 'utils/langugae'

const getUser = props =>
    queryDb(
        /* GraphQL */ `
            query($user_id: Int!) {
                user(where: { id: { _eq: $user_id } }) {
                    name
                    phone
                    role
                }
            }
        `,
        props
    )

export const loadUser = thunk(
    async (actions, ___, { getState, getStoreState, getStoreActions }) => {
        if (getState().loading) {
            return
        }
        if (!isEmpty(getState().actions)) {
            return
        }
        actions.setLoading(true)

        const { userId } = getState()
        let { data, err, timeOut, queryError } = await getUser({ userId })

        if (data) {
            const { user } = data
            if (user.length !== 1) {
                data = undefined
                err = { message: translate('No User with such id') }
            }
            actions.setUser(data.user[0])
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
