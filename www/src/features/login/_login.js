import { action, thunk } from 'easy-peasy'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/fp/get'

// Common
import { formModel } from 'common/models/formModel'
import { postApi } from 'utils/fetch'
import { initialState } from 'features/model'

export let path
export const login = ({ parentPath = '' }) => {
    path = `${parentPath}${parentPath && '.'}login`
    return {
        reset: action(state => {
            Object.assign(state, get(path)(initialState))
        }),

        ...formModel(),
        stage: 'Details',
        setStage: action((state, { stage }) => {
            state.stage = stage
        }),

        mode: 'SignIn',
        setMode: action((state, payload = {}) => {
            const { mode } = payload
            state.mode = mode || 'SignIn'
        }),
        navigate: thunk(async (actions, { mode }) => {
            if (mode) {
                actions.setStage({ stage: 'Details' })
                actions.setMode({ mode })
            }
        }),

        post: thunk(async (___, json) =>
            postApi({
                url: '/auth/login',
                json,
            })
        ),

        startSubmitting: thunk(async (actions, ___, { getState, getStoreState }) => {
            const { mode, stage, values, fromForm = {} } = getState()
            const { id: userId } = getStoreState().auth.profile.user
            const { resendCode } = fromForm
            const json = { values, mode, stage, resendCode, userId }

            const { data, err, timeOut } = await actions.post(json)
            actions.stopSubmitting({ data, err, timeOut })
        }),

        submitSuccess: thunk(
            async (actions, { returnData: { code } }, { getStoreActions, getState }) => {
                console.log('*** submitSuccess')

                const { fromForm, stage } = getState()

                actions.setCode({ code }) // //// FOR TESTING - REMOVE

                if (stage === 'Details') {
                    console.log('TESTING - REMOVE code', code)
                    actions.setStage({ stage: 'Code' })
                } else if (stage === 'Code') {
                    if (!(fromForm && fromForm.resendCode)) {
                        await getStoreActions().auth.enter()
                        getStoreActions().closeModal()
                    }
                }
            }
        ),

        /// //// FOR TESTING - REMOVE
        code: undefined,
        setCode: action((state, { code }) => {
            state.code = code
        }),
    }
}
