import { action, thunk, listen } from 'easy-peasy'
import indexOf from 'lodash/fp/indexOf'
import get from 'lodash/fp/get'
import isEqual from 'lodash/fp/isEqual'

// Common
import { initialState } from 'features/model'
import { formModel } from 'common/models/formModel'
import { loadModel } from 'common/models/loadModel'
import { usePathStore, usePathActions } from 'common/hooks/hooks'

// Local
import { loadEditUser } from './loadEditUser'
import { startSubmitting, submitSuccess } from './submitEditUser'

export let path
export const editUser = ({ parentPath = '' }) => {
    path = `${parentPath}${parentPath && '.'}editUser`
    return {
        reset: action(state => {
            console.log('EDIT USER RESET')
            Object.assign(state, get(path)(initialState))
        }),

        isInitialized: undefined,
        setInitialized: action((state, isInitialized) => {
            state.isInitialized = isInitialized
        }),

        ...loadModel(),
        ...formModel(),
        data: {},
        loadEditUser,

        startSubmitting,
        submitSuccess,

        userId: undefined,
        setUserId: action((state, userId) => {
            state.userId = userId
        }),

        isNew: undefined,
        setIsNew: action((state, isNew) => {
            state.isNew = isNew
        }),

        isEdit: undefined,
        setIsEdit: action((state, isEdit) => {
            state.isEdit = isEdit
        }),
        isCreate: undefined,
        setIsCreate: action((state, isCreate) => {
            state.isCreate = isCreate
        }),
    }
}
