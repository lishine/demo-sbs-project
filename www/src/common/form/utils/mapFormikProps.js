// Node - modules
import React from 'react'
import { getIn } from 'formik'

// Common
import { boxCss } from 'styles/ss-utils'

export const MapFormikProps = boxCss.toClassName(
    ({ field: { value, ...field }, form, children, className, ...props }) => {
        const { name } = field

        const touched = getIn(form.touched, name)
        const error = form.errors[name]

        const { disabled } = props
        let status = 'normal'
        if (touched && error && !disabled) {
            status = 'error'
        } else if (touched && !error && !disabled) {
            status = 'valid'
        }
        return (
            <div className={className}>
                {children({
                    status,
                    error,
                    field: {
                        ...props,
                        value: value || '', // Because of warning - changing controlled input from uncontrolled
                        ...field,
                    },
                })}
            </div>
        )
    }
)
