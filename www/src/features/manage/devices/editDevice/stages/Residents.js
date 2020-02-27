import React, { useState, useEffect } from 'react'
import get from 'lodash/fp/get'

// Common
import { Box, Form, Button, Flex, Span, H4, Grid } from 'styles/ss-components'
import { Field, FieldArray } from 'formik'
import { Input } from 'common/form/fields/Input'
import { FForm } from 'common/form/FForm'
import { Map, Loading } from 'utils/utils'
import { usePathStore } from 'common/hooks/hooks'
import { translate } from 'utils/langugae'

// Local
import { NavigateButton } from './common/common'
import { path as pathEditDevice } from '../_editDevice'

export const Residents = () => {
    const path = `${pathEditDevice}.stages.residents`
    const { error, submitting } = usePathStore(path)(['error', 'submitting'])

    return (
        <>
            <H4 fontSize={25} mb={2} mt={1} mx="auto">
                <strong>{translate('Residents')}</strong>
            </H4>

            <FForm
                path={path}
                initialValues={{
                    residents: [],
                }}
                fields={{
                    residents: [{ name: '', apartment: '', phone: '' }],
                }}
            >
                {({ handleSubmit, values }) => (
                    <Form onSubmit={handleSubmit}>
                        <Box>
                            <Flex justifyContent="space-between">
                                <NavigateButton navigate={-1} />
                                <NavigateButton navigate={1} type="submit" />
                            </Flex>
                            <Flex py={2} justifyContent="center">
                                {error}
                            </Flex>
                        </Box>
                        <FieldArray name="residents">
                            {({ insert, remove }) => {
                                const count = values.residents.length
                                return (
                                    <Box>
                                        <Flex mt={1} mb={2} justifyContent="flex-end">
                                            <Button
                                                w="50px"
                                                mis={10}
                                                fontSize={35}
                                                className="btn btn-secondary"
                                                onClick={() =>
                                                    insert(count, {
                                                        name: '',
                                                        apartment: '',
                                                        phone: '',
                                                    })
                                                }
                                            >
                                                &#43;
                                            </Button>
                                        </Flex>
                                        <Box>
                                            <Map collection={values.residents}>
                                                {(_, index) => (
                                                    <Flex
                                                        alignItems="center"
                                                        justifyContent="space-between"
                                                    >
                                                        <Grid
                                                            py={2}
                                                            gridAutoFlow="column"
                                                            gridColumnGap={3}
                                                        >
                                                            <Field
                                                                name={`residents[${index}].name`}
                                                            >
                                                                {props => (
                                                                    <Input
                                                                        w={200}
                                                                        {...props}
                                                                        autoComplete="name"
                                                                        placeholder={translate(
                                                                            'Name'
                                                                        )}
                                                                        leftIcon="Name"
                                                                    />
                                                                )}
                                                            </Field>

                                                            <Field
                                                                name={`residents[${index}].apartment`}
                                                            >
                                                                {props => (
                                                                    <Input
                                                                        w={200}
                                                                        {...props}
                                                                        autoComplete="apartment"
                                                                        leftIcon="Apartment"
                                                                        placeholder={translate(
                                                                            'Apartment'
                                                                        )}
                                                                    />
                                                                )}
                                                            </Field>

                                                            <Field
                                                                name={`residents[${index}].phone`}
                                                            >
                                                                {props => (
                                                                    <Input
                                                                        w={200}
                                                                        {...props}
                                                                        autoComplete="phone"
                                                                        leftIcon="Phone"
                                                                        placeholder={translate(
                                                                            'Phone'
                                                                        )}
                                                                    />
                                                                )}
                                                            </Field>
                                                        </Grid>
                                                        <Button
                                                            w="50px"
                                                            fontSize={35}
                                                            className="btn btn-secondary"
                                                            onClick={() => remove(index)}
                                                        >
                                                            &#8722;
                                                        </Button>
                                                    </Flex>
                                                )}
                                            </Map>
                                        </Box>
                                    </Box>
                                )
                            }}
                        </FieldArray>
                    </Form>
                )}
            </FForm>
        </>
    )
}
