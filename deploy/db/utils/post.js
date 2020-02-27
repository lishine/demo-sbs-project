const fetch = require('isomorphic-unfetch')

module.exports = (url, json, headers) =>
    fetch(url, {
        method: 'POST',
        headers: Object.assign({ 'Content-Type': 'application/json' }, headers),
        body: JSON.stringify(json || {}),
    })
        .then(async res => {
            if (res.ok) {
                console.log('res.ok')
                return res
            } else {
                let data
                try {
                    data = await res.json()
                } catch (error) {}
                const err = new Error(`Request rejected with status ${res.status}`)
                err.response = { res, data, status: res.status }
                throw err
            }
        })
        .then(response => response.json())
