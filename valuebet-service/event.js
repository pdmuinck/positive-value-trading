class Event {
    constructor(sportRadarId, sportRadarEventUrl, bookmakerInfo, sportRadarMatch, betOffers) {
        this.sportRadarId = sportRadarId
        this.sportRadarEventUrl = sportRadarEventUrl
        this.sportRadarMatch = sportRadarMatch
        this.bookmakerInfo = bookmakerInfo
        this.betOffers = betOffers
    }
}

exports.Event = Event