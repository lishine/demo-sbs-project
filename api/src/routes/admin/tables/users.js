const upsertUsers = /* GraphQL */ `
    mutation($objects: [user_insert_input!]!) {
        insert_user(
            objects: $objects
            on_conflict: { constraint: user_phone_key, update_columns: [role, name] }
        ) {
            affected_rows
        }
    }
`

const data = [{ name: 'Company Center', role: 'COMPANY_CENTER', phone: '222222' }]

export const users = async ({ queryDb }) => {
    let affectedRows
    affectedRows = await queryDb(upsertUsers, { objects: data }).then(
        d => d.insertUser.affectedRows
    )
    console.log('users, affectedRows', affectedRows)

    return { users: affectedRows }
}
