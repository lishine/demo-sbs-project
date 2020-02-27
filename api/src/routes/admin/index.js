import { postRouter } from 'utils/microWrappers'
import { fillDb } from './fillDb'

export default postRouter(
    {
        fillDb: fillDb,
    },
    __dirname
)
