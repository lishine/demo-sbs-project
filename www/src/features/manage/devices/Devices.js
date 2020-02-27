import React, { useState, useEffect } from 'react'
import { css } from '@emotion/core'
import isEmpty from 'lodash/isEmpty'

// Common
import { Flex, H3, Box, Span, Button, SvgIcon, H4 } from 'styles/ss-components'
import { translate } from 'utils/langugae'

// Local
import { Actions } from './actions/Actions'
import { Table } from './Table'

export const Devices = () => {
    return (
        <Flex width={1024} mx="auto" flexDirection="column" justifyContent="flex-start">
            <H3 mx="auto" mt={2} mb={6}>
                {translate('Devices')}
            </H3>
            <H4>{translate('Actions')}</H4>

            <Actions pt={1} mis={1} pb={3} />
            <Table />
        </Flex>
    )
}
