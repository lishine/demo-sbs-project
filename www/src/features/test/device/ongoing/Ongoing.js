import React, { useEffect } from 'react'
import { css } from '@emotion/core'
import styled from '@emotion/styled'
import get from 'lodash/fp/get'

// Common
import { Box, Form, Button, Flex, Span } from 'styles/ss-components'
import { Field, FieldArray } from 'formik'
import { Input } from 'common/form/fields/Input'
import { FForm } from 'common/form/FForm'
import { Map } from 'utils/utils'
import { translate } from 'utils/langugae'

// Local
import { useLocalStore, useLocalActions } from './_ongoing'

export const Ongoing = () => {
    const err = useLocalStore('err')
    const sendEvent = useLocalActions('sendEvent')

    return (
        <Box width={600} mx="auto" flexDirection="column">
            <Flex my={5} fontSize={3} justifyContent="space-around">
                Device Ongoing
            </Flex>
            <Flex mt={4} flexDirection="column" alignItems="center">
                <Button
                    width={150}
                    className="btn btn-primary"
                    onClick={() => sendEvent()}
                >
                    Send Random Event
                </Button>
                <Box my={2}> {err} </Box>
            </Flex>
        </Box>
    )
}
