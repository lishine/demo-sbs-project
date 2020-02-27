import get from 'lodash/fp/get'
import { createStore, action } from 'easy-peasy'

import { model, updateInitialState, initialState } from './model'

export const makeStore = (updatedState, options) => {
    console.log('MAKING STORE')
    // console.log('model', JSON.stringify(model(), 0, 2))
    const store = createStore(model(), { initialState: updatedState })
    console.log('CREATED')
    // if (process.env.NODE_ENV === 'development') {
    //     if (module.hot) {
    //         module.hot.accept('./model', () => {
    //             store.reconfigure(model(), { initialState: updatedState }) // 👈 Here is the magic
    //         })
    //     }
    // }
    if (!updatedState) {
        console.log('*** updating global-var initialState on the server')
        // console.log('store.getState()', store.getState())
        updateInitialState(store.getState())
        store.getActions().setSSRInitialState(initialState)
        updateInitialState(store.getState())
    } else {
        console.log('*** updating global-var initialState after store mutated')
        updateInitialState(store.getState().ssrInitialState)
    }

    return store
}
