import { decode, encode } from 'jwt-simple'
import { throwError } from 'utils/error'

export const createAccessToken = data =>
    encode(
        Object.assign({}, data, {
            expireIn: +process.env.ACCESS_TOKEN_EXPIRE_IN,
            timestamp: new Date().getTime(),
        }),
        process.env.ACCESS_TOKEN_SECRET
    )

export const createEmailToken = data =>
    encode(
        Object.assign({}, data, {
            expireIn: +process.env.EMAIL_TOKEN_EXPIRE_IN,
            timestamp: new Date().getTime(),
        }),
        process.env.EMAIL_TOKEN_SECRET
    )

export const decodeToken = (token, secret) => {
    let decoded
    try {
        decoded = decode(
            token,
            secret === 'access'
                ? process.env.ACCESS_TOKEN_SECRET
                : process.env.EMAIL_TOKEN_SECRET
        )
    } catch (error) {
        throwError(400, 'token not valid')(error)
    }
    return decoded
}
