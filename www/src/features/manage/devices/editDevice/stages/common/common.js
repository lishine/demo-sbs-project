import React, { useState, useEffect } from 'react'
import get from 'lodash/fp/get'

import { Box, Form, Button, Flex, Span, H4, SvgIcon } from 'styles/ss-components'
import { Chevron } from 'svg/icons/index'

// Common
import { RouteLink } from 'common/RouteLink'
import { Quit } from 'svg/icons/Quit'
import { usePathStore, usePathActions } from 'common/hooks/hooks'
import { translate } from 'utils/langugae'

// Local
import { path as pathEditDevice } from '../../_editDevice'

export const ExitButton = () => {
    const isRegister = usePathStore(pathEditDevice)('isRegister')

    if (isRegister) {
        return <div />
    }

    return (
        <Button
            w="150px"
            className="btn btn-primary"
            onClick={() => window.history.back()}
        >
            <SvgIcon mie="8px">
                <Quit />
            </SvgIcon>
            {translate('Exit')}
        </Button>
    )
}
export const NavigateButton = ({ type, onClick, navigate, children, ...props }) => {
    const navigateAction = usePathActions(pathEditDevice)('navigate')

    return (
        <Button
            type={type}
            w="150px"
            className="btn btn-primary"
            onClick={
                onClick ||
                (type !== 'submit' && navigate && (() => navigateAction(navigate))) ||
                null
            }
            {...props}
        >
            {children ||
                (navigate > 0 ? (
                    <Span>
                        {translate('Next')}
                        <SvgIcon flipXIfRTL mis="2px">
                            <Chevron />
                        </SvgIcon>
                    </Span>
                ) : (
                    <Span>
                        <SvgIcon flipXIfRTL mis="-6px">
                            <Chevron transform="rotate(180)" />
                        </SvgIcon>
                        {translate('Back')}
                    </Span>
                ))}
        </Button>
    )
}
