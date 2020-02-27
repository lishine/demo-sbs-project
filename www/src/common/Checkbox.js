import React, { useState } from 'react'
import _Checkbox from 'rc-checkbox'
import './checkbox.css'

import { P, Box, Flex, Span, Text, Card, Image, H3, Button } from 'styles/ss-components'

export const Checkbox = ({ children, ...props }) => {
    const [checked, setChecked] = useState(false)

    return (
        <Box {...props}>
            <label>
                <_Checkbox
                    defaultChecked
                    onChange={event => setChecked(event.target.checked)}
                    disabled={false}
                />
                &nbsp;&nbsp;&nbsp;{children}
            </label>
        </Box>
    )
}
