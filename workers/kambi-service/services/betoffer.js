const axios = require('axios')
const bookmakers = require('../resources/bookmakers.json')
const betofferTypes = require('../resources/betoffer-type.json')

const betoffer = {}

betoffer.getBetOffersByBookMakerAndEventIdandBetOfferType = async (book, eventId, type) => {

    const bookmakerInfo = Object.entries(bookmakers).filter(pair => pair[0] === book.toUpperCase()).map(pair => pair[1])[0]

    if(!bookmakerInfo) throw new Error('Book not found: ' + book)

    let url = 'https://{host}/offering/v2018/{book}'.replace('{host}', bookmakerInfo.host).replace('{book}', bookmakerInfo.code)  + '/betoffer/event/' + eventId + '.json'

    if(type) {
        url += '?type=' + betofferTypes[type]
    }

    return await axios.get(url).then(response => response.data).catch(error => console.log(error))

}


module.exports = betoffer