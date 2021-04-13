import axios from "axios";

export function getSportRadarEventUrl(id: number): string {
    return "https://lsc.fn.sportradar.com/sportradar/en/Europe:Berlin/gismo/match_info/" + id
}

export function getSportRadarMatch(eventId: number): Promise<SportRadarMatch> {
    const url = getSportRadarEventUrl(eventId)
    return axios.get(url).then(response => {
        if(response.data.doc[0].data.match) {
            const participants = [response.data.doc[0].data.match.teams.home._id, response.data.doc[0].data.match.teams.away._id]
            return new SportRadarMatch(eventId, url, participants)
        }
    })
}

export class SportRadarMatch {
    private readonly _sportRadarId
    private readonly _sportRadarEventUrl
    private readonly _participants

    constructor(sportRadarId, sportRadarEventUrl, participants) {
        this._sportRadarId = sportRadarId;
        this._sportRadarEventUrl = sportRadarEventUrl;
        this._participants = participants;
    }

    get sportRadarId() {
        return this._sportRadarId;
    }

    get sportRadarEventUrl() {
        return this._sportRadarEventUrl;
    }

    get participants() {
        return this._participants;
    }
}