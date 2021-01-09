const KAMBI_SPORTS = require('./kambi/sports.json')
const KAMBI_BOOKMAKERS = require('./kambi/bookmakers.json')
const KAMBI_LEAGUES = require('./kambi/leagues.json')
const axios = require('axios')

export class KambiScraper {
    static async getBetOffersByBook(book: string) {
        const bookmaker = KAMBI_BOOKMAKERS[book.toUpperCase()]
        const requests = KAMBI_LEAGUES.map(league => {
            let url = 'https://' + bookmaker.host + '/offering/v2018/' + bookmaker.code
                + '/betoffer/group/' + league.id + '.json'
            return axios.get(url).then(response => response.data.betOffers)
                .catch(error => console.log(error))
        })
        let betOffers = {}
        await Promise.all(requests).then(values => {
            betOffers = values
        })
        return betOffers

        /*
        if(type) {
            url += '?type=' + betOfferTypes[type]
        }
        */
    }
}


export class SbtechScraper {
    static async getBetOfferByBook(book: string){

    }
}