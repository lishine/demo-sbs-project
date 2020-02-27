import React, { useState, useEffect } from 'react'
import { Field } from 'formik'

// Common
import { Flex, H3, H4, Button, SvgIcon, Box, Form } from 'styles/ss-components'
import { Input } from 'common/form/fields/Input'
import { FForm } from 'common/form/FForm'
import { usePathStore, usePathActions } from 'common/hooks/hooks'
import { translate } from 'utils/langugae'

// Local
import { path } from './_editUser'
import { path as pathUsers } from '../_users'
import { Quit } from 'svg/icons/Quit'
import { Loading, titleCase } from 'utils/utils'
import { Select } from 'common/form/fields/Select'

const Content = () => {
    const roles = usePathStore(pathUsers)('roles')
    const { values, error, err, loading, submitting } = usePathStore(path)([
        'values',
        'error',
        'err',
        'loading',
        'submitting',
    ])
    const { loadEditUser } = usePathActions(path)(['loadEditUser'])

    useEffect(() => {
        loadEditUser()
    }, [])

    if (err) {
        return (
            <Flex flex={1} alignItems="center" justifyContent="center">
                {err.message}
            </Flex>
        )
    }
    console.log('values', values)
    return (
        <Loading loading={loading}>
            <FForm
                path={path}
                initialValues={
                    loading
                        ? {}
                        : {
                              phone: '',
                              name: '',
                              role: '',
                          }
                }
            >
                {({ handleSubmit }) => (
                    <Form onSubmit={handleSubmit}>
                        <Box pt={3} display="grid" gridRowGap={2} w="200px" mx="auto">
                            <Field name="phone">
                                {props => (
                                    <Input
                                        {...props}
                                        direction="ltr"
                                        autocompete="tel-national"
                                        placeholder={translate('Phone')}
                                        leftIcon="Phone"
                                    />
                                )}
                            </Field>
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
                            <Field name="role">
                                {props => (
                                    <Select {...props} w="200px" mt={2}>
                                        <option value="">
                                            {translate('Please select')}
                                        </option>
                                        {roles.map(value => (
                                            <option key={value} value={value}>
                                                {titleCase(value)}
                                            </option>
                                        ))}
                                    </Select>
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
                            <Flex py={2} justifyContent="center">
                                {error}
                            </Flex>
                        </Box>
                    </Form>
                )}
            </FForm>
        </Loading>
    )
}

export const EditUser = ({ isNew, isEdit, isCreate }) => {
    const { query } = usePathStore('router')()

    const { isInitialized } = usePathStore(path)(['isInitialized'])

    const {
        setUserId,
        reset,
        setIsNew,
        setIsEdit,
        setIsCreate,
        setInitialized,
    } = usePathActions(path)([
        'setUserId',
        'reset',
        'setIsNew',
        'setIsEdit',
        'setIsCreate',
        'setInitialized',
    ])

    useEffect(() => {
        setIsNew(isNew)
        setIsEdit(isEdit)
        setIsCreate(isCreate)

        const { userId } = query
        setUserId(userId)

        setInitialized(true)
        return () => reset()
    }, [isNew, isEdit, isCreate, query])
    if (!isInitialized) {
        return null
    }

    return (
        <Flex width={800} mx="auto" flexDirection="column">
            <H4 fontSize={32} mx="auto" mb={2}>
                {isCreate && 'Create New User'}
                {isEdit && 'Edit User'}
            </H4>
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
            <Content />
        </Flex>
    )
}
