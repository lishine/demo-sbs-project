import React from 'react'

// Common
import { Modal } from './Modal'
import { usePathActions, usePathStore } from 'common/hooks/hooks'

export const GlobalModalWrap = props => {
    const isModalOpen = usePathStore()('isModalOpen')
    const closeModal = usePathActions()('closeModal')
    return <Modal {...props} {...{ controlled: true, isModalOpen, closeModal }} />
}
