import { when, sleep } from 'utils/utils'
import { postApi } from 'utils/fetch'
import { thunk } from 'easy-peasy'

import { translate } from 'utils/langugae'

export const wifiConnect = thunk(async (actions, { index, values, status }, helpers) => {
    const { getState } = helpers

    if (getState().submitting) {
        return
    }
    actions.setSubmitting({ submitting: true })

    const { deviceName, wifis } = values
    const json = { deviceName, wifi: { name: wifis[index].name, status } }

    const { data, err, timeOut } = await postApi({
        url: '/device/wifi-connect',
        json,
    })

    if (data) {
        console.log('success')
    } else if (timeOut) {
        actions.setError({ error: translate('Timeout') })
    } else {
        const { response } = err || {}
        const { data, status } = response || {}

        if (!data) {
            actions.setError({ error: translate('Something went wrong') })
            return
        } else {
            const { mes = '' } = data

            const setError = () =>
                actions.setError({
                    error: when(status)
                        .is(504, translate('Network timeout'))
                        .is(400, mes)
                        .else(translate('Something went wrong')),
                })

            setError()
        }
    }

    actions.setSubmitting({ submitting: false })
})
