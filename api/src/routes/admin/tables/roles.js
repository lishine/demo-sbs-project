const data = [
    { code: 'OWNER' },
    { code: 'MUNICIPALITY' },
    { code: 'EMERGENCY_CENTER' },
    { code: 'HOUSE_COMMITTEE' },
    { code: 'COMPANY_CENTER' },
]

const upsertRoles = /* GraphQL */ `
    mutation($objects: [role_insert_input!]!) {
        insert_role(
            objects: $objects
            on_conflict: { constraint: role_code_key, update_columns: [] }
        ) {
            affected_rows
        }
    }
`

export const roles = async ({ queryDb }) => {
    let affectedRows
    affectedRows = await queryDb(upsertRoles, { objects: data }).then(
        d => d.insertRole.affectedRows
    )
    console.log('inserted roles, affectedRows', affectedRows)

    return { roles: affectedRows }
}

// const deleteRoles = props =>
//     queryDb(
//         /* GraphQL */ `
//             mutation {
//                 delete_role(where: {}) {
//                     affected_rows
//                 }
//             }
//         `,
//         props
//     )

// affectedRows = await deleteRoles()
// console.log('deleted roles, affectedRows', affectedRows)
