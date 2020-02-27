export const throwIf = (fn, ...args) => result => {
    if (typeof fn === 'function') {
        if (fn(result)) {
            console.log('throwing because of result')
            return throwError(...args)()
        }
        return result
    } else if (fn) {
        console.log('throwing because of condition')
        throwError(...args)()
    }
}

export const throwError = (status, message, code, errorType) => error => {
    if (!error) {
        error = new Error(message || 'Unknown Error')
    }
    error.mes = message
    error.originalMessage = error.message
    error.status = status
    error.code = error.code || code
    error.errorType = error.errorType || errorType
    throw error
}
