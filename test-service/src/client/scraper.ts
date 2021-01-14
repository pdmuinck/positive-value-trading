import {BookMaker} from "../domain/betoffer";
import {bookmakers} from "./bookmakers";

export class Scraper {
    constructor(){}

    async getBetOffersByBook(bookmaker: BookMaker): Promise<ApiResponse[]> {
        const requests: ApiResponse[] = bookmakers[bookmaker]
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