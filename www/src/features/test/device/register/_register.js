import { formModel } from 'common/models/formModel'

import { submit } from './submit'
import { wifiConnect } from './wifiConnect'

// Local
export let localPath

export const register = ({ path }) => {
    localPath = `${path}.register`

    return {
        ...formModel(),
        submit,
        wifiConnect,
    }
}
