const upsertDevices = /* GraphQL */ `
    mutation($objects: [device_insert_input!]!) {
        insert_device(
            objects: $objects
            on_conflict: {
                constraint: device_device_name_key
                update_columns: [
                    door_code
                    gate_phone
                    city
                    house
                    street
                    registered
                    public_key
                ]
            }
        ) {
            affected_rows
        }
    }
`

const upsertDevicesPre = /* GraphQL */ `
    mutation($objects: [device_pre_insert_input!]!) {
        insert_device_pre(
            objects: $objects
            on_conflict: {
                constraint: device_pre_device_name_key
                update_columns: [public_key]
            }
        ) {
            affected_rows
        }
    }
`

const data = [
    {
        deviceName: process.env.TEST_DEVICE_NAME,
        publicKey: process.env.TEST_DEVICE_PUBLIC_KEY,
        doorCode: '222',
        gatePhone: '222222',
        city: 'Tel Aviv',
        house: '22',
        street: 'Ben Gurion',
        registered: true,
        wifis: {
            data: [
                { name: 'test-wifi-1' },
                { name: 'test-wifi-2' },
                { name: 'test-wifi-3' },
            ],
            on_conflict: { constraint: 'wifi_name_key', update_columns: ['name'] },
        },
    },
    // {
    //     device_name: process.env.DEVICE_ID_WEB_TEST,
    //     door_code: '111',
    //     gate_phone: '111111',
    //     city: 'Jerusalem',
    //     house: '11',
    //     street: 'Jabotinsky',
    //     registered: true,
    //     wifis: {
    //         data: [{ name: 'w-wifi1' }, { name: 'w-wifi2' }],
    //         on_conflict: { constraint: 'wifi_name_key', update_columns: ['name'] },
    //     },
    // },
]

export const devices = async ({ queryDb }) => {
    let affectedRows1 = await queryDb(upsertDevices, { objects: data }).then(
        d => d.insertDevice.affectedRows
    )
    console.log('device, affectedRows', affectedRows1)

    let affectedRows2 = await queryDb(upsertDevicesPre, {
        objects: [{ deviceName: data[0].deviceName, publicKey: data[0].publicKey }],
    }).then(d => d.insertDevicePre.affectedRows)
    console.log('device pre, affectedRows', affectedRows2)

    return { devices: affectedRows1, devicesPre: affectedRows2 }
}
