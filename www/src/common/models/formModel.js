// node_modules
import { action, thunk, computed } from 'easy-peasy'
import isEmpty from 'lodash/isEmpty'
import { when, sleep } from 'utils/utils'

import { translate } from 'utils/langugae'

const form = () => ({
    error: undefined,
    valid: false,
    form: undefined,
    validated: { notValidatedAtStart: true },
    submitting: false,
    values: {},
    returnData: undefined,
    fromForm: undefined,
})

const getDynamicState = ({ state, dynamic, index }) => {
    if (dynamic) {
        return state.forms[index]
    } else {
        return state
    }
}

export const formModel = (params = {}) => {
    let obj = {}
    const { dynamic } = params
    if (dynamic) {
        obj.forms = []
    } else {
        Object.assign(obj, form())
    }

    Object.assign(obj, {
        submittedIndex: 0,
        addForm: action(state => {
            state.forms.push(form())
        }),
        isValidated: computed(state => payload => {
            const { index = 0 } = payload
            return isEmpty(getDynamicState({ state, dynamic, index }).validated)
        }),
        setValidated: action((state, payload) => {
            const { validated, index = 0 } = payload
            getDynamicState({ state, dynamic, index }).validated = validated
        }),
        setValues: action((state, payload) => {
            const { values, index = 0 } = payload
            getDynamicState({ state, dynamic, index }).values = values
        }),
        onNewValues: thunk((actions, payload, { getState }) => {
            const { values, validated, index = 0 } = payload
            actions.setValidated({ validated, index })
            actions.setValues({
                values: Object.assign({}, getState().values, values),
                index,
            })
            if (getDynamicState({ state: getState(), dynamic, index }).error) {
                actions.clearError({ index })
            }
        }),
        setSubmitting: action((state, payload) => {
            const { submitting, index = 0 } = payload
            getDynamicState({ state, dynamic, index }).submitting = submitting
        }),
        setError: action((state, payload) => {
            const { error, index = 0 } = payload
            getDynamicState({ state, dynamic, index }).error = error
        }),
        setFromForm: action((state, payload) => {
            const { fromForm, index = 0 } = payload
            getDynamicState({ state, dynamic, index }).fromForm = fromForm
        }),
        clearError: action((state, payload) => {
            const { index = 0 } = payload
            getDynamicState({ state, dynamic, index }).error = undefined
        }),
        setReturnData: action((state, payload) => {
            const { returnData, index = 0 } = payload
            getDynamicState({ state, dynamic, index }).returnData = returnData
        }),
        submitSuccess: action((state, payload) => {
            const { returnData, index = 0 } = payload
            getDynamicState({ state, dynamic, index }).returnData = returnData
        }),
        submitFailure: action((state, payload = {}) => {
            const { index = 0 } = payload
            getDynamicState({ state, dynamic, index }).returnData = null
        }),
        submit: submit(),
        startSubmitting: action(() => {}),
        stopSubmitting: stopSubmitting(),
        setSubmittedIndex: action((state, { index }) => {
            state.submittedIndex = index
        }),
    })

    return obj
}

const submit = () =>
    thunk(async (actions, payload = {}, { getState }) => {
        const { index = 0, fromForm } = payload
        console.log('formModel submit')
        if (getState().submitting) {
            return
        }
        actions.setSubmittedIndex({ index })
        actions.setFromForm({ index, fromForm })
        actions.setSubmitting({ index, submitting: true })
        actions.startSubmitting({ index, fromForm, values: getState().values })
    })

const stopSubmitting = () =>
    thunk(
        async (
            actions,
            { data, err, timeOut, queryError, customError },
            { getState }
        ) => {
            if (customError) {
                actions.setError({ error: customError.message })
                actions.submitFailure()
            } else if (timeOut) {
                actions.setError({ error: translate('Timeout') })
                actions.submitFailure()
            } else if (queryError) {
                if (
                    queryError &&
                    queryError.message &&
                    queryError.message.includes('duplicate') &&
                    queryError.message.includes('phone')
                ) {
                    actions.setError({
                        error: translate('There is another user with this phone'),
                    })
                } else {
                    actions.setError({ error: translate('Query Error') })
                }
                actions.submitFailure()
            } else if (data) {
                console.log('success')
                actions.submitSuccess({ returnData: data })
            } else {
                console.error(err)
                console.error(JSON.stringify(err, 0, 2))

                const { response } = err || {}
                const { data, status } = response || {}

                if (!data) {
                    actions.setError({ error: translate('Something went wrong') })
                } else {
                    const { mes = '' } = data

                    const setError = () =>
                        actions.setError({
                            error: when(status)
                                .is(504, translate('Network timeout'))
                                .is(400, mes)
                                .else(translate('Something went wrong')),
                        })

                    setError()
                }

                actions.submitFailure()
            }

            actions.setSubmitting({ submitting: false })
        }
    )
