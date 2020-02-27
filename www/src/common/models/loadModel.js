import { action, thunk } from 'easy-peasy'

export const loadModel = () => ({
    loading: false,
    err: undefined,
    timeOut: undefined,
    setLoading: action((state, loading) => {
        state.loading = loading
    }),
    setData: action((state, data) => {
        state.data = data
    }),
    setErr: action((state, err) => {
        state.err = err
    }),
    setTimeOut: action((state, timeOut) => {
        state.timeOut = timeOut
    }),
})
