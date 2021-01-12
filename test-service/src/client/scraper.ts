import {BookMaker} from "../domain/betoffer";
import {bookmakers} from "./bookmakers";

export class Scraper {
    static async getBetOffersByBook(bookmaker: BookMaker) {
        const requests: ApiResponse[] = bookmakers[bookmaker]
        let apiResponses = []
        await Promise.all(requests).then(responses => {
            responses.forEach(response => {
                apiResponses.push(response)
            })
        })
        return apiResponses
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