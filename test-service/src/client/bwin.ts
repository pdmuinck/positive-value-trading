import {BookMakerInfo, EventInfo} from "../service/events";
import axios from "axios";
import {Bookmaker, Provider} from "../service/bookmaker";
import {ApiResponse} from "./scraper";
import {SportRadarScraper} from "./sportradar/sportradar";
import {BwinParser, SbtechParser} from "../service/parser";
import {RequestType} from "../domain/betoffer";

export class BwinScraper {
    static async getBetOffersForEvent(event: EventInfo) {
        const requests = event.bookmakers.map(bookmaker => {
            return axios.get(bookmaker.eventUrl, bookmaker.headers)
                .then(response => {return {book: bookmaker.bookmaker, betoffers: BwinParser.parseBetOffers(new ApiResponse(Provider.BWIN, response.data, RequestType.BET_OFFER))}})
                .catch(error => console.log(error))
        })
        return Promise.all(requests).then(values => {
            return values
        })
    }
    static async getEventsForCompetition(id: string): Promise<EventInfo[]> {
        const leagueUrl = 'https://cds-api.bwin.be/bettingoffer/fixtures?x-bwin-accessid=NTE3MjUyZDUtNGU5Ni00MTkwL' +
            'WJkMGQtMDhmOGViNGNiNmRk&lang=en&country=BE&userCountry=BE&fixtureTypes=Standard&state=Late' +
            'st&offerMapping=Filtered&offerCategories=Gridable&fixtureCategories=Gridable,NonGridable,Other&co' +
            'mpetitionIds=' + id + '&skip=0&take=50&sortBy=Tags'
        return axios.get(leagueUrl).then(response => {
            return response.data.fixtures.map(event => {
                const sportRadarId = event.addons.betRadar
                const bookmakerInfo = new BookMakerInfo(Provider.BWIN, Bookmaker.BWIN, id, event.id, "",
                    "https://cds-api.bwin.be/bettingoffer/fixture-view?x-bwin-accessid=NTE3MjUyZDUtNGU5Ni00MTkwLWJkMGQtMDhmOGViNGNiNmRk&lang=en&country=BE&userCountry=BE&offerMapping=All&fixtureIds=" + 11341106 + "&state=Latest",
                    undefined, undefined, "GET")
                return new EventInfo(parseInt(sportRadarId), SportRadarScraper.getEventUrl(sportRadarId), [bookmakerInfo])
            })
        })
    }
}