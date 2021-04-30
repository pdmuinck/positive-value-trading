import {Provider} from "./bookmaker";

export class EventInfo {
    private readonly _sportRadarId: string
    private readonly _sportRadarEventUrl: string
    private readonly _sportRadarHttpMethod = "GET"
    private readonly _bookmakers: BookMakerInfo[]
    private readonly _betOffers

    constructor(sportRadarId: string, sportRadarEventUrl: string, bookmakers: BookMakerInfo[], betOffers?) {
        this._sportRadarId = sportRadarId
        this._sportRadarEventUrl = sportRadarEventUrl
        this._bookmakers = bookmakers
        this._betOffers = betOffers
    }

    get sportRadarId(): string {
        return this._sportRadarId
    }

    get sportRadarEventUrl(): string {
        return this._sportRadarEventUrl
    }

    get sportRadarHttpMethod(): string {
        return this._sportRadarHttpMethod
    }

    get bookmakers(): BookMakerInfo[] {
        return this._bookmakers
    }

    get betOffers() {
        return this._betOffers
    }
}

export class BookMakerInfo {
    private readonly _provider: Provider
    private readonly _bookmaker: string
    private readonly _leagueId: string
    private readonly _eventId: string
    private readonly _leagueUrl: string
    private readonly _eventUrl: string[]
    private readonly _headers: object
    private readonly _requestBody: object
    private readonly _httpMethod: string

    constructor(provider: Provider, bookmaker: string, leagueId: string, eventId: string, leagueUrl: string,
                eventUrl: string[], headers: object, requestBody: object, httpMethod: string) {
        this._provider = provider
        this._bookmaker = bookmaker
        this._leagueId = leagueId
        this._eventId = eventId
        this._leagueUrl = leagueUrl
        this._eventUrl = eventUrl
        this._headers = headers
        this._requestBody = requestBody
        this._httpMethod = httpMethod
    }

    get httpMethod(): string {
        return this._httpMethod
    }

    get provider(): Provider {
        return this._provider
    }

    get bookmaker(): string {
        return this._bookmaker
    }

    get leagueId(): string {
        return this._leagueId
    }

    get eventId(): string {
        return this._eventId
    }

    get leagueUrl(): string {
        return this._leagueUrl
    }

    get eventUrl(): string[] {
        return this._eventUrl
    }

    get headers(): object {
        return this._headers
    }

    get requestBody(): object {
        return this._requestBody
    }
}

export class Participant {
    private readonly _name: string
    private readonly _id: number

    constructor(name: string, id:  number){
        this._name = name
        this._id = id
    }

    get name() {
        return this._name
    }

    get id() {
        return this._id
    }
}