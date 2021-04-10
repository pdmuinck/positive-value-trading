import {BookMakerInfo, EventInfo} from "../../service/events";
import {BetType, Bookmaker, Provider} from "../../service/bookmaker";
import axios from "axios";
import {SportRadarScraper} from "../sportradar/sportradar";
import {ApiResponse} from "../scraper";
import {BetOffer} from "../../service/betoffers";

function kambiBetOption(outcome) {
    return outcome.type.toUpperCase()
        .replace("OT_", "")
        .replace("ONE", "1")
        .replace("TWO", "2")
        .replace("CROSS", "X")
        .replace("_OR_", "")
        .replace("_", "")
}

function kambiOdds(outcome) {
    return outcome.odds / 1000
}

function kambiLine(outcome) {
    return outcome.line / 1000
}

export function kambiPrices(betOffer, betType: BetType) {
    if(betType === BetType.CORRECT_SCORE || betType === BetType.CORRECT_SCORE_H1 || betType === BetType.CORRECT_SCORE_H2) {
        return betOffer.outcomes.map(outcome => {return {option: outcome.label, price: kambiOdds(outcome)}})
    }
    if(betType === BetType.OVER_UNDER || betType === BetType.OVER_UNDER_TEAM1 || betType === BetType.OVER_UNDER_TEAM2) {
        return betOffer.outcomes.map(outcome => {
            const option = kambiBetOption(outcome)
            return {option: option, price: kambiOdds(outcome), line: kambiLine(outcome)}
        })
    }
    if(betType === BetType.ASIAN_HANDICAP) {
        return betOffer.outcomes.map((outcome, index) => {
            return {option: (index + 1).toString(), price: kambiOdds(outcome), line: kambiLine(outcome)}
        })
    }
    if(betType === BetType.HANDICAP) {
        return betOffer.outcomes.map(outcome => {return {option: kambiBetOption(outcome), price: kambiOdds(outcome), line: kambiLine(outcome)}})
    }
    return betOffer.outcomes.map(outcome => {
        return {option: kambiBetOption(outcome), price: kambiOdds(outcome)}
    })
}

export function kambiBetOfferTypes(betOffer) {
    switch(betOffer.criterion.id){
        // MATCH
        case 1001159858:
            return BetType._1X2
        case 1000316018:
            return BetType._1X2_H1
        case 1001159826:
            return BetType._1X2_H2

        // DRAW NO BET
        case 1001159666:
            return BetType.DRAW_NO_BET
        case 1001159884:
            return BetType.DRAW_NO_BET_H1
        case 1001421321:
            return BetType.DRAW_NO_BET_H2

        // DOUBLE CHANCE
        case 1001159922:
            return BetType.DOUBLE_CHANCE
        case 1001159668:
            return BetType.DOUBLE_CHANCE_H1
        case 1001421320:
            return BetType.DOUBLE_CHANCE_H2

        // OVER UNDER
        case 1001159926:
            return BetType.OVER_UNDER
        case 1001159532:
            return BetType.OVER_UNDER_H1
        case 1001243173:
            return BetType.OVER_UNDER_H2
        case 1001159967:
            return BetType.OVER_UNDER_TEAM1
        case 1001159633:
            return BetType.OVER_UNDER_TEAM2

        // CORRECT SCORE
        case 1001159780:
            return BetType.CORRECT_SCORE
        case 1001568619:
            return BetType.CORRECT_SCORE_H2
        case 1000505272:
            return BetType.CORRECT_SCORE_H1


        case 1001159711:
            return BetType.HANDICAP
        case 1001642858:
            return BetType.BOTH_TEAMS_SCORE
        case 1001159897:
            return BetType.OVER_UNDER_CORNERS
        case 1001239606:
            return BetType.ODD_EVEN_CORNERS
        case 1002244276:
            return BetType.ASIAN_OVER_UNDER
        case 1001642858:
            return BetType.BOTH_TEAMS_SCORE

        // HANDICAP
        case 1001224081:
            return BetType._3_WAY_HANDICAP
        case 1001568620:
            return BetType._3_WAY_HANDICAP_H1
        case 1001568621:
            return BetType._3_WAY_HANDICAP_H2

        // ASIAN HANDICAP
        case 1002275572:
            return BetType.ASIAN_HANDICAP
        case 1002275573:
            return BetType.ASIAN_HANDICAP_H1



        case 1001160024:
            return BetType.ODD_EVEN_TEAM2
        case 1001160038:
            return BetType.ODD_EVEN
        case 1001159808:
            return BetType.ODD_EVEN_TEAM2
        default:
            return BetType.UNKNOWN
    /*
    switch(betOffer.betOfferType.id) {
        case 2:
            if(betOffer.criterion.id === 1001159858 || betOffer.criterion.id === 1000316018 || betOffer.criterion.id === 1001159826) return BetType._1X2
            if(betOffer.criterion.id === 1001159666 || betOffer.criterion.id === 1001159884 || betOffer.criterion.id === 1001421321) return BetType.DRAW_NO_BET
        case 3:
            return BetType.CORRECT_SCORE
        case 6:
            if(betOffer.criterion.id === 1001159967) return BetType.OVER_UNDER_TEAM1
            if(betOffer.criterion.id === 1001159633) return BetType.OVER_UNDER_TEAM2
            return BetType.OVER_UNDER
        case 7:// asian handicap
            return BetType.ASIAN_HANDICAP
        case 8:
            return BetType.HALF_TIME_FULL_TIME
        case 10:
            if(betOffer.criterion.id === 1001160024) return BetType.ODD_EVEN_TEAM2
            if(betOffer.criterion.id === 1001159808) return BetType.ODD_EVEN_TEAM1
            return BetType.ODD_EVEN
        case 11:
            return BetType.HANDICAP
        case 12:
            return BetType.DOUBLE_CHANCE
        case 18:// yesno
        case 21:// asian total
            return BetType.OVER_UNDER
        default: return BetType.UNKNOWN
        */

    }
}

export function parseKambiBetOffers(apiResponse: ApiResponse) {
    if(!apiResponse.data) return []
    return apiResponse.data.betOffers.map(betOffer => {
        const betType = kambiBetOfferTypes(betOffer)
        if(betType !== BetType.UNKNOWN) {
            const eventId = betOffer.eventId
            const prices = kambiPrices(betOffer, betType)
            return prices.map(price => {
                return new BetOffer(betType, eventId, apiResponse.bookmaker, price.option, price.price, price.line)
            })
        }
    }).flat().filter(x => x)
}

export async function getKambiEventsForCompetition(id: string): Promise<EventInfo[]> {
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
