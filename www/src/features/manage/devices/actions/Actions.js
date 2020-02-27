import React, { useState, useEffect, useMemo } from 'react'
import { css } from '@emotion/core'
import get from 'lodash/fp/get'

// Common
import { Flex, H3, Box, Span, Button, SvgIcon, Form, Grid } from 'styles/ss-components'
import { Loading, mapToObject, Map, titleCase } from 'utils/utils'
import { StyledSelect } from 'common/StyledSelect'
import { translate } from 'utils/langugae'

// Local
import { path } from './_actions'
import { ActionsForm } from './ActionsForm'
import { Modal } from 'common/modal/Modal'
import { usePathStore, usePathActions } from 'common/hooks/hooks'

export const Actions = props => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const closeModal = () => setIsModalOpen(false)
    const openModal = () => setIsModalOpen(true)

    const { loading, err, actions } = usePathStore(path)(['actions', 'loading', 'err'])
    const { setSelectedCode, loadActions } = usePathActions(path)([
        'setSelectedCode',
        'loadActions',
    ])

    useEffect(() => {
        loadActions()
    }, [])

    if (err) {
        return (
            <Flex flex={1} mt={3} pis={45}>
                {err.message}
            </Flex>
        )
    }

    return (
        <Loading loading={loading}>
            <Flex {...props} flexWrap="wrap">
                <Map collection={actions}>
                    {({ code }) => (
                        <Button
                            onClick={() => {
                                setSelectedCode(code)
                                openModal()
                            }}
                            mis={2}
                            my={1}
                            w={150}
                            className="btn-table"
                        >
                            {translate(titleCase(code))}
                        </Button>
                    )}
                </Map>
                <Modal
                    controlled
                    closeModal={closeModal}
                    isModalOpen={isModalOpen}
                    bg="grey"
                    width={300}
                    height={350}
                >
                    <ActionsForm />
                </Modal>
            </Flex>
        </Loading>
    )
}
