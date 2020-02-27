import React from 'react'

import * as modals from './modals'
import { usePathStore } from 'common/hooks/hooks'

export const ModalSelect = () => {
    const modal = usePathStore('modal')()
    if (!modal) {
        return null
    }
    const { component, params } = modal
    const Component = modals[component]

    return <Component {...params} />
}
