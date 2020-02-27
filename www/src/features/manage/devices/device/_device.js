import { action, thunk, listen } from 'easy-peasy'

// // Common
import { usePathStore, usePathActions } from 'common/hooks/hooks'
import { loadModel } from 'common/models/loadModel'

// Local
import { loadDevice } from './loadDevice'
import { deleteDevice } from './deleteDevice'

export let path
export const device = ({ parentPath = '' }) => {
    path = `${parentPath}${parentPath && '.'}device`
    return {
        deviceName: undefined,
        setDeviceName: action((state, deviceName) => {
            state.deviceName = deviceName
        }),

        deleteDevice,
        onDeleteModalClosing: thunk(async (actions, ___, { getState }) => {
            if (getState().result.success) {
                window.history.back()
            }
        }),
        deleting: undefined,
        setDeleting: action((state, deleting) => {
            state.deleting = deleting
        }),
        result: {},
        setResult: action((state, result) => {
            state.result = result
        }),

        data: [],
        ...loadModel(),
        loadDevice,
    }
}
