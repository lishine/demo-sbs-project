import { action, thunk, listen } from 'easy-peasy'

// Common
import { loadModel } from 'common/models/loadModel'
import { usePathStore, usePathActions } from 'common/hooks/hooks'

// Local
import { user } from './user/_user'
import { editUser } from './editUser/_editUser'
import { loadUsers } from './loadUsers'
import { loadRoles } from './loadRoles'
import { columnsTemplate } from './columnsTemplate'

export const pathUsers = 'manage.users'
export const useLocalStore = usePathStore(pathUsers)
export const useLocalActions = usePathActions(pathUsers)

export let path
export const users = ({ parentPath = '' }) => {
    path = `${parentPath}${parentPath && '.'}users`
    return {
        ...loadModel(),
        user: user({ parentPath: pathUsers }),
        editUser: editUser({ parentPath: pathUsers }),

        loadUsers,
        users: [],
        setUsers: action((state, users) => {
            state.users = users
        }),

        loadRoles,
        roles: [],
        setRoles: action((state, roles) => {
            state.roles = roles
        }),

        columns: undefined,
        setColumns: action((state, columns) => {
            state.columns = columns
        }),
    }
}
