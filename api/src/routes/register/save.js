import { throwIf, throwError } from 'utils/error'
import { queryDb, pick, trimObjectProperties } from 'utils/utils'
import isEmpty from 'lodash/isEmpty'

const queryDb_role_edit_device = queryDb({ role: 'edit_device' })

const insertResident = /* GraphQL */ `
    mutation insertDeviceResident(
        $device_id: Int!
        $name: String!
        $phone: String!
        $apartment: String!
    ) {
        insert_device_resident(
            objects: [
                {
                    device_id: $device_id
                    name: $name
                    phone: $phone
                    apartment: $apartment
                }
            ]
        ) {
            affected_rows
        }
    }
`

const updateResident = /* GraphQL */ `
    mutation($id: Int!, $name: String!, $phone: String!, $apartment: String!) {
        update_device_resident(
            where: { id: { _eq: $id } }
            _set: { name: $name, phone: $phone, apartment: $apartment }
        ) {
            affected_rows
        }
    }
`

const deleteResident = /* GraphQL */ `
    mutation($id: Int!) {
        delete_device_resident(where: { id: { _eq: $id } }) {
            affected_rows
        }
    }
`

const deleteOwner = /* GraphQL */ `
    mutation($id: Int!) {
        delete_device_owner(where: { id: { _eq: $id } }) {
            affected_rows
        }
    }
`

const upsertUser = /* GraphQL */ `
    mutation upsertUser($name: String!, $phone: String!) {
        insert_user(
            objects: [{ name: $name, phone: $phone }]
            on_conflict: { constraint: user_phone_key, update_columns: [] }
        ) {
            returning {
                id
            }
        }
    }
`

const getUser = /* GraphQL */ `
    query getUser($phone: String!) {
        user(where: { phone: { _eq: $phone } }) {
            id
        }
    }
`

const upsertOwner = /* GraphQL */ `
    mutation upsertDeviceOwner($device_id: Int!, $user_id: Int!) {
        insert_device_owner(
            objects: [{ device_id: $device_id, user_id: $user_id }]
            on_conflict: {
                constraint: device_owner_device_id_user_id_key
                update_columns: []
            }
        ) {
            affected_rows
        }
    }
`

const updateDevice = /* GraphQL */ `
    mutation(
        $id: Int!
        $street: String
        $city: String
        $gate_phone: String
        $door_code: String
        $house: String
    ) {
        update_device(
            where: { id: { _eq: $id } }
            _set: {
                street: $street
                city: $city
                gate_phone: $gate_phone
                door_code: $door_code
                house: $house
                registered: true
            }
        ) {
            affected_rows
        }
    }
`

const getDevicePublicView = /* GraphQL */ `
    query getDevicePublicView($id: Int!) {
        device_public_view(where: { id: { _eq: $id } }) {
            registered
        }
    }
`

