import { postRouter } from 'utils/microWrappers'
import { login } from './login'
import { isAuth } from './isAuth'
import { profile } from '../user/profile'
import { editUser } from '../user/editUser'
import { logout } from './logout'

export default postRouter(
    {
        editUser,
        profile,
        login,
        isAuth,
        logout,
    },
    __dirname
)
