import { action, thunk, actionOn, thunkOn } from 'easy-peasy'
import indexOf from 'lodash/fp/indexOf'
import get from 'lodash/fp/get'
import isEqual from 'lodash/fp/isEqual'

// Common
import { initialState } from 'features/model'
import { formModel } from 'common/models/formModel'
import { loadModel } from 'common/models/loadModel'
import { usePathStore, usePathActions } from 'common/hooks/hooks'

// Local
import { submitDeviceName } from './stages/submitDeviceName'
import { submitWifi } from './stages/submitWifi'
import { loadEditDevice } from './loadEditDevice'
import { submitFinish, submitSuccess } from './submitEditDevice'

const stages = ['DeviceName', 'Wifi', 'Details', 'Residents', 'Owners']

export let path
export const editDevice = ({ parentPath = '' }) => {
    path = `${parentPath}${parentPath && '.'}editDevice`
    return {
        reset: action(state => {
            Object.assign(state, get(path)(initialState))
        }),
        isInitialized: undefined,
        setInitialized: action((state, isInitialized) => {
            state.isInitialized = isInitialized
        }),

        ...loadModel(),
        data: {},
        load: loadEditDevice,

        stages: {
            deviceName: {
                ...formModel(),
                submit: submitDeviceName,
            },
            wifi: {
                ...formModel({ dynamic: true }),
                submit: submitWifi,
                wifis: undefined,
                setWifis: action((state, wifis) => {
                    state.wifis = wifis
                }),
            },
            details: {
                ...formModel(),
            },
            residents: {
                ...formModel(),
            },
            owners: {
                ...formModel(),
            },
        },

        stage: undefined,
        setStage: action((state, stage) => {
            state.stage = stage
        }),

        deviceId: undefined,
        setDeviceId: action((state, deviceId) => {
            state.deviceId = deviceId
        }),

        isNew: undefined,
        setIsNew: action((state, isNew) => {
            state.isNew = isNew
        }),
        isRegister: undefined,
        setIsRegister: action((state, isRegister) => {
            state.isRegister = isRegister
        }),
        isEdit: undefined,
        setIsEdit: action((state, isEdit) => {
            state.isEdit = isEdit
        }),
        isCreate: undefined,
        setIsCreate: action((state, isCreate) => {
            state.isCreate = isCreate
        }),
        deviceName: '',
        setDeviceName: action((state, deviceName) => {
            state.deviceName = deviceName
        }),

        navigate: thunk((actions, add, { getState }) => {
            let { stage } = getState()
            stage = stages[add + indexOf(stage)(stages)]
            actions.setStage(stage)
        }),

        onOwnersSubmitting: thunkOn(
            actions => actions.stages.owners.startSubmitting,
            submitFinish
        ),
        onOwnersSubmitSuccess: thunkOn(
            actions => actions.stages.owners.submitSuccess,
            submitSuccess
        ),
        onDetailsOrResidentsSubmited: thunkOn(
            actions => [actions.stages.details.submit, actions.stages.residents.submit],
            actions => actions.navigate(+1)
        ),
        // listeners: listen(on => {
        //     on(editDevice.stages.owners.startSubmitting, editDevice.submitFinish)
        //     on(editDevice.stages.owners.submitSuccess, editDevice.submitSuccess)
        //     on(editDevice.stages.details.submit, thunk(actions => actions.navigate(+1)))
        //     on(editDevice.stages.residents.submit, thunk(actions => actions.navigate(+1)))
        // }),
    }
}
