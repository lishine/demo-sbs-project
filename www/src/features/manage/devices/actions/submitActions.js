import { action, thunk } from 'easy-peasy'
import get from 'lodash/fp/get'
import isEmpty from 'lodash/isEmpty'

// Common
import { postApi } from 'utils/fetch'
import { when, sleep } from 'utils/utils'
import { translate } from 'utils/langugae'

// Local
import { path as pathDevices } from '../_devices'

// const getDevice = props =>
//     queryDb(
//         /* GraphQL */ `
//             query($name: String!) {
//                 device(where: { name: { _eq: $name } }) {
//                     command
//                 }
//             }
//         `,
//         props
//     )

// const updateDevice = props =>
//     queryDb(
//         /* GraphQL */ `
//             mutation($name: String!, $command: json!) {
//                 update_device(
//                     where: { name: { _eq: $name } }
//                     _set: { command: $command }
//                 ) {
//                     affected_rows
//                 }
//             }
//         `,
//         props
//     )

export const startSubmitting = thunk(
    async (actions, ___, { getState, getStoreState }) => {
        const { route } = getStoreState().router
        const devices = get(pathDevices)(getStoreState())

        let deviceNames
        console.log('route', route)
        if (route === 'manageDevices') {
            ;({ deviceNames } = devices)
        } else {
            const { deviceName } = devices.device
            deviceNames = deviceName && [deviceName]
        }
        console.log('deviceNames', deviceNames)

        let data, err, timeOut, queryError, customError
        if (isEmpty(deviceNames)) {
            customError = { message: translate('Please select device') }
        } else {
            const {
                selectedAction: { code },
                values: params,
            } = getState()
            ;({ data, err, timeOut } = await postApi({
                url: '/device/send-command',
                json: { deviceNames, code, params },
            }))

            if (data) {
                customError = { message: data }
            }
        }

        actions.stopSubmitting({ data, err, timeOut, queryError, customError })
    }
)

export const submitSuccess = thunk(
    async (actions, { returnData: { code } }, { getStoreActions, getState }) => {
        console.log('*** actions submitSuccess')
        actions.setError({ error: translate('SUCCESS') })
    }
)
