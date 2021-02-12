var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const KAMBI_SPORTS = require('./kambi/sports.json');
const KAMBI_BOOKMAKERS = require('./kambi/bookmakers.json');
const KAMBI_LEAGUES = require('./kambi/leagues.ts');
const axios = require('axios');
class KambiScraper {
    static getBetOffersByBook(book) {
        return __awaiter(this, void 0, void 0, function* () {
            const bookmaker = KAMBI_BOOKMAKERS[book.toUpperCase()];
            const requests = KAMBI_LEAGUES.map(league => {
                let url = 'https://' + bookmaker.host + '/offering/v2018/' + bookmaker.code
                    + '/betoffer/group/' + league.id + '.json';
                return axios.get(url).then(response => response.data.betOffers)
                    .catch(error => console.log(error));
            });
            let betOffers = {};
            yield Promise.all(requests).then(values => {
                betOffers = values;
            });
            return betOffers;
            /*
            if(type) {
                url += '?type=' + betOfferTypes[type]
            }
            */
        });
    }
}
module.exports = {
    KambiScraper: KambiScraper
};
//# sourceMappingURL=scraper.js.map