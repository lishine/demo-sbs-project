import isEmpty from 'lodash/isEmpty'

import { throwError, throwIf } from 'utils/error'
import { queryDb, trimObjectProperties } from 'utils/utils'

const insertUser = /* GraphQL */ `
    mutation insertUser($name: String!, $phone: String!, $role: String!) {
        insert_user(objects: [{ name: $name, phone: $phone, role: $role }]) {
            returning {
                id
            }
        }
    }
`

const updateUser = /* GraphQL */ `
    mutation updateUser($id: Int!, $phone: String!, $name: String!, $role: String!) {
        update_user(
            where: { id: { _eq: $id } }
            _set: { phone: $phone, name: $name, role: $role }
        ) {
            affected_rows
        }
    }
`

export const editUser = async ({ queryDb, body }) => {
    console.log('edit user body', body)

    let { isNew, ...params } = body
    throwIf(!params, 400, '* MISSING INPUTS')()
    params = trimObjectProperties(params)

    const { id, name, phone, role } = params
    if (id) {
        await queryDb(updateUser, { id, name, phone, role })
            .then(throwIf(d => d.updateUser.affectedRows !== 1, 400, 'No user'))
            .catch(err => {
                const { message } = err
                if (message.includes('duplicate') && message.includes('phone')) {
                    throwError(400, 'Phone already registered')(err)
                } else {
                    throw err
                }
            })
    } else {
        await queryDb(insertUser, { name, phone, role })
            .then(d => d.insertUser.returning[0])
            .catch(err => {
                const { message } = err
                if (message.includes('duplicate') && message.includes('phone')) {
                    throwError(400, 'User already exists')(err)
                } else {
                    throw err
                }
            })
    }

    return { id }
}
