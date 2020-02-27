import { postRouter } from 'utils/microWrappers'

// Local
import { save } from './save'

export default postRouter(
    {
        save,
    },
    __dirname
)
