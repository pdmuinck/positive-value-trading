const axios = require('axios')

const betoffer = {}

betoffer.getByEventId = async (eventId) => {

    // https://lsc.fn.sportradar.com/sportradar/en/Europe:Berlin/gismo/odds_match/33210764

	/*replayServer     = "replaymq.betradar.com:5671"
	stagingServer    = "stgmq.betradar.com:5671"
	productionServer = "mq.betradar.com:5671"
	queueExchange    = "unifiedfeed"
    bindingKeyAll    = "#"
    */

    // alxlhj123%&4+###klmfkjhgnbv4rf94ds59hj!

    let url = 'https://lmt.fn.sportradar.com/common/en/Etc:UTC/gismo/match_bookmakerodds/' + eventId

    return await axios.get(url).then(response => response.data).catch(error => console.log(error))

}


module.exports = betoffer