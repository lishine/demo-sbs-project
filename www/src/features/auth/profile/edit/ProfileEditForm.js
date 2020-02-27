// node_modules
import React, { useState, useEffect } from 'react'
import get from 'lodash/fp/get'

// Common
import { NavLink, Box, Form, Button, Flex, Span, H4, SvgIcon } from 'styles/ss-components'
import { Field } from 'formik'
import { Input } from 'common/form/fields/Input'
import { FForm } from 'common/form/FForm'
import { GlobalModalWrap } from 'common/modal/GlobalModalWrap'
import { usePathStore } from 'common/hooks/hooks'
import { translate } from 'utils/langugae'

// Local
import { path } from './_editProfile'

export const Content = ({ initialValues }) => {
    const { submitting, error } = usePathStore(path)(['submitting', 'error'])

    return (
        <Box display="grid" h={1}>
            <H4 mb={2} mt={4} placeSelf="center" display="flex" justifyContent="center">
                {translate('Profile Edit')}
            </H4>
            <FForm path={path} initialValues={initialValues} reset>
                {({ handleSubmit }) => (
                    <Form
                        onSubmit={handleSubmit}
                        display="grid"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <Field name="name">
                            {props => (
                                <Input
                                    w="200px"
                                    mt={2}
                                    {...props}
                                    autoComplete="name"
                                    placeholder={translate('Name')}
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
                        <Flex py={2}>{error}</Flex>
                    </Form>
                )}
            </FForm>
        </Box>
    )
}

export const ProfileEditForm = props => (
    <GlobalModalWrap bg="grey" width={350} height={270}>
        <Content {...props} />
    </GlobalModalWrap>
)
