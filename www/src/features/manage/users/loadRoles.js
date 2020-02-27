import { queryDb } from 'utils/fetch'
import { thunk } from 'easy-peasy'
import isEmpty from 'lodash/isEmpty'

import { translate } from 'utils/langugae'

const getRoles = props =>
    queryDb(
        /* GraphQL */ `
            query {
                role {
                    code
                }
            }
        `,
        props
    )

export const loadRoles = thunk(async (actions, ___, { getState }) => {
    console.log('LOADING ROLES')

    const { loading, roles } = getState()
    if (loading || !isEmpty(roles)) {
        return { data: roles }
    }

    actions.setLoading(true)

    let { data, err, timeOut, queryError } = await getRoles()
    if (data) {
        actions.setRoles(data.role.map(role => role.code))
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

    return { data: getState().roles, err }
})
