import React, { useState, useEffect } from 'react'
import get from 'lodash/fp/get'

// Common
import { NavLink, Box, Form, Button, Flex, Span, H4, SvgIcon } from 'styles/ss-components'
import { Field } from 'formik'
import { Input } from 'common/form/fields/Input'
import { FForm } from 'common/form/FForm'
import { Chevron } from 'svg/icons'
import { usePathStore, usePathActions } from 'common/hooks/hooks'
import { translate } from 'utils/langugae'

// Local
import { path } from './_login'

export const CodeForm = () => {
    const { submitting, error, code } = usePathStore(path)([
        'submitting',
        'error',
        'code',
    ])
    const setStage = usePathActions(path)('setStage')

    return (
        <>
            <FForm path={path} initialValues={{ code: '' }} reset>
                {({ handleSubmit, submit }) => (
                    <Form onSubmit={handleSubmit} display="flex" flexDirection="column">
                        <Field name="code">
                            {props => (
                                <Input
                                    w="200px"
                                    mt={2}
                                    {...props}
                                    direction="ltr"
                                    autoComplete="one-time-code"
                                    placeholder={translate('Code from SMS')}
                                    leftIcon="Code"
                                />
                            )}
                        </Field>

                        <Flex justifyContent="space-between">
                            <NavLink
                                mt="2px"
                                onClick={() => submit({ resendCode: true })}
                            >
                                {translate('Resend code')}
                            </NavLink>
                            <Span> {code} </Span>
                        </Flex>

                        <Button
                            w="200px"
                            mt={2}
                            type="submit"
                            className="btn btn-primary"
                            disabled={submitting}
                            loading={submitting}
                        >
                            {translate('Submit')}
                        </Button>
                        <Box>
                            <NavLink
                                mt="4px"
                                onClick={() => setStage({ stage: 'Details' })}
                            >
                                <SvgIcon flipXIfRTL mis="-5px">
                                    <Chevron transform="rotate(180)" />
                                </SvgIcon>
                                {translate('Edit phone')}
                            </NavLink>
                        </Box>
                    </Form>
                )}
            </FForm>
            <Flex py={2}>{error}</Flex>
        </>
    )
}
