const axios = require('axios')

const betoffer = {}

betoffer.getByEventId = async (eventId) => {

    let url = 'https://lmt.fn.sportradar.com/common/en/Etc:UTC/gismo/match_bookmakerodds/' + eventId

    return await axios.get(url).then(response => response.data).catch(error => console.log(error))

}


module.exports = betoffer