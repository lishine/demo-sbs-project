// node_modules
import React, { useState, useEffect } from 'react'
import get from 'lodash/fp/get'

// Common
import { Box, Form, Button, Flex, Span, H1, H2, H3, H4 } from 'styles/ss-components'
import { Field } from 'formik'
import { Input } from 'common/form/fields/Input'
import { FForm } from 'common/form/FForm'
import { usePathStore } from 'common/hooks/hooks'
import { translate } from 'utils/langugae'

// Local
import { path } from './_login'

export const DetailsForm = () => {
    const { submitting, error, mode } = usePathStore(path)([
        'submitting',
        'error',
        'mode',
    ])

    let initialValues
    if (mode === 'SignUp') {
        initialValues = { name: '', phone: '' }
    } else if (mode === 'SignIn') {
        initialValues = { phone: '' }
    } else if (mode === 'UpdatePhone') {
        initialValues = { phone: '' }
    }
    return (
        <>
            <FForm path={path} initialValues={initialValues}>
                {({ handleSubmit }) => (
                    <Form
                        onSubmit={handleSubmit}
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                    >
                        {mode === 'SignUp' && (
                            <Field name="name">
                                {props => (
                                    <Input
                                        w="200px"
                                        mt={2}
                                        {...props}
                                        autoComplete="name"
                                        placeholder={translate('Name')}
                                        leftIcon="Name"
                                    />
                                )}
                            </Field>
                        )}

                        <Field name="phone">
                            {props => (
                                <Input
                                    w="200px"
                                    mt={2}
                                    {...props}
                                    direction="ltr"
                                    autoComplete="tel-national"
                                    placeholder={translate('Phone')}
                                    leftIcon="Phone"
                                />
                            )}
                        </Field>

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
                    </Form>
                )}
            </FForm>
            <Flex py={2}>{error}</Flex>
        </>
    )
}