export const save = async ({ queryDb, body }) => {
    console.log('save body', JSON.stringify(body, 0, 2))

    const { deviceId, userId, details, residents, owners, isNew } = body
    throwIf(
        !deviceId || !userId || !details || !residents || !owners,
        400,
        '* MISSING INPUTS'
    )()

    const { registered } = await queryDb(getDevicePublicView, { id: deviceId })
        .then(d => d.devicePublicView[0] || {})
        .then(throwIf(isEmpty, 400, 'Not found'))
    if (isNew) {
        throwIf(registered, 400, 'Already registered')()
    } else {
        throwIf(!registered, 400, 'Not registered yet')()
    }

    let affectedRows

    console.log(`isNew ${isNew}, userId ${userId}`)

    const promisesOwners = owners.map(
        async ({ deleted, unchanged, updated, id, ...owner }) => {
            owner = trimObjectProperties(owner)
            if (deleted) {
                affectedRows = await queryDb(deleteOwner, { id })
                    .then(d => d.deleteDeviceOwner.affectedRows)
                    .catch(err =>
                        throwError(400, `Error deleting owner ${owner.name}`)(err)
                    )
                console.log(
                    `\n* deleted owner ${JSON.stringify(
                        owner
                    )} \n * affectedRows ${affectedRows}`
                )
            } else if (unchanged) {
            } else {
                // Only in case of NEW Owner (interface is readonly)
                console.log('owner.userId', owner.userId)
                let { userId } = owner
                if (!userId) {
                    // If it is an added owner (not the one that edits the device)
                    ;({ id: userId } = await queryDb_role_edit_device(upsertUser, owner)
                        .then(d => d.insertUser.returning[0] || {})
                        .catch(err => {
                            throwError(400, `Error inserting owner user ${owner.name}`)(
                                err
                            )
                        }))
                    if (!userId) {
                        ;({ id: userId } = await queryDb_role_edit_device(getUser, {
                            phone: owner.phone,
                        })
                            .then(d => d.user[0] || {})
                            .catch(err => {
                                throwError(400, `Error quering owner user ${owner.name}`)(
                                    err
                                )
                            }))
                    }
                    console.log(
                        `\n* inserted owner-user ${JSON.stringify(
                            owner
                        )} to User table - userId`,
                        userId
                    )
                }

                if (!userId) {
                    throwError(400, `Error inserting owner ${owner.name}`)()
                }
                // !!!!!!!!!--------------------
                affectedRows = await queryDb_role_edit_device(upsertOwner, {
                    deviceId,
                    userId,
                })
                    .then(d => d.insertDeviceOwner.affectedRows)
                    .catch(err =>
                        throwError(400, `Error inserting owner ${owner.name}`)(err)
                    )
                console.log(
                    `\n* inserted owner ${JSON.stringify(
                        owner
                    )} with deviceId ${deviceId} with userId ${userId} \n * affectedRows ${affectedRows}`
                )
            }
        }
    )
    await Promise.all([...promisesOwners])

    const promisesResidents = residents.map(
        async ({ deleted, updated, unchanged, id, readOnly, ...resident }) => {
            resident = trimObjectProperties(resident)
            if (deleted) {
                affectedRows = await queryDb(deleteResident, { id })
                    .then(d => d.deleteDeviceResident.affectedRows)
                    .catch(err =>
                        throwError(400, `Error deleting resident ${resident.name}`)(err)
                    )
                console.log(
                    `\n* deleted resident ${JSON.stringify(
                        resident
                    )} \n * affectedRows ${affectedRows}`
                )
            } else if (updated) {
                affectedRows = await queryDb(updateResident, { id, ...resident })
                    .then(d => d.updateDeviceResident.affectedRows)
                    .catch(err =>
                        throwError(400, `Error updating resident ${resident.name}`)(err)
                    )
                console.log(
                    `\n* updated resident ${JSON.stringify(
                        resident
                    )} \n * affectedRows ${affectedRows}`
                )
            } else if (unchanged) {
            } else {
                affectedRows = await queryDb(insertResident, { deviceId, ...resident })
                    .then(d => d.insertDeviceResident.affectedRows)
                    .catch(err =>
                        throwError(400, `Error inserting resident ${resident.name}`)(err)
                    )
                console.log(
                    `\n* inserted resident ${JSON.stringify(
                        resident
                    )} \n * affectedRows ${affectedRows}`
                )
            }
        }
    )
    await Promise.all([...promisesResidents])

    let { updated, ...detailsRest } = details
    detailsRest = trimObjectProperties(detailsRest)
    if (updated || isNew) {
        // Device is always updated because it was created when devicefirst connected
        await queryDb(updateDevice, { id: deviceId, ...detailsRest })
            .then(d => d.updateDevice.affectedRows)
            .catch(err => throwError(400, `Error updating device`)(err))
            .then(affectedRows => {
                console.log(
                    `\n* updated device${deviceId} with ${JSON.stringify(
                        details
                    )}  \n * affectedRows ${affectedRows}`
                )
            })
    }

    return { deviceId }
}
