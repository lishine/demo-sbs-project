// node_modules
import { when, sleep } from 'utils/utils'
import { postApi, queryDb } from 'utils/fetch'
import { thunk } from 'easy-peasy'
import get from 'lodash/fp/get'

import { translate } from 'utils/langugae'

export const deleteUser = thunk(async (actions, ___, { getState, getStoreState }) => {
    if (getState().deleting) {
        return
    }
    actions.setDeleting(true)

    const { userId } = getState()
    const json = { userId }

    const { data, err, timeOut } = await postApi({
        url: '/user/delete-user',
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
