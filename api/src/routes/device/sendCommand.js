import { throwIf, throwError } from 'utils/error'
import { sendCommand as ws_sendCommand } from 'ws/ws-server'
import { data as commands } from '../admin/tables/actions'

const validateCommand = ({ code, params }) => {
    const commandFound = commands.find(command => command.code === code)
    console.log('commandFound', commandFound)
    const isParamsOk = () =>
        !params ||
        (typeof params === 'object' &&
            Object.keys(params).every(
                paramName =>
                    Array.isArray(commandFound.params) &&
                    commandFound.params.find(paramFound => paramFound.name === paramName)
            ))

    return commandFound && isParamsOk() && commandFound
}

export const sendCommand = async ({ user, body }) => {
    console.log('sendCommand body', body)
    const { deviceNames, code, params, waitForResult } = body
    const { role } = user

    const valideCommand = validateCommand({ code, params })
    throwIf(!valideCommand, 400, 'Command not valid')()
    throwIf(
        !valideCommand.roles.find(roleFromList => roleFromList === role),
        400,
        'Command not authorized'
    )()

    let ret = {}
    for (const deviceName of deviceNames) {
        const promise = ws_sendCommand({
            deviceName,
            code,
            params,
        })
        ret[deviceName] =
            (waitForResult ? await promise : promise && 'SUCCESS') || 'NOT CONNECTED'
    }

    return ret
}
