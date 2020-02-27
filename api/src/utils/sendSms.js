import Nexmo from 'nexmo'

export const sendSms = async ({ body }) => {
    console.log('SMS body', body)
    const { code } = body
    let { phone } = body

    if (phone.length < 7) {
        console.log('ERR phone number shorter than 7')
        return
    }

    console.log('sending sms')
    console.log('{ phone, code }', { phone, code })

    if (phone.charAt(0) === '0') {
        phone = phone.slice(1)
        console.log('slicing 0')
    }
    let PhoneNumber
    if (phone.charAt(0) === '+') {
        PhoneNumber = phone
    } else {
        PhoneNumber = `+972${phone}`
    }
    console.log('PhoneNumber:', PhoneNumber)

    const nexmo = new Nexmo({
        apiKey: process.env.NEXMO_API_KEY,
        apiSecret: process.env.NEXMO_API_SECRET,
    })

    const from = 'demo2'
    const to = PhoneNumber
    const text = `You code is ${code}`
    nexmo.message.sendSms(from, to, text)
    return {}
}
