import isEmpty from 'lodash/isEmpty'

// Common
import { throwError, throwIf } from 'utils/error'
import { find, queryDb as _queryDb, post } from 'utils/utils'
import { logMeIn } from './common/logMeIn'
import { sendSms } from '../../utils/sendSms'

const queryDb = _queryDb({ role: 'auth' })

const createUser = props => {
    return queryDb(
        /* GraphQL */ `
            mutation newUser($name: String!, $phone: String!, $code: String!) {
                insert_user(objects: [{ name: $name, phone: $phone, code: $code }]) {
                    returning {
                        id
                    }
                }
            }
        `,
        props
    )
        .then(d => d.insertUser.returning[0])
        .catch(err => {
            const { message } = err
            if (message.includes('duplicate') && message.includes('phone')) {
                throwError(400, 'User already exists')(err)
            } else {
                throw err
            }
        })
}

const getUserByPhone = props =>
    queryDb(
        /* GraphQL */ `
            query getUserByPhone($phone: String!) {
                user(where: { phone: { _eq: $phone } }) {
                    id
                    code
                    confirmed
                }
            }
        `,
        props
    ).then(d => d.user[0] || {})

const getUser = props =>
    queryDb(
        /* GraphQL */ `
            query getUser($id: Int!) {
                user(where: { id: { _eq: $id } }) {
                    id
                    code
                    confirmed
                }
            }
        `,
        props
    ).then(d => d.user[0] || {})

const updateUserConfirmed = props => {
    return queryDb(
        /* GraphQL */ `
            mutation updateUserConfirmed($id: Int!) {
                update_user(where: { id: { _eq: $id } }, _set: { confirmed: true }) {
                    affected_rows
                }
            }
        `,
        props
    ).then(throwIf(d => d.updateUser.affectedRows !== 1, 400, 'No user'))
}

const updateUserPhone = props => {
    return queryDb(
        /* GraphQL */ `
            mutation updateUserConfirmed($id: Int!, $phone: String!) {
                update_user(where: { id: { _eq: $id } }, _set: { phone: $phone }) {
                    affected_rows
                }
            }
        `,
        props
    )
        .then(throwIf(d => d.updateUser.affectedRows !== 1, 400, 'No user'))
        .catch(err => {
            const { message } = err
            if (message.includes('duplicate') && message.includes('phone')) {
                throwError(400, 'Phone already registered')(err)
            } else {
                throw err
            }
        })
}

const updateUserCode = props => {
    return queryDb(
        /* GraphQL */ `
            mutation updateUserConfirmed($id: Int!, $code: String!) {
                update_user(where: { id: { _eq: $id } }, _set: { code: $code }) {
                    affected_rows
                }
            }
        `,
        props
    ).then(throwIf(d => d.updateUser.affectedRows !== 1, 400, 'No user'))
}

const updateUserByPhone = props => {
    return queryDb(
        /* GraphQL */ `
            mutation updateUserByPhone($phone: String!, $name: String!, $code: String!) {
                update_user(
                    where: { phone: { _eq: $phone } }
                    _set: { code: $code, name: $name }
                ) {
                    affected_rows
                }
            }
        `,
        props
    ).then(throwIf(d => d.updateUser.affectedRows !== 1, 400, 'No user'))
}

const updateUserByPhoneWithCode = props => {
    return queryDb(
        /* GraphQL */ `
            mutation updateUserByPhone($phone: String!, $code: String!) {
                update_user(where: { phone: { _eq: $phone } }, _set: { code: $code }) {
                    affected_rows
                }
            }
        `,
        props
    ).then(throwIf(d => d.updateUser.affectedRows !== 1, 400, 'No user. Go to sign-up'))
}

const generateCode = () => {
    const code = `${Math.floor(Math.random() * 10)}${Math.floor(
        Math.random() * 10
    )}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}`
    console.log('* code', code)
    return code
}

const sendCode = async ({ phone, code }) => {
    try {
        await sendSms({ body: { phone, code } })
    } catch (error) {
        console.log('error sending sms', error)
    }
}

export async function login({ body, res }) {
    console.log('login body', body)
    const { mode, values, stage, resendCode, userId } = body
    let { name, phone, code: userCode } = values || {}

    if (!(stage === 'Details' || stage === 'Code')) {
        throwError(400, `stage ${stage} not allowed`)()
    }
    if (!(mode === 'SignUp' || mode === 'SignIn' || mode === 'UpdatePhone')) {
        throwError(400, `mode ${mode} not allowed`)()
    }

    let user
    let generatedCode
    if (resendCode) {
        console.log('* resending code')
        throwIf(!phone, 400, 'No phone')()
        phone = phone.trim()
        generatedCode = generateCode()
        user = await updateUserByPhoneWithCode({ phone, code: generatedCode })
        await sendCode({ phone, code: generatedCode })
    } else if (stage === 'Details') {
        console.log('* stage details')

        if (mode === 'SignUp') {
            throwIf(!name || !phone, 400, 'No name or phone')()
            name = name.trim()

            phone = phone.trim()
            user = await getUserByPhone({ phone }).then(
                throwIf(u => u.confirmed, 400, 'User exists. Please sign-in')
            )

            generatedCode = generateCode()
            await sendCode({ phone, code: generatedCode })

            if (isEmpty(user)) {
                console.log('creating user')
                user = await createUser({ name, phone, code: generatedCode })
            } else {
                console.log('user already exists but not confirmed yet')
                user = await updateUserByPhone({ phone, name, code: generatedCode })
            }
        } else if (mode === 'SignIn') {
            throwIf(!phone, 400, 'No phone')()
            phone = phone.trim()

            generatedCode = generateCode()
            user = await updateUserByPhoneWithCode({ phone, code: generatedCode })
            await sendCode({ phone, code: generatedCode })
        } else if (mode === 'UpdatePhone') {
            throwIf(!userId, 400, 'No userId')()
            generatedCode = generateCode()
            user = await updateUserCode({
                id: userId,
                code: generatedCode,
            })
            await sendCode({ phone, code: generatedCode })
        }
    } else if (stage === 'Code') {
        console.log('* stage Code')
        throwIf(!userCode || !phone, 400, 'No code or phone')()
        phone = phone.trim()
        userCode = userCode.trim()

        if (mode === 'SignIn') {
            user = await getUserByPhone({ phone })
                .then(throwIf(isEmpty, 400, 'User Not found'))
                .then(throwIf(u => u.code !== userCode, 400, 'Wrong code'))
            await logMeIn(user.id, res)
        } else if (mode === 'SignUp') {
            user = await getUserByPhone({ phone })
                .then(throwIf(isEmpty, 400, 'User Not found'))
                .then(throwIf(u => u.code !== userCode, 400, 'Wrong code'))
            await updateUserConfirmed({ id: user.id })
            await logMeIn(user.id, res)
        } else if (mode === 'UpdatePhone') {
            throwIf(!userId, 400, 'No userId')()
            user = await getUser({ id: userId })
                .then(throwIf(isEmpty, 400, 'User Not found'))
                .then(throwIf(u => u.code !== userCode, 400, 'Wrong code'))
            await updateUserPhone({ id: userId, phone })
        }
    }

    /// /// REMOVE CODE - TESTING
    return { user, code: generatedCode }
}
