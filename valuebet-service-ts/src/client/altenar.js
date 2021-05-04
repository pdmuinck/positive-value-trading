import {SportRadarMatch} from "./sportradar/sportradar";
import {BookMakerInfo} from "../service/events";

export class EventInfo {
    private readonly _sportRadarId: string
    private readonly _sportRadarEventUrl: string
    private readonly _sportRadarMatch: SportRadarMatch
    private readonly _sportRadarHttpMethod = "GET"
    private readonly _bookmakers: BookMakerInfo[]
    private readonly _betOffers

    constructor(sportRadarId: string, sportRadarEventUrl: string, bookmakers: BookMakerInfo[], betOffers?, sportRadarMatch?: SportRadarMatch) {
    this._sportRadarId = sportRadarId
    this._sportRadarEventUrl = sportRadarEventUrl
    this._sportRadarMatch = sportRadarMatch
    this._bookmakers = bookmakers
    this._betOffers = betOffers
}

get sportRadarId(): string {
    return this._sportRadarId
}

get sportRadarEventUrl(): string {
    return this._sportRadarEventUrl
}

get sportRadarMatch(): SportRadarMatch {
    return this._sportRadarMatch
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