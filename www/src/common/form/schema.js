import * as Yup from 'yup'

// Common
import { translate } from 'utils/langugae'

const MIN_PASSWORD_LENGTH = 6
const MIN_CODE_LENGTH = 4
const password = Yup.string()
    .min(
        MIN_PASSWORD_LENGTH,
        `${translate(
            'Password has to be longer than'
        )} ${MIN_PASSWORD_LENGTH} ${translate('characters')}!`
    )
    .required('Password is required!')

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

const schemas = values => {
    return {
        deviceName: Yup.string()
            // .typeError(translate('Device Name must be a number'))
            // .integer(translate('Device Name must be an integer number'))
            .required(translate('Device Name is required')),
        wifiName: Yup.string().required(translate('WIFI Name is required!')),
        password,
        passwords: Yup.array().of(password),
        house: Yup.string().nullable(),
        street: Yup.string().nullable(),
        apartment: Yup.string().required(translate('Apartment is required')),
        city: Yup.string().nullable(),
        doorCode: Yup.string().nullable(),
        code: Yup.string().required(translate('Code is required')),
        // name: Yup.string().matches(/^.+?\s+?.+?$/, translate('Full name is required')),
        name: Yup.string().required(translate('Name is required')),
        gatePhone: Yup.string().matches(phoneRegExp, {
            message: translate('Phone number is not valid'),
            excludeEmptyString: true,
        }),
        phone: Yup.string().matches(phoneRegExp, translate('Phone number is not valid')),
        email: Yup.string()
            .email(translate('E-mail is not valid!'))
            .required(translate('E-mail is required!')),
        currentPassword: password,
        newPassword: password.notOneOf(
            [values.currentPassword],
            translate('Passwords are not the same!')
        ),
        terms: Yup.bool().oneOf([true], translate('Please agree to the terms')),
    }
}

export const pickSchema = fields => values => {
    console.log('fields', fields)

    if (Array.isArray(fields)) {
        return Yup.array().of(pickSchema(fields[0])(values))
    } else {
        const o = {}
        Object.entries(fields).forEach(([key, value]) => {
            if (typeof value === 'object') {
                o[key] = Object.assign(pickSchema(value)(values))
            } else {
                const s = schemas(values)[key]
                if (s) {
                    o[key] = s
                }
            }
        })
        console.log('o', o)
        return Yup.object().shape(o)
    }
}
