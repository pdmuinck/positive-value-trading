import {
    BetType,
    BookMaker,
    BookmakerClient,
    BookmakerClientCompetition,
    BookmakerClientSport, Provider,
    Sport,
    SportCompetition
} from "../domain/betoffer";
import {ApiResponse} from "./scraper";
import {BookmakerCompetitionMap, bookmakerMaps, BookmakerSportMap} from "./config";
const axios = require('axios')

export const clients = {}

export enum RequestType {
    BETOFFERS = 'BETOFFERS',
    PARTICIPANTS = 'PARTICIPANTS',
    EVENTS= 'EVENTS'
}

const kambiCompetitions = {}
kambiCompetitions[Sport.FOOTBALL] = {}
kambiCompetitions[Sport.FOOTBALL][SportCompetition.JUPILER_PRO_LEAGUE] = 1000094965
kambiCompetitions[Sport.FOOTBALL][SportCompetition.EREDIVISIE] = 1000094980


Object.keys(BookMaker).forEach(key => {
    const bookmaker: BookMaker = BookMaker[key]
    const bookmakerClientSports = Object.keys(Sport).map(key => {
        const sport: Sport = Sport[key]
        const bookmakerSportMap: BookmakerSportMap = bookmakerMaps.filter(map => map.sport === sport)[0]
        const bookmakerClientCompetitions: BookmakerClientCompetition[] = bookmakerSportMap.competitions.
                                            map((competitionMap: BookmakerCompetitionMap): BookmakerClientCompetition => {
            return new BookmakerClientCompetition(
                competitionMap.competition,
                requests(bookmaker, sport, competitionMap, RequestType.BETOFFERS),
                requests(bookmaker, sport, competitionMap, RequestType.PARTICIPANTS),
                requests(bookmaker, sport, competitionMap, RequestType.EVENTS),
            )
        })
        return new BookmakerClientSport(sport, bookmakerClientCompetitions)
    })
    clients[bookmaker] = new BookmakerClient(bookmaker, bookmakerClientSports)
})


function requests(bookmaker: BookMaker, sport: Sport, competition: BookmakerCompetitionMap, requestType: RequestType) {
    switch(bookmaker){
        case BookMaker.PINNACLE:
            return pinnacleRequests(sport, competition, requestType)
        case BookMaker.UNIBET_BELGIUM:
            return kambiRequests(bookmaker, sport, competition, requestType)
    }
}

function pinnacleRequests(sport: Sport, competition: BookmakerCompetitionMap, requestType: RequestType) {
    const pinnacleRequestHeaders = {
        "X-API-Key": "CmX2KcMrXuFmNg6YFbmTxE0y9CIrOi0R",
        "Referer": "https://www.pinnacle.com/",
        "Accept": "application/json",
        "Content-Type": "application/json"
    }
    switch(requestType){
        case RequestType.BETOFFERS:
            return [
                axios.get(
                'https://guest.api.arcadia.pinnacle.com/0.1/sports/29/markets/straight?primaryOnly=true',
                {
                    headers: {
                        "X-API-Key": "CmX2KcMrXuFmNg6YFbmTxE0y9CIrOi0R",
                        "Referer": "https://www.pinnacle.com/",
                        "Accept": "application/json",
                        "Content-Type": "application/json"
                    }
                }
            ).then(response => {return new ApiResponse(BookMaker.PINNACLE, response.data)})
                .catch(error => {return new ApiResponse(BookMaker.PINNACLE, null)})
            ]

        case RequestType.EVENTS:

        case RequestType.PARTICIPANTS:

    }
}

function kambiRequests(bookmaker: BookMaker, sport: Sport, competition: BookmakerCompetitionMap, requestType: RequestType): ApiResponse[]{
    const kambiBetOfferTypes = {}
    kambiBetOfferTypes[BetType._1X2] = 2
    kambiBetOfferTypes[BetType.OVER_UNDER] = 6

    const kambiBooks = {}
    kambiBooks[BookMaker.UNIBET_BELGIUM] = 'ubbe'
    kambiBooks[BookMaker.NAPOLEON_GAMES] = 'ngbe'

    const competitionId = competition.bookmakerIds[Provider.KAMBI]

    switch(requestType){
        case RequestType.BETOFFERS:
            return Object.keys(kambiBetOfferTypes).map(key => {
                const betOfferType = kambiBetOfferTypes[key]
                return axios.get(
                    'https://eu-offering.kambicdn.org/offering/v2018/' +  kambiBooks[bookmaker] + '/betoffer/group/'
                    + competitionId + '.json?type=' + betOfferType
                ).then(response => {return new ApiResponse(bookmaker, response.data)})
                    .catch(error => {return new ApiResponse(bookmaker, null)})
            })

        case RequestType.EVENTS:
            return [
                axios('https://eu-offering.kambicdn.org/offering/v2018/' + kambiBooks[bookmaker] + '/event/group/'
                    + competitionId + '.json?includeParticipants=false')
                    .then(response => response.data).catch(error => null)
            ]

        case RequestType.PARTICIPANTS:
            return [
                axios('https://eu-offering.kambicdn.org/offering/v2018/' + kambiBooks[bookmaker] + '/event/group/'
                    + competitionId + '.json?includeParticipants=true')
                .then(response => response.data).catch(error => null)
            ]

    }
}


