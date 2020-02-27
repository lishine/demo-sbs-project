import React, { useState, useEffect } from 'react'
import get from 'lodash/fp/get'

// Common
import { Box, Form, Button, Flex, Span, H4 } from 'styles/ss-components'
import { Field } from 'formik'
import { Input } from 'common/form/fields/Input'
import { FForm } from 'common/form/FForm'
import { Map, Loading } from 'utils/utils'
import { usePathStore } from 'common/hooks/hooks'
import { translate } from 'utils/langugae'

// Local
import { NavigateButton } from './common/common'
import { path as pathEditDevice } from '../_editDevice'

export const Line = ({ path, name, index }) => {
    const { submitting, error } = usePathStore(`${path}.forms[${index}]`)([
        'submitting',
        'error',
    ])
    return (
        <FForm index={index} path={path} initialValues={{ password: '' }}>
            {({ handleSubmit }) => (
                <Form onSubmit={handleSubmit}>
                    <Flex py={2} justifyContent="space-between" alignItems="center">
                        <Span>{name}</Span>
                        <input
                            type="text"
                            name="wifi"
                            value={name}
                            autoComplete="wifi name"
                            readOnly
                            style={{ display: 'none' }}
                        />
                        <Box w="200px">
                            <Field name="password">
                                {props => (
                                    <Input
                                        {...props}
                                        placeholder={translate('Password')}
                                        autoComplete="new-password"
                                        leftIcon="Lock"
                                    />
                                )}
                            </Field>
                        </Box>
                        <Box width={200}>{error}</Box>
                        <Button
                            w="100px"
                            className="btn btn-primary"
                            type="submit"
                            disabled={submitting}
                            loading={submitting}
                        >
                            {translate('Connect')}
                        </Button>
                    </Flex>
                </Form>
            )}
        </FForm>
    )
}

export const Wifi = () => {
    const path = `${pathEditDevice}.stages.wifi`
    const wifis = usePathStore(path)('wifis')

    return (
        <>
            <H4 mb={2} mt={1} mx="auto">
                {translate('Connecting WIFI')}
            </H4>
            {wifis.length === 0 ? (
                <Flex justifyContent="center">{translate('NO WIFI')}</Flex>
            ) : (
                <Map collection={wifis}>
                    <Line path={path} />
                </Map>
            )}
            <Flex mt={5} justifyContent="space-between">
                <NavigateButton navigate={-1} />
                <NavigateButton navigate={1} />
            </Flex>
        </>
    )
}
