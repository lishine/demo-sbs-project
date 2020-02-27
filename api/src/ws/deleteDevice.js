import _sodium from 'libsodium-wrappers'

import { queryDb as _queryDb } from 'utils/utils'
const queryDb = _queryDb({ role: 'device' })

export const deleteDevice = props =>
    queryDb(
        /* GraphQL */ `
            mutation($device_name: String!) {
                delete_device_owner(
                    where: { device: { device_name: { _eq: $device_name } } }
                ) {
                    returning {
                        id
                    }
                }
                delete_device_resident(
                    where: { device: { device_name: { _eq: $device_name } } }
                ) {
                    returning {
                        id
                    }
                }
                delete_wifi(where: { device: { device_name: { _eq: $device_name } } }) {
                    returning {
                        id
                    }
                }
                delete_device(where: { device_name: { _eq: $device_name } }) {
                    returning {
                        id
                    }
                }
            }
        `,
        props
    )
