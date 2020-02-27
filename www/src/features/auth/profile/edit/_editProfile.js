import { action, thunk } from 'easy-peasy'

// Common
import { formModel } from 'common/models/formModel'
import { queryDb } from 'utils/fetch'
import { translate } from 'utils/langugae'

const updateProfile = async props => {
    const { data, err, timeOut, queryError } = await queryDb(
        /* GraphQL */ `
            mutation updateProfile($user_id: Int!, $name: String!) {
                update_user(where: { id: { _eq: $user_id } }, _set: { name: $name }) {
                    affected_rows
                }
            }
        `,
        props
    )
    if (data && data.updateUser.affectedRows !== 1) {
        return {
            data,
            err,
            timeOut,
            queryError,
            customError: { message: translate('No user') },
        }
    }
    return { data, err, timeOut, queryError }
}

export let path
export const editProfile = ({ parentPath = '' }) => {
    path = `${parentPath}${parentPath && '.'}editProfile`
    return {
        ...formModel(),

        startSubmitting: thunk(async (actions, ___, { getState, getStoreState }) => {
            const { values } = getState()
            const { id } = getStoreState().auth.profile.user

            const { data, err, timeOut, queryError, customError } = await updateProfile({
                userId: id,
                ...values,
            })
            actions.stopSubmitting({ data, err, timeOut, queryError, customError })
        }),

        submitSuccess: thunk(
            async (actions, { returnData: { code } }, { getStoreActions, getState }) => {
                console.log('*** submitSuccess')

                getStoreActions().auth.profile.loadProfile()
                getStoreActions().closeModal()
            }
        ),
    }
}
