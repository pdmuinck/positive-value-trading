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
    constructor(){super()}

    async getBetOffersByBook(bookmaker: BookMaker): Promise<ApiResponse[]> {
        switch(bookmaker){
            case BookMaker.UNIBET_BELGIUM:
                return [
                    new ApiResponse(BookMaker.UNIBET_BELGIUM, require('./kambi/unibet_betoffer_type_2_fake.json')),
                    new ApiResponse(BookMaker.UNIBET_BELGIUM, require('./kambi/unibet_betoffer_type_6.json')),
                ]
            case BookMaker.PINNACLE:
                return [
                    new ApiResponse(BookMaker.UNIBET_BELGIUM, require('./pinnacle/pinnacle_betoffer_fake.json')),
                ]
            default:
                return []
        }
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