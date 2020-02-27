import _sodium from 'libsodium-wrappers'

import { queryDb as _queryDb } from 'utils/utils'
import { getDevicePre } from './auth'
const queryDb = _queryDb({ role: 'device' })

const insertDevice = props =>
    queryDb(
        /* GraphQL */ `
            mutation($devices: [device_insert_input!]!) {
                insert_device(objects: $devices) {
                    returning {
                        id
                    }
                }
            }
        `,
        props
    )

export const initDevice = async ({ deviceName, wifi }) => {
    console.log('initDevice')
    console.log('deviceName', deviceName)
    console.log('wifi', wifi)
    const distinctWifis = Array.from(new Set(wifi.list.map(o => o.name))).map(name => ({ name }))
    console.log('distinctWifis', distinctWifis)
    const { publicKey } = await getDevicePre({ deviceName })
    const devices = [
        {
            deviceName,
            publicKey,
            wifis: { data: distinctWifis },
        },
    ]
    return insertDevice({ devices })
}
