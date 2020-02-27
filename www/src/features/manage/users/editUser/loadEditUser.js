import { queryDb } from 'utils/fetch'
import { thunk } from 'easy-peasy'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/fp/get'

// Common
import { path as pathUsers } from '../_users'
import { translate } from 'utils/langugae'

const getUser = props =>
    queryDb(
        /* GraphQL */ `
            query($user_id: Int!) {
                user(where: { id: { _eq: $user_id } }) {
                    id
                    name
                    phone
                    role
                }
            }
        `,
        props
    )

export const loadEditUser = thunk(
    async (actions, ___, { getState, getStoreState, getStoreActions }) => {
        if (getState().loading) {
            return
        }
        actions.setLoading(true)
        console.log('LOADING EDIT USER')

        let data, err, timeOut, queryError
        ;({ data, err } = await get(pathUsers)(getStoreActions()).loadRoles())

        if (data && getState().isEdit) {
            const { userId } = getState()
            ;({ data, err, timeOut, queryError } = await getUser({ userId }))
            if (data) {
                const { user } = data
                if (user.length !== 1) {
                    data = undefined
                    err = { message: translate('No User with such id') }
                }
                actions.setValues({ values: data.user[0] })
            } else if (queryError) {
                err = { message: translate('Query Error') }
            } else if (timeOut) {
                err = { message: translate('Timeout') }
            } else {
                err = { message: translate('Unknown error') }
            }
        }

        actions.setData(data)
        actions.setErr(err)
        actions.setTimeOut(timeOut)
        actions.setLoading(false)
        return { data, err, timeOut, queryError }
    }
)
