import React, { useState, useEffect } from 'react'
import get from 'lodash/fp/get'

// Common
import { Box, Form, Flex, H1, H2, H3, H4, SvgIcon } from 'styles/ss-components'
import { Field } from 'formik'
import { Input } from 'common/form/fields/Input'
import { FForm } from 'common/form/FForm'
import { usePathStore } from 'common/hooks/hooks'
import { translate } from 'utils/langugae'

// Local
import { NavigateButton, ExitButton } from './common/common'
import { path as pathEditDevice } from '../_editDevice'

export const DeviceName = () => {
    const path = `${pathEditDevice}.stages.deviceName`
    const { error, submitting } = usePathStore(path)(['error', 'submitting'])
    const deviceName = usePathStore(pathEditDevice)('deviceName')
    console.log('------------deviceName', deviceName)
    return (
        <>
            <H4 mb={2} mt={1} mx="auto">
                {translate('Entering device name')}
            </H4>
            <FForm path={path} initialValues={{ deviceName }}>
                {({ handleSubmit }) => (
                    <Form onSubmit={handleSubmit}>
                        <Flex
                            py={2}
                            flexDirection="column"
                            justifyContent="center"
                            alignItems="center"
                        >
                            <Box w="200px">
                                <Field name="deviceName">
                                    {props => (
                                        <Input
                                            {...props}
                                            autocompete="on"
                                            placeholder={translate('Device Name')}
                                            leftIcon="Barcode"
                                        />
                                    )}
                                </Field>
                            </Box>
                            <Flex py={2}>{error}</Flex>
                        </Flex>
                        <Flex justifyContent="space-between">
                            <ExitButton />
                            <NavigateButton
                                type="submit"
                                navigate={1}
                                disabled={submitting}
                                loading={submitting}
                            />
                        </Flex>
                    </Form>
                )}
            </FForm>
        </>
    )
}
