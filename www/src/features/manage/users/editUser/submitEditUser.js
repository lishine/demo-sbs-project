import { action, thunk } from 'easy-peasy'
import get from 'lodash/fp/get'
import isEmpty from 'lodash/isEmpty'

// Common
import { queryDb, postApi } from 'utils/fetch'

// Local

export const startSubmitting = thunk(async (actions, ___, { getState }) => {
    const { values, isNew, isEdit } = getState()
    const json = { ...values, isNew, isEdit }
    const { data, err, timeOut } = await postApi({
        url: '/user/edit-user',
        json,
    })
    actions.stopSubmitting({ data, err, timeOut })
})

export const submitSuccess = thunk(async () => window.history.back())
