import React from 'react'
import { MapFormikProps } from '../utils/mapFormikProps'
import { P, Span } from 'styles/ss-components'

import _Checkbox from 'rc-checkbox'
import 'common/checkbox.css'

const StyledCheckbox = ({ children, ...props }) => (
    <label>
        <_Checkbox {...props} id={props.name} checked={props.value || false} />
        &nbsp;&nbsp;&nbsp;
        <Span as="label" htmlFor={props.name}>
            {children}
        </Span>
    </label>
)

export const Checkbox = ({ children, ...props }) => (
    <MapFormikProps {...props}>
        {({ status, error, field, ...props }) => (
            <>
                <StyledCheckbox {...field}>{children}</StyledCheckbox>
                {status === 'error' && <Span>{error}</Span>}
            </>
        )}
    </MapFormikProps>
)
