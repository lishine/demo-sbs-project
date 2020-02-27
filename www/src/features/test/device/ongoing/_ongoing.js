import { action, thunk, listen } from 'easy-peasy'
import isEmpty from 'lodash/isEmpty'

// Common
import { loadModel } from 'common/models/loadModel'
import { usePathStore, usePathActions } from 'common/hooks/hooks'
import { queryDb } from 'utils/fetch'

// Local
export let pathOngoing
export let useLocalStore
export let useLocalActions

const getDevices = props =>
    queryDb(
        /* GraphQL */ `
            query {
                device {
                    device_name
                }
            }
        `,
        props
    )

const insertEvent = props =>
    queryDb(
        /* GraphQL */ `
            mutation($device_name: Int!, $timestamp: timestamptz!, $code: String!) {
                insert_device_event(
                    objects: [
                        { device_name: $device_name, timestamp: $timestamp, code: $code }
                    ]
                ) {
                    affected_rows
                }
            }
        `,
        props
    )

const codes = ['ALARM', 'FIRE', 'EMERGENCY']

export const ongoing = ({ path }) => {
    pathOngoing = `${path}.ongoing`
    useLocalStore = usePathStore(pathOngoing)
    useLocalActions = usePathActions(pathOngoing)
    console.log('pathOngoing', pathOngoing)
    return {
        sendEvent: thunk(async (actions, ___) => {
            let { data, err, timeOut, queryError } = await getDevices()
            let success
            if (data && !isEmpty(data.device)) {
                const deviceNames = data.device.map(({ deviceName }) => deviceName)
                console.log('deviceNames', deviceNames)
                ;({ data, err, timeOut, queryError } = await insertEvent({
                    code: codes[Math.floor(Math.random() * codes.length)],
                    deviceName:
                        deviceNames[Math.floor(Math.random() * deviceNames.length)],
                    timestamp: new Date(),
                }))
                if (data) {
                    success = true
                }
            }
            actions.setErr(
                (success && 'Success') ||
                    (err && err.message) ||
                    (queryError && 'Query Error') ||
                    (timeOut && 'Timeout')
            )
        }),

        err: [],
        setErr: action((state, err) => {
            state.err = err
        }),
    }
}
