export const BetType = {
    "1X2": "1X2",
    "1X2_H1": "1X2_H1",
    "1X2_H2": "1X2_H2",
    "DOUBLE_CHANCE": "DOUBLE_CHANCE",
    "DOUBLE_CHANCE_H1": "DOUBLE_CHANCE_H1",
    "DOUBLE_CHANCE_H2": "DOUBLE_CHANCE_H2"
}

Object.freeze(BetType)

export class BookmakerInfo {
    constructor(provider, bookmaker, leagueId, eventId, leagueUrl, eventUrl, headers, requestBody, httpMethod) {
        this.provider = provider
        this.bookmaker = bookmaker
        this.leagueId = leagueId
        this.eventId = eventId
        this.leagueUrl = leagueUrl
        this.eventUrl = eventUrl
        this.headers = headers
        this.requestBody = requestBody
        this.httpMethod = httpMethod
    }
}

export const Bookmaker = {
    "GOLDEN_PALACE": "GOLDEN_PALACE"
}

Object.freeze(Bookmaker)

export const Provider = {
    "ALTENAR": "ALTENAR"
}

Object.freeze(Provider)