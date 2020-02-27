import { action, thunk, listen } from 'easy-peasy'

// Common
import { loadModel } from 'common/models/loadModel'

// Local
import { loadEvents } from './loadEvents'

export let path
export const events = ({ parentPath = '' }) => {
    path = `${parentPath}${parentPath && '.'}events`
    return {
        // isShowActions: false,
        // setIsShowActions: action((state, isShowActions) => {
        //     state.isShowActions = isShowActions
        // }),
        // toggleIsShowActions: thunk((actions, ___, { getState }) => {
        //     actions.setIsShowActions(!getState().isShowActions)
        // }),
        ...loadModel(),
        loadEvents,

        events: [],
        setEvents: action((state, events) => {
            state.events = events
        }),
    }
}
