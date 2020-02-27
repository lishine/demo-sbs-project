import { action, thunk, listen } from 'easy-peasy'
import get from 'lodash/fp/get'
import isEqual from 'lodash/fp/isEqual'

// Common
import { router } from 'routes'
import { postApi } from 'utils/fetch'

export const submitFinish = async (actions, ___, { getState, getStoreState }) => {
    const { data: dataLoaded, stages, deviceId, isNew } = getState()
    const { id: userId, name } = getStoreState().auth.profile.user
    let details = stages.details.values
    let residents = stages.residents.values.residents
    let owners = stages.owners.values.owners

    if (isNew) {
        owners = [{ userId, name }, ...owners]
    } else {
        dataLoaded.residents.forEach(prevResident => {
            const resident = residents.find(resident => resident.id === prevResident.id)
            if (resident) {
                if (isEqual(resident, prevResident)) {
                    resident.unchanged = true
                } else {
                    resident.updated = true
                }
            } else {
                residents = [{ id: prevResident.id, deleted: true }, ...residents]
            }
        })
        dataLoaded.owners.forEach(prevOwner => {
            const owner = owners.find(owner => owner.id === prevOwner.id)
            if (owner) {
                if (isEqual(owner, prevOwner)) {
                    owner.unchanged = true
                } else {
                    owner.updated = true
                }
            } else {
                owners = [{ id: prevOwner.id, deleted: true }, ...owners]
            }
        })

        if (!isEqual(details, dataLoaded.details)) {
            details.updated = true
        }
    }

    const json = {
        isNew,
        userId,
        deviceId,
        details,
        residents,
        owners,
    }

    console.log('SENDING SAVE')
    const { data, err, timeOut } = await postApi({
        url: '/register/save',
        json,
    })
    actions.stages.owners.stopSubmitting({ data, err, timeOut })
}

export const submitSuccess = async (
    __,
    ___,
    { getStoreActions, getState, getStoreState }
) => {
    const { role } = getStoreState().auth.profile.user
    if (role === 'OWNER') {
        await getStoreActions().auth.profile.loadProfile()
    }
    const { deviceName } = getState()
    if (getState().isRegister) {
        router.replaceRoute('manageDevice', { deviceName })
    } else {
        window.history.back()
    }
}
