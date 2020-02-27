import { thunk } from 'easy-peasy'
import get from 'lodash/fp/get'

import { translate } from 'utils/langugae'

// Local
import { path as pathEditDevice } from '../_editDevice'

export const submitDeviceName = thunk(
    async (actions, __payload, { getState, getStoreState, getStoreActions }) => {
        if (getState().submitting) {
            return
        }

        if (!getStoreState().auth.isAuth) {
            getStoreActions().auth.showLogin()
            return
        }

        actions.setSubmitting({ submitting: true })

        const { deviceName } = getState().values
        if (deviceName) {
            get(pathEditDevice)(getStoreActions()).setDeviceName(deviceName)
        }

        const { data, err } = await get(pathEditDevice)(getStoreActions()).load()
        console.log('in deviceName { data, err }', { data, err })
        if (data) {
            console.log('in deviceName success')
            get(pathEditDevice)(getStoreActions()).navigate(+1)
        } else {
            actions.setError({ error: translate(err.message) })
        }
        actions.setSubmitting({ submitting: false })
    }
)
