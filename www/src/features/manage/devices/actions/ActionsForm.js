import React, { useState, useEffect, useMemo } from 'react'
import { css } from '@emotion/core'
import get from 'lodash/fp/get'
import isEmpty from 'lodash/isEmpty'
import upperFirst from 'lodash/upperFirst'
import { Field } from 'formik'

// Common
import { Flex, H3, Box, Span, Button, SvgIcon, Form, Grid } from 'styles/ss-components'
import { Input } from 'common/form/fields/Input'
import { translate } from 'utils/langugae'

// Local
import { path } from './_actions'
import { Map, mapToObject, titleCase } from 'utils/utils'
import { FForm } from 'common/form/FForm'
import { usePathActions, usePathStore } from 'common/hooks/hooks'

export const Error = ({ error }) => {
    let content
    if (typeof error === 'string') {
        content = error
    } else {
        const entries = Object.entries(error)
        if (entries.length === 1) {
            content = entries[0][1]
        }
    }
    return (
        <Box pt={2}>
            {content || (
                <>
                    <Flex>
                        <Flex w={160} justifyContent="center">
                            {translate('Device Id')}
                        </Flex>
                        <Flex justifyContent="center">{translate('Result')}</Flex>
                    </Flex>
                    <Map collection={Object.entries(error)}>
                        {([deviceId, message]) => (
                            <Flex>
                                <Flex w={160} justifyContent="center">
                                    {deviceId}
                                </Flex>
                                <Span>{message}</Span>
                            </Flex>
                        )}
                    </Map>
                </>
            )}
        </Box>
    )
}
export const ActionsForm = () => {
    const { error, selectedAction, submitting } = usePathStore(path)([
        'selectedAction',
        'error',
        'submitting',
    ])
    const { submit } = usePathActions(path)(['submit'])
    const { setValues } = usePathActions(path)(['setValues'])
    const { params, initialValues } = useMemo(() => {
        console.log('selectedAction', selectedAction)
        const params = selectedAction.params || []
        const initialValues = mapToObject(({ name }) => ({ [name]: '' }))(params)
        return { params, initialValues }
    }, [selectedAction])

    useEffect(() => {
        if (isEmpty(params)) {
            submit()
            console.log('submitting', submitting)
        }
        return () => {
            setValues({})
        }
    }, [params])
    return (
        <FForm path={path} initialValues={initialValues}>
            {({ handleSubmit }) => (
                <Form
                    onSubmit={handleSubmit}
                    display="flex"
                    px={1}
                    pb={3}
                    pt={2}
                    h={1}
                    w={1}
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                >
                    {!error ? (
                        <>
                            <Grid py={2} gridAutoFlow="row" gridRowGap={2}>
                                <Map collection={params}>
                                    {param => (
                                        <Field name={param.name}>
                                            {props => (
                                                <Input
                                                    w={200}
                                                    {...props}
                                                    placeholder={
                                                        param.placeholder ||
                                                        titleCase(param.name)
                                                    }
                                                    leftIcon={param.leftIcon}
                                                />
                                            )}
                                        </Field>
                                    )}
                                </Map>
                            </Grid>
                            <Button
                                type="submit"
                                loading={submitting}
                                disabled={submitting}
                                mt={3}
                                w={150}
                                className="btn btn-primary"
                            >
                                {translate('Send')}
                            </Button>
                        </>
                    ) : (
                        <Error error={error} />
                    )}
                </Form>
            )}
        </FForm>
    )
}
