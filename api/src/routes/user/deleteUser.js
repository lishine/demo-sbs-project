import isEmpty from 'lodash/isEmpty'

import { throwError, throwIf } from 'utils/error'
import { find, queryDb } from 'utils/utils'

const mutationDeleteUser = props =>
    queryDb(
        /* GraphQL */ `
            mutation($id: Int!) {
                delete_device_owner(where: { id: { _eq: $id } }) {
                    returning {
                        user_id
                        device_id
                    }
                }
                delete_user(where: { id: { _eq: $userId } }) {
                    returning {
                        id
                    }
                }
            }
        `,
        props
    )

export const deleteUser = async ({ body }) => {
    console.log('delete user body', body)

    let { userId } = body
    throwIf(!userId, 400, '* MISSING INPUTS')()

    const result = await mutationDeleteUser({ id: userId })
    console.log('result deleting user', JSON.stringify(result, 0, 2))
    return {}
}
