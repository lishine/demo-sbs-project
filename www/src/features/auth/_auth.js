// node_modules
import { action, thunk } from 'easy-peasy'

// Common
import { postApi } from 'utils/fetch'

// Local
import { login } from '../login/_login'
import { profile } from './profile/_profile'

export let path
export const auth = ({ parentPath = '' }) => {
    path = `${parentPath}${parentPath && '.'}auth`
    console.log('apath', path)
    return {
        login: login({ parentPath: path }),
        profile: profile({ parentPath: path }),

        isAuth: false,
        setAuth: action((state, isAuth) => {
            state.isAuth = isAuth
        }),

        logout: thunk(async actions => {
            actions.setAuth(false)
            actions.showLogin()
            await postApi({ url: '/auth/logout' })
        }),

        enter: thunk(async actions => {
            actions.setAuth(true)
            await actions.profile.loadProfile()
        }),

        showLogin: thunk((actions, payload, { getStoreActions }) => {
            let params = payload || {}
            params.mode = params.mode || 'SignIn'
            getStoreActions().openModal({ component: 'Login', params })
        }),
    }
}
