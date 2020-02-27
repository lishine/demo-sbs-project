import isEmpty from 'lodash/isEmpty'

import { throwError, throwIf } from 'utils/error'
import { isAuth } from '../auth/isAuth'

const queryUser = /* GraphQL */ `
    query($id: Int!) {
        user(where: { id: { _eq: $id } }) {
            id
            name
            phone
            role
        }
    }
`

const queryDevice = /* GraphQL */ `
    query($user_id: Int!) {
        device(where: { device_owners: { user_id: { _eq: $user_id } } }, limit: 1) {
            device_name
        }
        device_owner_aggregate(where: { user_id: { _eq: $user_id } }) {
            aggregate {
                count
            }
        }
    }
`

export const profile = async ({ queryDb, user, body }) => {
    console.log('profile body', body)

    return {
        user: {
            ...(await queryDb(queryUser, { id: user.id }).then(d => d.user[0] || {})),
            ...(user.role === 'OWNER'
                ? await queryDb(queryDevice, { userId: user.id }).then(d => ({
                      device: d.device[0],
                      deviceCount: d.deviceOwnerAggregate.aggregate.count,
                  }))
                : {}),
        },
    }
}
