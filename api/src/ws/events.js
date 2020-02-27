import { queryDb as _queryDb } from 'utils/utils'

const queryDb = _queryDb({ role: 'device' })

const insertEventQuery = props =>
    queryDb(
        /* GraphQL */ `
            mutation($device_name: String!, $code: String!) {
                insert_device_event(
                    objects: [{ device_name: $device_name, code: $code }]
                ) {
                    affected_rows
                }
            }
        `,
        props
    )

export const insertEvent = async ({ deviceName, code }) => {
    await insertEventQuery({
        code,
        deviceName,
    })
}
