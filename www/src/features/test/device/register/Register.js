import React, { useEffect } from 'react'
import { css } from '@emotion/core'
import styled from '@emotion/styled'
import get from 'lodash/fp/get'

// Common
import { Box, Form, Button, Flex } from 'styles/ss-components'
import { Field, FieldArray } from 'formik'
import { Input } from 'common/form/fields/Input'
import { FForm } from 'common/form/FForm'
import { Map } from 'utils/utils'
import { usePathStore, usePathActions } from 'common/hooks/hooks'
import { translate } from 'utils/langugae'

// Local
import { localPath } from './_register'

export const Register = () => {
    const submitting = usePathStore(localPath)('submitting')
    const error = usePathStore(localPath)('error')

    const wifiConnect = usePathActions(localPath)('wifiConnect')

    return (
        <Box width={600} mx="auto" flexDirection="column">
            <Flex my={5} fontSize={3} justifyContent="space-around">
                {translate('Device Register')}
            </Flex>
            <FForm
                path={localPath}
                initialValues={{
                    deviceName: '',
                    wifis: [{ wifiName: 'a1' }, { wifiName: 'a2' }],
                }}
            >
                {({ handleSubmit, values }) => (
                    <Form onSubmit={handleSubmit}>
                        <FieldArray name="wifis">
                            {({ insert, remove }) => {
                                const count = values.wifis.length
                                return (
                                    <>
                                        <Flex mb={5} justifyContent="space-between">
                                            <Flex
                                                flexDirection="column"
                                                alignItems="left"
                                            >
                                                <Box w="200px">
                                                    <Field name="deviceName">
                                                        {props => (
                                                            <Input
                                                                {...props}
                                                                placeholder={translate(
                                                                    'Device Name'
                                                                )}
                                                                autocompete="on"
                                                                leftIcon="Barcode"
                                                            />
                                                        )}
                                                    </Field>
                                                </Box>
                                            </Flex>
                                            <Button
                                                w="50px"
                                                mis={10}
                                                fontSize={35}
                                                className="btn btn-secondary"
                                                disabled={submitting}
                                                onClick={() =>
                                                    insert(count, {
                                                        wifiName: `a${count + 1}`,
                                                    })
                                                }
                                            >
                                                &#43;
                                            </Button>
                                            <Button
                                                w="50px"
                                                fontSize={35}
                                                className="btn btn-secondary"
                                                disabled={count === 0}
                                                onClick={() => remove(count - 1)}
                                            >
                                                &#8722;
                                            </Button>
                                        </Flex>
                                        <Map collection={values.wifis}>
                                            {(_, index) => (
                                                <Flex
                                                    key={index}
                                                    py={2}
                                                    justifyContent="space-between"
                                                >
                                                    <Box w="200px">
                                                        <Field
                                                            name={`wifis[${index}].wifiName`}
                                                        >
                                                            {props => (
                                                                <Input
                                                                    {...props}
                                                                    placeholder={translate(
                                                                        'WIFI name'
                                                                    )}
                                                                    autoComplete="name"
                                                                    leftIcon="Wifi"
                                                                />
                                                            )}
                                                        </Field>
                                                    </Box>
                                                    <Button
                                                        onClick={() =>
                                                            wifiConnect({
                                                                index,
                                                                values,
                                                                status: 'connected',
                                                            })
                                                        }
                                                        mis={6}
                                                        w="110px"
                                                        className="btn btn-primary"
                                                    >
                                                        {translate('Connected')}
                                                    </Button>
                                                    <Button
                                                        onClick={() =>
                                                            wifiConnect({
                                                                index,
                                                                values,
                                                                status:
                                                                    'unable to connect',
                                                            })
                                                        }
                                                        w="110px"
                                                        className="btn btn-primary"
                                                    >
                                                        {translate('Unable to connect')}
                                                    </Button>
                                                </Flex>
                                            )}
                                        </Map>

                                        <Flex
                                            mt={4}
                                            flexDirection="column"
                                            alignItems="center"
                                        >
                                            <Button
                                                width={1}
                                                type="submit"
                                                className="btn btn-primary"
                                                disabled={submitting}
                                                loading={submitting}
                                            >
                                                {translate('Submit')}
                                            </Button>
                                            {error && <Box py={2}>{error}</Box>}
                                        </Flex>
                                    </>
                                )
                            }}
                        </FieldArray>
                    </Form>
                )}
            </FForm>
        </Box>
    )
}
