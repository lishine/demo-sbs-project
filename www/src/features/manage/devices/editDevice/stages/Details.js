import React, { useState, useEffect } from 'react'
import get from 'lodash/fp/get'
import { Field } from 'formik'

// Common
import { Box, Form, Button, Flex, Span, H4 } from 'styles/ss-components'
import { Input } from 'common/form/fields/Input'
import { FForm } from 'common/form/FForm'
import { usePathStore } from 'common/hooks/hooks'
import { translate } from 'utils/langugae'

// Local
import { NavigateButton } from './common/common'
import { path as pathEditDevice } from '../_editDevice'

export const Details = () => {
    const path = `${pathEditDevice}.stages.details`
    const error = usePathStore(path)('error')

    return (
        <Box>
            <H4 fontSize={25} textAlign="center">
                <strong>{translate('Device Details')}</strong>
            </H4>

            <FForm
                path={path}
                initialValues={{
                    city: '',
                    street: '',
                    house: '',
                    gatePhone: '',
                    doorCode: '',
                }}
            >
                {({ handleSubmit }) => (
                    <Form onSubmit={handleSubmit}>
                        <Box pt={3} display="grid" gridRowGap={2} w="200px" mx="auto">
                            <Box fontSize={21} mx="auto">
                                {translate('Address')}
                            </Box>
                            <Field name="city">
                                {props => (
                                    <Input
                                        {...props}
                                        autocompete="city"
                                        placeholder={translate('City')}
                                        leftIcon="City"
                                    />
                                )}
                            </Field>
                            <Field name="house">
                                {props => (
                                    <Input
                                        {...props}
                                        autocompete="house"
                                        placeholder={translate('House')}
                                        leftIcon="House"
                                    />
                                )}
                            </Field>
                            <Field name="street">
                                {props => (
                                    <Input
                                        {...props}
                                        autocompete="street-address"
                                        placeholder={translate('Street')}
                                        leftIcon="Street"
                                    />
                                )}
                            </Field>
                            <Box
                                fontSize={21}
                                my={1}
                                borderTop="2px solid var(--onwhite-normal)"
                            />
                            <Field name="gatePhone">
                                {props => (
                                    <Input
                                        {...props}
                                        autocompete="tel-national"
                                        placeholder={translate('Gate Phone')}
                                        leftIcon="Phone"
                                    />
                                )}
                            </Field>
                            <Field name="doorCode">
                                {props => (
                                    <Input
                                        {...props}
                                        autocompete="code"
                                        placeholder={translate('Door Code')}
                                        leftIcon="DoorCode"
                                    />
                                )}
                            </Field>
                        </Box>
                        <Box width={400} mx="auto">
                            <Flex py={2} justifyContent="center">
                                {error}
                            </Flex>
                            <Flex mt={5} justifyContent="space-between">
                                <NavigateButton navigate={-1} />
                                <NavigateButton navigate={1} type="submit" />
                            </Flex>
                        </Box>
                    </Form>
                )}
            </FForm>
        </Box>
    )
}
