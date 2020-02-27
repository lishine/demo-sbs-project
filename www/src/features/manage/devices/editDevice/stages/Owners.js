import React, { useState, useEffect } from 'react'
import get from 'lodash/fp/get'

// Common
import { Box, Form, Button, Flex, Span, H4, Grid } from 'styles/ss-components'
import { Field, FieldArray } from 'formik'
import { Input } from 'common/form/fields/Input'
import { Checkbox } from 'common/form/fields/Checkbox'
import { FForm } from 'common/form/FForm'
import { Map, Loading } from 'utils/utils'
import { usePathStore } from 'common/hooks/hooks'
import { translate } from 'utils/langugae'

// Local
import { NavigateButton, ExitButton } from './common/common'
import { path as pathEditDevice } from '../_editDevice'

export const Owners = () => {
    const path = `${pathEditDevice}.stages.owners`
    const { error, submitting } = usePathStore(path)(['error', 'submitting'])

    return (
        <>
            <H4 fontSize={25} mb={2} mt={1} mx="auto">
                <strong>{translate('Owners')}</strong>
            </H4>

            <FForm
                path={path}
                initialValues={{
                    // isUserOwner: true,
                    owners: [],
                }}
                fields={{
                    // isUserOwner: true,
                    owners: [{ name: '', phone: '' }],
                }}
            >
                {({ handleSubmit, values }) => (
                    <Form onSubmit={handleSubmit}>
                        <Box>
                            <Flex justifyContent="space-between">
                                <Grid gridAutoFlow="row" gridRowGap={1}>
                                    <NavigateButton navigate={-1} />
                                    <ExitButton />
                                </Grid>
                                <NavigateButton type="submit">
                                    {translate('Finish')}
                                </NavigateButton>
                            </Flex>
                            <Flex py={2} justifyContent="center">
                                {error}
                            </Flex>
                        </Box>
                        <FieldArray name="owners">
                            {({ insert, remove }) => {
                                const count = values.owners.length
                                return (
                                    <Box>
                                        <Flex mb={2} justifyContent="flex-end">
                                            <Button
                                                w="50px"
                                                mis={10}
                                                fontSize={35}
                                                className="btn btn-secondary"
                                                onClick={() =>
                                                    insert(count, { name: '', phone: '' })
                                                }
                                            >
                                                &#43;
                                            </Button>
                                        </Flex>
                                        <Box>
                                            <Map collection={values.owners}>
                                                {(_, index) => {
                                                    const readOnly =
                                                        values.owners[index].readOnly
                                                    return (
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
                                                                    name={`owners[${index}].name`}
                                                                >
                                                                    {props => (
                                                                        <Input
                                                                            w={200}
                                                                            {...props}
                                                                            disabled={
                                                                                readOnly
                                                                            }
                                                                            autoComplete="name"
                                                                            placeholder={translate(
                                                                                'Name'
                                                                            )}
                                                                            leftIcon="Name"
                                                                        />
                                                                    )}
                                                                </Field>

                                                                <Field
                                                                    name={`owners[${index}].phone`}
                                                                >
                                                                    {props => (
                                                                        <Input
                                                                            w={200}
                                                                            {...props}
                                                                            disabled={
                                                                                readOnly
                                                                            }
                                                                            autoComplete="phone"
                                                                            placeholder={translate(
                                                                                'Phone'
                                                                            )}
                                                                            leftIcon="Phone"
                                                                        />
                                                                    )}
                                                                </Field>
                                                            </Grid>
                                                            <Button
                                                                w="50px"
                                                                fontSize={35}
                                                                className="btn btn-secondary"
                                                                onClick={() =>
                                                                    remove(index)
                                                                }
                                                            >
                                                                &#8722;
                                                            </Button>
                                                        </Flex>
                                                    )
                                                }}
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
