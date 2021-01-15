import {
    BetType,
    BookMaker,
    BookmakerClient,
    BookmakerClientCompetition,
    BookmakerClientSport,
    Sport,
    SportCompetition,
    sportCompetitionMap
} from "../domain/betoffer";
import {ApiResponse} from "./scraper";

const axios = require('axios')

export const clients = {}

export enum RequestType {
    BETOFFERS= 'BETOFFERS',
    PARTICIPANTS = 'PARTICIPANTS',
    EVENTS= 'EVENTS'
}

Object.keys(BookMaker).forEach(key => {
    const bookmaker: BookMaker = BookMaker[key]
    const bookmakerClientSports = Object.keys(Sport).map(key => {
        const sport: Sport = Sport[key]
        const bookmakerClientCompetitions = sportCompetitionMap[sport].map(competition => {
            new BookmakerClientCompetition(
                competition,
                requests(bookmaker, sport, competition, RequestType.BETOFFERS),
                requests(bookmaker, sport, competition, RequestType.PARTICIPANTS),
                requests(bookmaker, sport, competition, RequestType.EVENTS),
            )
        })
        return new BookmakerClientSport(sport, bookmakerClientCompetitions)
    })
    clients[bookmaker] = new BookmakerClient(bookmaker, bookmakerClientSports)
})

function requests(bookmaker: BookMaker, sport: Sport, competition: SportCompetition, requestType: RequestType) {
    switch(bookmaker){
        case BookMaker.PINNACLE:
            return pinnacleRequests(sport, competition, requestType)
        case BookMaker.UNIBET_BELGIUM:
            return kambiRequests(bookmaker, sport, competition, requestType)
    }
}

function pinnacleRequests(sport: Sport, competition: SportCompetition, requestType: RequestType) {
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

function kambiRequests(bookmaker: BookMaker, sport: Sport, competition: SportCompetition, requestType: RequestType): ApiResponse[]{
    switch(requestType){
        case RequestType.BETOFFERS:
            return Object.keys(kambiBetOfferTypes).map(key => {
                const betOfferType = kambiBetOfferTypes[key]
                return axios.get(
                    'https://eu-offering.kambicdn.org/offering/v2018/' +  kambiBooks[bookmaker] + '/betoffer/group/'
                    + kambiCompetitions[sport][competition] + '.json?type=' + betOfferType
                ).then(response => {return new ApiResponse(bookmaker, response.data)})
                    .catch(error => {return new ApiResponse(bookmaker, null)})
            })
        case RequestType.EVENTS:

        case RequestType.PARTICIPANTS:

    }
}

const kambiBooks = {}
kambiBooks[BookMaker.UNIBET_BELGIUM] = 'ubbe'
kambiBooks[BookMaker.NAPOLEON_GAMES] = 'ngbe'

const kambiCompetitions = {}
kambiCompetitions[Sport.FOOTBALL] = {}
kambiCompetitions[Sport.FOOTBALL][SportCompetition.JUPILER_PRO_LEAGUE] = 1000094965
kambiCompetitions[Sport.FOOTBALL][SportCompetition.EREDIVISIE] = 1000094980

const kambiBetOfferTypes = {}
kambiBetOfferTypes[BetType._1X2] = 2
kambiBetOfferTypes[BetType.OVER_UNDER] = 6


