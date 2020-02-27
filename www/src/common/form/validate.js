function getErrorsFromValidationError(validationError) {
    const FIRST_ERROR = 0
    return validationError.inner.reduce((errors, error) => {
        return {
            ...errors,
            [error.path]: error.errors[FIRST_ERROR],
        }
    }, {})
}

export function validate(getValidationSchema) {
    return values => {
        const validationSchema = getValidationSchema(values)
        try {
            validationSchema.validateSync(values, { abortEarly: false, recursive: true })
            return {}
        } catch (error) {
            console.log('error', error)
            return getErrorsFromValidationError(error)
        }
    }
}
