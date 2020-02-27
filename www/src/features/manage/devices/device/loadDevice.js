import { queryDb } from 'utils/fetch'
import { thunk } from 'easy-peasy'
import isEmpty from 'lodash/isEmpty'

// Common
import { titleCase, mapKeysToObject } from 'utils/utils'
import { translate } from 'utils/langugae'

const getDevice = props =>
    queryDb(
        /* GraphQL */ `
            query($device_name: String!) {
                device(where: { device_name: { _eq: $device_name } }) {
                    id
                    registered
                    city
                    street
                    house
                    gate_phone
                    door_code
                    wifis {
                        id
                        name
                    }
                    device_residents {
                        id
                        name
                        phone
                        apartment
                    }
                    device_owners {
                        id
                        user {
                            name
                            phone
                        }
                    }
                }
            }
        `,
        props
    )

export const loadDevice = thunk(
    async (actions, ___, { getState, getStoreState, getStoreActions }) => {
        if (getState().loading) {
            return
        }
        actions.setLoading(true)

        const { deviceName } = getState()
        let { data, err, timeOut, queryError } = await getDevice({ deviceName })

        if (data) {
            const { device } = data
            if (device.length !== 1) {
                data = undefined
                err = { message: translate('No Device') }
            }
            data = data.device[0]

            let {
                id,
                registered,
                wifis,
                deviceResidents,
                deviceOwners,
                ...details
            } = data

            const { user } = getStoreState().auth.profile
            let owners = deviceOwners
                .filter(owner => owner.user.phone !== user.phone)
                .map(({ id, user, ...owner }) => ({
                    ...owner,
                    ...user,
                }))
            let residents = deviceResidents.map(({ id, ...resident }) => resident)
            owners = owners.map(owner => mapKeysToObject(titleCase)(owner))
            residents = residents.map(resident => mapKeysToObject(titleCase)(resident))
            details = mapKeysToObject(titleCase)(details)

            details = data = { details, owners, residents }
        } else if (queryError) {
            err = { message: translate('Query Error') }
        } else if (timeOut) {
            err = { message: translate('Timeout') }
        } else {
            err = { message: translate('Unknown error') }
        }

        actions.setData(data)
        actions.setErr(err)
        actions.setTimeOut(timeOut)

        actions.setLoading(false)
        return { data, err, timeOut, queryError }
    }
)
