import _sodium from 'libsodium-wrappers'

import { queryDb as _queryDb } from 'utils/utils'
const queryDb = _queryDb({ role: 'device' })

export const getDevice = props =>
    queryDb(
        /* GraphQL */ `
            query getDevice($device_name: String!) {
                device(where: { device_name: { _eq: $device_name } }) {
                    public_key
                }
            }
        `,
        props
    ).then(d => d.device[0])

export const getDevicePre = props =>
    queryDb(
        /* GraphQL */ `
            query getDevicePre($device_name: String!) {
                device_pre(where: { device_name: { _eq: $device_name } }) {
                    public_key
                }
            }
        `,
        props
    ).then(d => d.devicePre[0])

let sodium
;(async () => {
    await _sodium.ready
    console.log('ssodium ready')
    sodium = _sodium
})()

export const unsign = ({ publicKey, signedMessage }) =>
    sodium.to_string(
        sodium.crypto_sign_open(
            sodium.from_base64(signedMessage),
            sodium.from_base64(publicKey)
        )
    )
