import { throwIf, throwError } from 'utils/error'
import { queryDb } from 'utils/utils'

const updateWifi = props =>
    queryDb(
        /* GraphQL */ `
            mutation($name: String!, $name: String!, $status: String!) {
                update_wifi(
                    where: {
                        _and: [
                            { device: { name: { _eq: $name } } }
                            { name: { _eq: $name } }
                        ]
                    }
                    _set: { status: $status }
                ) {
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
        deviceName,
        wifi: { name, status },
    } = body

    await updateWifi({ deviceName, name, status })

    return {}
}
