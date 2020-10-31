const axios = require('axios')

const token = {}

token.getToken = async (book, bookmakers) => {
    const requests = []
    
    const bookmaker = bookmakers[book.toUpperCase()]
    let apiV2 = false
    if(bookmaker.tokenUrl.includes('v2')) apiV2 = true

    if(apiV2) {
        requests.push(axios.get(bookmaker.tokenUrl).then(res => res.data.token).catch(error => null))
    } else {
        requests.push(axios.get(bookmaker.tokenUrl).then(res => res.data.split('ApiAccessToken = \'')[1].replace('\'', '')).catch(error => null))
    }

    let token

    await Promise.all(requests).then((values) => {
        token = values[0]
    })

    return token
}

module.exports = token