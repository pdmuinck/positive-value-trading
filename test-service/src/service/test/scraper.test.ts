import {SportName} from "../../domain/betoffer";
import {Scraper} from "../../client/scraper";

const expect = require('chai').expect

describe("scraper should call third party api", function(){
    describe("getBetOffers", function() {
        it("should return results for all bookies", async function() {
            const scraper = new Scraper()
            const results = await scraper.getBetOffers(SportName.FOOTBALL)
            expect(results.length).to.not.equal(0)
        })
    })
})