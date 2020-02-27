// node_modules
import { when, sleep } from 'utils/utils'
import { postApi, queryDb } from 'utils/fetch'
import { thunk } from 'easy-peasy'
import get from 'lodash/fp/get'

import { translate } from 'utils/langugae'

// Local
import { path as pathEditDevice } from '../_editDevice'

export const submitWifi = thunk(
    async (actions, { index }, { getState, getStoreState }) => {
        console.log('index', index)
        if (getState().forms[index].submitting) {
            return
        }

        actions.setSubmitting({ submitting: true, index })
        actions.setError({ error: translate('Sending command'), index })

        const { wifis } = getState()
        const { name } = wifis[index]
        const { deviceName } = get(pathEditDevice)(getStoreState())
        const json = {
            waitForResult: true,
            deviceNames: [deviceName],
            code: 'CONNECT_WIFI',
            params: {
                name,
                password: getState().forms[index].values.password,
            },
        }

        const { data, err, timeOut } = await postApi({
            url: '/device/send-command',
            json,
        })

        if (data) {
            const result = data[deviceName]
            if (typeof result === 'string') {
                actions.setError({ error: translate(result), index })
            } else {
                const { err, timeOut, data: _data } = result
                if (timeOut) {
                    actions.setError({ error: translate('Timeout'), index })
                } else if (err) {
                    actions.setError({ error: translate('Something went wrong'), index })
                } else if (_data) {
                    const { name: _name, connected } = _data.data.wifi || {}
                    if (_name === name && connected) {
                        actions.setError({ error: translate('CONNECTED'), index })
                    } else {
                        actions.setError({ error: translate('NOT CONNECTED'), index })
                    }
                }
            }
        } else if (timeOut) {
            actions.setError({ error: translate('Timeout'), index })
            actions.setSubmitting({ submitting: false, index })
        } else {
            const { response } = err || {}
            const { data, status } = response || {}

            if (!data) {
                actions.setError({ error: translate('Something went wrong'), index })
            } else {
                const { mes = '' } = data

                const setError = () =>
                    actions.setError({
                        error: when(status)
                            .is(504, translate('Network timeout'))
                            .is(400, mes)
                            .else(translate('Something went wrong')),
                        index,
                    })

                setError()
            }
        }
        actions.setSubmitting({ submitting: false, index })
    }
)
