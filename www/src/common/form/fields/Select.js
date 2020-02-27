import React, { useState } from 'react'
import { css } from '@emotion/core'
import styled from '@emotion/styled'

import { MapFormikProps } from '../utils/mapFormikProps'
import { StyledSelect } from 'common/StyledSelect'
import { Svg, P, Span, Box } from 'styles/ss-components'

export const Select = ({ children, ...props }) => (
    <MapFormikProps {...props}>
        {({ error, ...props }) => {
            const { status } = props
            const { field } = props

            return (
                <>
                    <StyledSelect status={status} {...field}>
                        {children}
                    </StyledSelect>
                    {status === 'error' && <Box mt={1}>{error}</Box>}
                </>
            )
        }}
    </MapFormikProps>
)
