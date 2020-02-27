import React, { useState, useEffect } from 'react'

// Common
import { Flex, H3, H4 } from 'styles/ss-components'
import { router } from 'routes'
import { usePathStore, usePathActions } from 'common/hooks/hooks'
import { translate } from 'utils/langugae'

// Local
import * as stages from './stages/index'
import { path } from './_editDevice'

export const EditDevice = ({ isNew, isRegister, isEdit, isCreate }) => {
    const query = usePathStore('router')('query')
    const isInitialized = usePathStore(path)('isInitialized')
    const {
        setStage,
        setDeviceName,
        reset,
        setIsNew,
        setIsEdit,
        setIsCreate,
        setIsRegister,
        setInitialized,
    } = usePathActions(path)([
        'setStage',
        'setDeviceName',
        'reset',
        'setIsNew',
        'setIsEdit',
        'setIsCreate',
        'setIsRegister',
        'setInitialized',
    ])

    useEffect(() => {
        setIsNew(isNew)
        setIsRegister(isRegister)
        setIsEdit(isEdit)
        setIsCreate(isCreate)

        const { deviceName } = query
        if (deviceName) {
            setDeviceName(deviceName)
        }

        // if (isNew) {
        // if (deviceName) {
        // router.replaceRoute('registerDevice', {}, { shallow: true })
        // }
        // }
        setStage('DeviceName')
        setInitialized(true)
        return () => reset()
    }, [isNew, isEdit, isRegister, isCreate, query])

    const stage = usePathStore(path)('stage')

    if (!isInitialized) {
        return null
    }
    const Stage = stages[stage]

    return (
        <Flex width={800} mx="auto" flexDirection="column" mt={6}>
            <H4 fontSize={38} mx="auto" mb={4}>
                {isCreate && translate('Create New Device')}
                {isRegister && translate('Register New Device')}
                {isEdit && translate('Edit Device')}
            </H4>
            <Stage />
        </Flex>
    )
}
