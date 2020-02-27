import { postRouter } from 'utils/microWrappers'
import { register } from './register'
import { sendCommand } from './sendCommand'

export default postRouter(
    {
        sendCommand,
        register,
    },
    __dirname
)
