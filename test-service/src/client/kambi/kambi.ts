import {BookMakerInfo, EventInfo} from "../../service/events";
import {Bookmaker, Provider} from "../../service/bookmaker";
import axios from "axios";
import {SportRadarScraper} from "../sportradar/sportradar";
import {getBetOffers} from "../utils";

export class KambiScraper {
    static async getBetOffersForEvent(event: EventInfo) {
        return getBetOffers(event)
    }
    static async getEventsForCompetition(id: string): Promise<EventInfo[]> {
        const books = [Bookmaker.UNIBET_BELGIUM, Bookmaker.NAPOLEON_GAMES]
        // @ts-ignore
        return axios('https://eu-offering.kambicdn.org/offering/v2018/ubbe/event/group/'
            + id + '.json?includeParticipants=false').then(eventResponses => {
            const requests = eventResponses.data.events.map(event => {
                return axios.get("https://nl.unibet.be/kambi-rest-api/sportradar/widget/event/nl/" + event.id)
                    .then((sportRadarResponse): EventInfo => {
                        const sportRadarId = sportRadarResponse.data.content[0].Resource.split("matchId=")[1]
                        const bookMakerInfos = books.map(book => {
                            return new BookMakerInfo(Provider.KAMBI, book, id, event.id,
                                'https://eu-offering.kambicdn.org/offering/v2018/' + book + '/event/group/' + id + '.json?includeParticipants=false',
                                'https://eu-offering.kambicdn.org/offering/v2018/' + book + '/betoffer/event/'  + event.id + '.json?includeParticipants=false',
                                undefined, undefined, "GET")
                        }).flat()
                        return new EventInfo(parseInt(sportRadarId), SportRadarScraper.getEventUrl(sportRadarId), bookMakerInfos)
                    }).catch(error => [])
            })
            return Promise.all(requests).then((sportRadarResponses) => {
                return sportRadarResponses
            })
        })
    }
}