import React, { useState, useEffect } from 'react'
import { useStoreState, useStoreActions } from 'easy-peasy'
import get from 'lodash/fp/get'
import { mapToObject } from 'utils/utils'

const toUseEasyPeasy = storeOrActions => path => inPath => {
    const easyFunction = storeOrActions === 'actions' ? useStoreActions : useStoreState
    let ret
    const root = stateOrActions => (path ? get(path)(stateOrActions) : stateOrActions)
    if (inPath) {
        if (Array.isArray(inPath)) {
            ret = easyFunction(stateOrActions =>
                mapToObject(p => ({ [p]: get(p)(root(stateOrActions)) }))(inPath)
            )
        } else {
            ret = easyFunction(stateOrActions => get(inPath)(root(stateOrActions)))
        }
    } else {
        ret = easyFunction(stateOrActions => root(stateOrActions))
    }
    return ret
}

export const usePathActions = toUseEasyPeasy('actions')
export const usePathStore = toUseEasyPeasy('store')

export const useToggle = _state => {
    const [state, setState] = useState(_state)
    const toggleState = () => setState(!state)
    return [state, toggleState, setState]
}

// export const useStore = path => _useStore(state => get(path)(state))
