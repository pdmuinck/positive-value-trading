import {Provider} from "../service/bookmaker";

export class ApiResponse {
    private readonly _provider: Provider
    private readonly _data
    private readonly _bookmaker: string

    constructor(provider: Provider, data, bookmaker?: string) {
        this._provider = provider
        this._data = data
        this._bookmaker = bookmaker
    }

    get bookmaker() {
        return this._bookmaker
    }

    get provider() {
        return this._provider
    }

    get data() {
        return this._data
    }

}