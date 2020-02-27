import { action, thunk, listen } from 'easy-peasy'

// Common
import { loadModel } from 'common/models/loadModel'
import { usePathStore, usePathActions } from 'common/hooks/hooks'

// Local
import { device } from './device/_device'
import { actions } from './actions/_actions'
import { editDevice } from './editDevice/_editDevice'
import { loadDevices } from './loadDevices'

export let path
export const devices = ({ parentPath = '' }) => {
    path = `${parentPath}${parentPath && '.'}devices`
    return {
        data: [],
        ...loadModel(),
        device: device({ parentPath: path }),
        editDevice: editDevice({ parentPath: path }),
        load: loadDevices,
        actions: actions({ parentPath: path }),

        deviceNames: [],
        setDeviceNames: action((state, deviceNames) => {
            state.deviceNames = deviceNames
        }),
    }
}
