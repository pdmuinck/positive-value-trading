const axios = require('axios')
const NodeCache = require('node-cache')

const ttlSeconds = 60 * 60 * 30

const tokenCache = new NodeCache({ stdTTL: ttlSeconds, checkperiod: ttlSeconds * 0.2, useClones: false })


const token = {}

async function getToken(book, bookmakers) {
    const token = tokenCache.get(book.toUpperCase())

    if(!token) {
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

        if(token) {
            tokenCache.set(book.toUpperCase(), token)
            return token
        } else {
            getToken(book, bookmakers)
        }
    } else {
        return token
    }
}

token.getToken = async (book, bookmakers) => {
    return getToken(book, bookmakers)
}

module.exports = token