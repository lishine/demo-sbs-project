const textRoles = [
    'COMPANY_CENTER',
    'MUNICIPALITY',
    'EMERGENCY_CENTER',
    'HOUSE_COMMITTEE',
]

export const data = [
    { code: 'RESET', roles: ['COMPANY_CENTER'] },
    {
        code: 'TEXT_AUTO',
        roles: textRoles,
    },
    {
        code: 'TEXT_STATIC',
        roles: textRoles,
    },
    {
        code: 'SET_TEXT',
        params: [{ name: 'text' }, { name: 'frequency' }, { name: 'duration' }],
        roles: textRoles,
    },
    { code: 'DIAGNOSTICS', roles: ['COMPANY_CENTER'] },
    { code: 'YELLOW_LIGHT_ON', roles: ['COMPANY_CENTER'] },
    {
        code: 'RED_PROJECTOR_ON',
        params: [{ name: 'duration' }],
        roles: ['COMPANY_CENTER', 'EMERGENCY_CENTER'],
    },
    { code: 'LIGHT_OFF', roles: ['COMPANY_CENTER'] },
    {
        code: 'HORN_ON',
        roles: ['COMPANY_CENTER', 'EMERGENCY_CENTER'],
    },
    {
        code: 'HORN_OFF',
        roles: ['COMPANY_CENTER', 'EMERGENCY_CENTER'],
    },
    { code: 'DOOR_OPEN', roles: ['COMPANY_CENTER', 'OWNER', 'EMERGENCY_CENTER'] },
    { code: 'GATE_OPEN', roles: ['COMPANY_CENTER', 'EMERGENCY_CENTER'] },
    { code: 'CAMERA_ON', roles: ['COMPANY_CENTER', 'OWNER'] },
    { code: 'CAMERA_OFF', roles: ['COMPANY_CENTER', 'OWNER'] },
    {
        code: 'CONNECT_WIFI',
        params: [{ name: 'name' }, { name: 'password' }],
        roles: ['COMPANY_CENTER', 'OWNER'],
        show: false,
    },
]

const deleteActions = /* GraphQL */ `
    mutation {
        delete_action(where: {}) {
            affected_rows
        }
    }
`

const upsertActions = /* GraphQL */ `
    mutation($objects: [action_insert_input!]!) {
        insert_action(
            objects: $objects
            on_conflict: { constraint: action_code_key, update_columns: [params, roles] }
        ) {
            affected_rows
        }
    }
`

export const actions = async ({ queryDb }) => {
    let affectedRows

    await queryDb(deleteActions)

    affectedRows = await queryDb(upsertActions, { objects: data }).then(
        d => d.insertAction.affectedRows
    )
    console.log('inserted actions, affectedRows', affectedRows)

    return { actions: affectedRows }
}
