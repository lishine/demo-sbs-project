import { throwIf, throwError } from 'utils/error'
import { queryDb } from 'utils/utils'

const updateWifi = props =>
    queryDb(
        /* GraphQL */ `
            mutation($id: Int!, $password: String!, $status: String) {
                update_wifi(
                    where: { id: { _eq: $id } }
                    _set: { password: $password, status: $status }
                ) {
                    returning {
                        id
                    }
                }
            }
        `,
        props
    )

const updateDevice = props =>
    queryDb(
        /* GraphQL */ `
            mutation($id: Int!, $command: json!) {
                update_device(where: { id: { _eq: $id } }, _set: { command: $command }) {
                    returning {
                        id
                    }
                }
            }
        `,
        props
    )

export const wifiConnect = async ({ body }) => {
    console.log('body', body)
    const {
        deviceId,
        wifi: { id, name },
        password,
    } = body

    await updateWifi({ id, password, status: null })
    await updateDevice({
        id: deviceId,
        command: { name: 'wifiConnect', params: { wifi: { name } } },
    })
    return {}
}
