const axios = require("axios")

function getSportRadarEventUrl(id) {
    return "https://lsc.fn.sportradar.com/sportradar/en/Europe:Berlin/gismo/match_info/" + id
}

class SportRadarMatch {
    constructor(sportRadarId, sportRadarEventUrl, participants, response) {
        this.sportRadarId = sportRadarId
        this.sportRadarEventUrl = sportRadarEventUrl;
        this.participants = participants
        this.response = response
    }
}

async function getSportRadarMatch(eventId) {
    const url = getSportRadarEventUrl(eventId)
    return axios.get(url).then(response => {
        if(response.data.doc[0].data.match) {
            const participants = [response.data.doc[0].data.match.teams.home._id, response.data.doc[0].data.match.teams.away._id]
            return new SportRadarMatch(eventId, url, participants, response.data.doc[0].data.match)
        }
    })
}

exports.getSportRadarEventUrl = getSportRadarEventUrl
exports.getSportRadarMatch = getSportRadarMatch
exports.SportRadarMatch = SportRadarMatch