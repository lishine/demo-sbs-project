import { action, thunk, listen } from 'easy-peasy'
import get from 'lodash/fp/get'

// Common
import { initialState } from 'features/model'
import { usePathStore, usePathActions } from 'common/hooks/hooks'
import { loadModel } from 'common/models/loadModel'

// Local
import { loadUser } from './loadUser'
import { deleteUser } from './deleteUser'

export let path
export const user = ({ parentPath = '' }) => {
    path = `${parentPath}${parentPath && '.'}user`
    return {
        reset: action(state => {
            Object.assign(state, get(path)(initialState))
        }),
        isInitialized: false,
        setInitialized: action((state, isInitialized) => {
            state.isInitialized = isInitialized
        }),
        ...loadModel(),
        loadUser,
        deleteUser,
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

        userId: undefined,
        setUserId: action((state, userId) => {
            state.userId = userId
        }),
        user: {},
        setUser: action((state, user) => {
            state.user = user
        }),
    }
}
