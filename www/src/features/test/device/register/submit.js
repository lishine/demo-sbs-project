import { when, sleep } from 'utils/utils'
import { postApi } from 'utils/fetch'
import { thunk } from 'easy-peasy'

import { translate } from 'utils/langugae'

export const submit = thunk(async (actions, __, helpers) => {
    const { getState } = helpers

    if (getState().submitting) {
        return
    }
    actions.setSubmitting({ submitting: true })

    const { values } = getState()
    const json = { values }

    const { data, err, timeOut } = await postApi({
        url: '/device/register',
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
