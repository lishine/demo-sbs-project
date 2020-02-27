import { throwIf, throwError } from 'utils/error'
import { queryDb as _queryDb } from 'utils/utils'

const queryDb = _queryDb({ role: 'device' })

const insertDevice = props =>
    queryDb(
        /* GraphQL */ `
            mutation($device_name: String!) {
                insert_device(objects: [{ device_name: $device_name }]) {
                    returning {
                        id
                    }
                }
            }
        `,
        props
    )
        .then(d => d.insertDevice.returning[0])
        .catch(err => {
            const { message } = err
            if (message.includes('duplicate') && message.includes('name')) {
                throwError(400, 'Device already exists')(err)
            } else {
                throw err
            }
        })

const insertWifi = props =>
    queryDb(
        /* GraphQL */ `
            mutation($objects: [wifi_insert_input!]!) {
                insert_wifi(objects: $objects) {
                    returning {
                        id
                    }
                }
            }
        `,
        props
    )

export const register = async ({ body }) => {
    console.log('body', body)
    const { deviceName, wifis } = body.values

    const device = await insertDevice({ deviceName })
    await insertWifi({
        objects: wifis.map(({ wifiName }) => ({ name: wifiName, device_id: device.id })),
    })
    return { device }
}
