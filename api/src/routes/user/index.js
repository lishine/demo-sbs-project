import { postRouter } from 'utils/microWrappers'
import { profile } from './profile'
import { editUser } from './editUser'
import { deleteUser } from './deleteUser'

export default postRouter(
    {
        editUser,
        profile,
        deleteUser,
    },
    __dirname
)
