import { post } from 'utils/utils'
import { throwIf, throwError } from 'utils/error'

export const dbForward = ({ user, body }) => {
    console.log('body dbForward query', body.query)
    console.log('variables', body.variables)
    console.log('user id', user.id)
    console.log('user role', user.role)
    return post(
        process.env.DB_GRAPHQL_URL,
        body,
        {
            'x-hasura-user-id': user.id,
            'x-hasura-role': user.role,
            'x-hasura-admin-secret': process.env.HASURA_GRAPHQL_ADMIN_SECRET,
        },
        true
    ).then(data => {
        console.log('data', JSON.stringify(data, 0, 2))
        return data
    })
}
