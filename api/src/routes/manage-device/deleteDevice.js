import { throwIf, throwError } from 'utils/error'
import { queryDb, pick, trimObjectProperties } from 'utils/utils'
import isEmpty from 'lodash/isEmpty'

const deleteDeviceQuery = /* GraphQL */ `
    mutation($device_name: String!) {
        delete_device_owner(where: { device: { device_name: { _eq: $device_name } } }) {
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
`

export const deleteDevice = async ({ queryDb, body }) => {
    console.log('deleteDevice body', JSON.stringify(body, 0, 2))

    const { deviceName } = body
    throwIf(!deviceName, 400, '* MISSING INPUTS')()

    await queryDb(deleteDeviceQuery, { deviceName })

    return {}
}
