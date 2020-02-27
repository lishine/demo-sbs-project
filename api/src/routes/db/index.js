import { postRouter } from 'utils/microWrappers'
import { dbForward } from './dbForward'

export default postRouter(
    {
        dbForward,
    },
    __dirname
)
