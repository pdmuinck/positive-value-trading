import {ApiResponse, Scraper} from "../client/scraper";
import {BetOffer, BookMaker} from "../domain/betoffer";
import {
    AltenarParser,
    BetcenterParser,
    KambiParser,
    LadbrokesParser,
    MeridianParser,
    PinnacleParser,
    SbtechParser
} from "./parser";

const NodeCache = require('node-cache')
const ttlSeconds = 60 * 1 * 1
const sportEvents = new NodeCache({ stdTTL: ttlSeconds * 60 * 24, checkperiod: ttlSeconds * 0.2, useClones: false })

export class ValueBetService {

    constructor(){
        // create sport events with mapped events across bookmakers and no betoffers yet.
    }

    async searchForValueBets(){
        const apiResponses = await this.scrape()
        const betOffers: BetOffer[] = apiResponses.map(apiResponse => this.parse(apiResponse)).flat()
        // now link the betoffers with sportevents
        // trigger value bet detection
        // register found value bets
    }

    private parse(apiResponse: ApiResponse): BetOffer[] {
        switch(apiResponse.bookmaker) {
            case BookMaker.BETCENTER:
                return BetcenterParser.parse(apiResponse)
            case BookMaker.PINNACLE:
                return PinnacleParser.parse(apiResponse)
            case BookMaker.UNIBET_BELGIUM:
                return KambiParser.parse(apiResponse)
            case BookMaker.NAPOLEON_GAMES:
                return KambiParser.parse(apiResponse)
            case BookMaker.GOLDEN_PALACE:
                return AltenarParser.parse(apiResponse)
            case BookMaker.BETFIRST:
                return SbtechParser.parse(apiResponse)
            case BookMaker.LADBROKES:
                return LadbrokesParser.parse(apiResponse)
            case BookMaker.MERIDIAN:
                return MeridianParser.parse(apiResponse)
            default:
                return []
        }
    }

    private async scrape(): Promise<ApiResponse[]> {
        const scrapeRequests = Object.keys(BookMaker).map(key => {
            return Scraper.getBetOffersByBook(BookMaker[key])
        })
        const results: ApiResponse[] = []
        await Promise.all(scrapeRequests).then(apiResponses => {
            apiResponses.forEach(response => {
                for(let i = 0; i < response.length; i++){
                    results.push(response[i])
                }
            })
        })
        return results
    }


    // serves an endpoint to get value bets
    getValueBets(){

    }




}

