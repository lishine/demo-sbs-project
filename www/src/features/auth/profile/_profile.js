import { action, thunk } from 'easy-peasy'
import indexOf from 'lodash/fp/indexOf'
import get from 'lodash/fp/get'

// Common
import { initialState } from 'features/model'
import { postApi } from 'utils/fetch'

// Local
import { editProfile } from './edit/_editProfile'

export let path
export const profile = ({ parentPath = '' }) => {
    path = `${parentPath}${parentPath && '.'}profile`
    return {
        // reset: action(state => {
        //     Object.assign(state, get(path)(initialState))
        // }),
        editProfile: editProfile({ parentPath: path }),

        loadProfile: thunk(async actions => {
            const { data, err, timeOut } = await postApi({
                url: '/user/profile',
            })
            console.log('loadProfile profile data', data)

            if (data) {
                actions.setUser(data.user)
            } else {
                console.error('err / timeOut', err, timeOut)
            }
        }),

        user: {},
        setUser: action((state, user) => {
            state.user = user
        }),
    }
}
