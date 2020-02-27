import { action } from 'easy-peasy'

import { auth } from 'features/auth/_auth'
import { devices } from 'features/manage/devices/_devices'
import { users } from 'features/manage/users/_users'
import { events } from 'features/monitor/events/_events'
import { test } from 'features/test/_test'

export let initialState = {}
export const updateInitialState = _initialState => (initialState = _initialState)

export const model = () => ({
    ssrInitialState: {},
    setSSRInitialState: action((state, ssrInitialState) => {
        state.ssrInitialState = ssrInitialState
    }),
    reset: action(state => {
        state.modal = undefined
    }),
    test: test({}),
    auth: auth({}),
    manage: {
        devices: devices({ parentPath: 'manage' }),
        users: users({ parentPath: 'manage' }),
    },
    monitor: { events: events({ parentPath: 'monitor' }) },

    isModalOpen: false,
    modal: undefined,
    openModal: action((state, modal) => {
        state.isModalOpen = true
        if (modal) {
            state.modal = modal
        }
    }),
    closeModal: action(state => {
        state.isModalOpen = false
    }),

    router: {
        pathname: undefined,
        query: undefined,
        asPath: undefined,
        route: undefined,
        set: action((state, newState) => {
            Object.assign(state, newState)
        }),
    },
})
