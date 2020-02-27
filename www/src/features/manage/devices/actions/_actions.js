import { computed, action, thunk } from 'easy-peasy'
import get from 'lodash/fp/get'
import isEmpty from 'lodash/isEmpty'

// Common
import { usePathStore, usePathActions } from 'common/hooks/hooks'
import { loadModel } from 'common/models/loadModel'
import { formModel } from 'common/models/formModel'
import { loadActions } from './loadActions'

// Local
import { startSubmitting, submitSuccess } from './submitActions'

export let path
export const actions = ({ parentPath = '' }) => {
    path = `${parentPath}${parentPath && '.'}actions`
    return {
        actions: [],
        setActions: action((state, actions) => {
            state.actions = actions
        }),
        selectedCode: undefined,
        setSelectedCode: action((state, selectedCode) => {
            state.selectedCode = selectedCode
        }),
        selectedAction: computed(state => {
            return state.actions.find(action => action.code === state.selectedCode)
        }),
        ...loadModel(),
        loadActions,

        ...formModel(),

        startSubmitting,
        submitSuccess,
    }
}
