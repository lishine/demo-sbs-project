import { queryDb } from 'utils/fetch'
import { thunk } from 'easy-peasy'
import get from 'lodash/fp/get'

// Common
import { translate } from 'utils/langugae'

const getDevice = props =>
    queryDb(
        /* GraphQL */ `
            query($device_name: String!) {
                device(where: { device_name: { _eq: $device_name } }) {
                    id
                    city
                    street
                    house
                    gate_phone
                    door_code
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

const getDevicePublicView = props =>
    queryDb(
        /* GraphQL */ `
            query getDevicePublicView($device_name: String!) {
                device_public_view(where: { device_name: { _eq: $device_name } }) {
                    id
                    registered
                    wifis {
                        id
                        name
                    }
                }
            }
        `,
        props
    )

export const loadEditDevice = thunk(async (actions, ___, { getState, getStoreState }) => {
    actions.setLoading(true)
    const { isNew, deviceName } = getState()

    let { data, err, timeOut, queryError } = await getDevicePublicView({
        deviceName,
    })

    if (data) {
        data = data.devicePublicView[0]

        if (!data) {
            err = { message: translate('No Device') }
        } else {
            const { registered } = data
            if (isNew && registered) {
                err = { message: translate('Already registered') }
                data = undefined
            }
            if (!isNew && !registered) {
                err = { message: translate('Not registered yet') }
                data = undefined
            }

            if (!err) {
                const { id, wifis } = data
                actions.setDeviceId(id)
                actions.stages.wifi.setWifis(wifis)
                wifis.forEach(() => actions.stages.wifi.addForm())

                if (!isNew) {
                    ;({ data, err, timeOut, queryError } = await getDevice({
                        deviceName,
                    }))

                    let _details = {}
                    let _residents = []
                    let _owners = []
                    if (data) {
                        data = data.device[0]

                        const { deviceResidents, deviceOwners, ...details } = data

                        const { user } = getStoreState().auth.profile
                        let owners = []
                        deviceOwners
                            .filter(owner => owner.user.phone !== user.phone)
                            .forEach(({ id, user: { name, phone } }) => {
                                owners.push({ readOnly: true, id, name, phone })
                            })
                        _details = details
                        _owners = owners
                        _residents = deviceResidents
                    }
                    actions.stages.details.setValues({ values: _details })
                    actions.stages.owners.setValues({ values: { owners: _owners } })
                    actions.stages.residents.setValues({
                        values: { residents: _residents },
                    })
                    data = { details: _details, owners: _owners, residents: _residents }
                }
            }
        }
    }

    if (!data) {
        if (queryError) {
            err = { message: translate('Query Error') }
        } else if (timeOut) {
            err = { message: translate('Timeout') }
        } else {
            console.log('err', err)
            err = { message: err.message || translate('Unknown error') }
        }
    }

    actions.setData(data)
    actions.setErr(err)
    actions.setTimeOut(timeOut)

    actions.setLoading(false)
    return { data, err, timeOut, queryError }
})
