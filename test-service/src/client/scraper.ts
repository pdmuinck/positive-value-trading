import {BookMaker, Participant, Sport, SportCompetition} from "../domain/betoffer";
import {clients} from "./bookmakers";

export class Scraper {
    constructor(){}

    async getBetOffersByBook(bookmaker: BookMaker, sport: Sport, competition: SportCompetition): Promise<ApiResponse[]> {
        const requests = clients[bookmaker].sports.filter(sportMap => sportMap.sport === sport)
            .map(sportMap => sportMap.competitions).flat()
            .filter(competitionMap => competitionMap.competition === competition)
            .map(competitionMap => competitionMap.betOfferRequests).flat()
        return this.getApiResponses(requests)
    }

    async getParticipantsForCompetition(bookmaker: BookMaker, sport: Sport, competition: SportCompetition): Promise<ApiResponse[]>{
        const requests = clients[bookmaker].sports.filter(sportMap => sportMap.sport === sport).map(sportMap => sportMap.competitions).flat()
            .filter(competition => competition.competition === competition).map(competition => competition.particpantRequests).flat()
        return this.getApiResponses(requests)
    }

    async getApiResponses(requests){
        const apiResponses = []
        if(requests){
            await Promise.all(requests).then(responses => {
                responses.forEach(response => {
                    apiResponses.push(response)
                })
            })
        }
        return apiResponses
    }
}

export class FakeScraper extends Scraper {
    private readonly _testData
    constructor(testData){
        super()
        this._testData = testData
    }

    async getBetOffersByBook(bookmaker: BookMaker): Promise<ApiResponse[]> {
        return this._testData[bookmaker]
    }
}

export class ApiResponse {
    private readonly _bookmaker: BookMaker
    private readonly _data

    constructor(bookmaker, data){
        this._bookmaker = bookmaker
        this._data = data
    }

    get bookmaker(){
        return this._bookmaker
    }

    get data(){
        return this._data
    }
}