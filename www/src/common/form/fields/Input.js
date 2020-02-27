import React, { useState } from 'react'
import { css } from '@emotion/core'
import styled from '@emotion/styled'

import { MapFormikProps } from '../utils/mapFormikProps'
import { Svg, P, Span, Box, Flex } from 'styles/ss-components'

import * as icons from 'svg/icons/index'

const LeftIcon = ({ field: { leftIcon } }) => {
    const Icon = icons[leftIcon]
    console.log('leftIcon', leftIcon)
    return !Icon ? null : (
        <Flex
            mis="10px"
            mt={2}
            pointerEvents="none"
            w={1}
            height={0}
            position="absolute"
            justifyContent="flex-start"
        >
            <Icon fill="var(--color, var(--dark-muted))" />
        </Flex>
    )
}

const RightIcon = ({ visibility, setVisibility, status, field: { name } }) => {
    let Icon
    if (name.includes('password')) {
        Icon = visibility ? icons.Visibility : icons.VisibilityOff
    } else if (status === 'error') {
        Icon = icons.ExclamationSolid
    } else if (status === 'valid') {
        Icon = icons.CheckMd
    }

    return !Icon ? null : (
        <Flex
            pie="10px"
            mt="12px"
            pointerEvents="none"
            w={1}
            height={0}
            position="absolute"
            justifyContent="flex-end"
            onClick={() => setVisibility(!visibility)}
        >
            <Icon fill="var(--color, var(--dark-muted))" />
        </Flex>
    )
}

const StyledInput = styled.input`
    ${props =>
        props.status === 'error' &&
        css`
            --color: var(--danger);
            --border-width: 2px;
        `}
    ${props =>
        props.status === 'valid' &&
        css`
            --color: var(--success);
            --border-width: 2px;
        `}

    width: 100%;
    height: 3em;
    border-radius: var(--border-radius);
    padding-inline-start: 2.4em;
    padding-inline-end: 2.4em;

    &:focus {
        outline: 0;
        box-shadow: none;
        border: 2px solid var(--color, #b2c6ff);
        color: var(--color, var(--onwhite-normal));
    }

    border: var(--border-width, 1px) solid var(--color, var(--onwhite-border));
    color: var(--color, var(--onwhite-muted));

    &::placeholder {
        color: currentColor;
    }
`

export const Input = props => (
    <MapFormikProps {...props}>
        {({ error, ...props }) => {
            const [visibility, setVisibility] = useState(false)
            const { field } = props
            field.type = field.type || 'text'
            if (field.name.includes('password')) {
                field.type = visibility ? 'text' : 'password'
            }

            const { status } = props

            return (
                <>
                    <Flex position="relative">
                        <LeftIcon {...props} />
                        <StyledInput status={status} {...field} />
                        <RightIcon {...{ visibility, setVisibility, ...props }} />
                    </Flex>
                    {status === 'error' && <Box mt={1}>{error}</Box>}
                </>
            )
        }}
    </MapFormikProps>
)
