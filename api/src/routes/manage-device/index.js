import { postRouter } from 'utils/microWrappers'

// Local
import { deleteDevice } from './deleteDevice'

export default postRouter(
    {
        deleteDevice,
    },
    __dirname
)
