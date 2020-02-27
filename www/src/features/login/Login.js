import React, { useState, useEffect } from 'react'
import get from 'lodash/fp/get'

// Common
import { usePathStore, usePathActions } from 'common/hooks/hooks'
import { Chevron } from 'svg/icons'
import { GlobalModalWrap } from 'common/modal/GlobalModalWrap'
import { Box, Flex, Span, H3, H4, NavLink, P, SvgIcon } from 'styles/ss-components'
import { translate } from 'utils/langugae'

// Local
import { CodeForm } from './CodeForm'
import { DetailsForm } from './DetailsForm'
import { path } from './_login'

export const Content = ({ mode: _mode }) => {
    console.log('path', path)

    const { stage, mode } = usePathStore(path)(['stage', 'mode'])
    const { reset, navigate, setMode } = usePathActions(path)([
        'reset',
        'navigate',
        'setMode',
    ])

    useEffect(() => {
        reset()
        if (_mode) {
            setMode({ mode: _mode })
        }
    }, [_mode])

    console.log('mode', mode)
    console.log('stage', stage)

    const Stage = stage === 'Details' ? DetailsForm : CodeForm

    let header
    if (mode === 'SignUp') {
        header = translate('Sign Up')
    } else if (mode === 'SignIn') {
        header = translate('Sign In')
    } else if (mode === 'UpdatePhone') {
        header = translate('Update Phone')
    }

    return (
        <Flex width={300} mx="auto" flexDirection="column">
            <Flex my={2} alignItems="center" justifyContent="space-between">
                <H3 mx="auto">{header}</H3>
                {(mode === 'SignUp' || mode === 'SignIn') && (
                    <P mt="auto">
                        <NavLink
                            onClick={() =>
                                navigate({
                                    mode: mode === 'SignUp' ? 'SignIn' : 'SignUp',
                                })
                            }
                        >
                            {mode === 'SignUp'
                                ? translate('Sign In')
                                : translate('Sign Up')}
                            <SvgIcon flipXIfRTL>
                                <Chevron />
                            </SvgIcon>
                        </NavLink>
                    </P>
                )}
            </Flex>
            <Box width={200} mx="auto">
                <Stage />
            </Box>
        </Flex>
    )
}

export const Login = props => (
    <GlobalModalWrap
        bg="grey"
        className="grid-container margin-container-md"
        width={400}
        // height={[null, 648, 664, 648]}
        alignSelf={['start', 'center']}
        overflow={['auto', 'visible']}
        // transform={[null, 'translateY(-30px)', 'translateY(3px)', 'translateY(-80px)']}
    >
        <Content {...props} />
    </GlobalModalWrap>
)
