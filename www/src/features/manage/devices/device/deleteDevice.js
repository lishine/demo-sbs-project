import { when, sleep } from 'utils/utils'
import { postApi, queryDb } from 'utils/fetch'
import { thunk } from 'easy-peasy'
import get from 'lodash/fp/get'

// Common
import { translate } from 'utils/langugae'

export const deleteDevice = thunk(async (actions, ___, { getState, getStoreState }) => {
    if (getState().deleting) {
        return
    }
    actions.setDeleting(true)

    const { deviceName } = getState()
    const json = { deviceName }

    const { data, err, timeOut } = await postApi({
        url: '/manage-device/delete-device',
        json,
    })

    if (data) {
        console.log('success')
        actions.setResult({ success: true, message: translate('SUCCESS') })
    } else if (timeOut) {
        actions.setResult({ message: translate('Timeout') })
    } else {
        const { response } = err || {}
        const { data, status } = response || {}

        if (!data) {
            actions.setResult({ message: translate('Something went wrong') })
        } else {
            const { mes = '' } = data
            actions.setResult({
                message: when(status)
                    .is(504, translate('Network timeout'))
                    .is(400, mes)
                    .else(translate('Something went wrong')),
            })
        }
    }

    actions.setDeleting(false)
})
