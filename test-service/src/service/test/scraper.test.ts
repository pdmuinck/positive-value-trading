import {Scraper} from "../../client/scraper";
import {getBetOffersForEvents, identifyValueBets} from "../../client/utils";

const expect = require('chai').expect

describe("scraper should call third party api", function(){

    describe("get Sbtech events", function() {
        this.timeout(20000)
        it("should return betoffers with bookmaker ids",  async function() {
            const events = await Scraper.getEventsForLeague("JUPILER_PRO_LEAGUE")
            const betOffers = await getBetOffersForEvents(events)
            const valueBets = betOffers.map(eventInfo => identifyValueBets(eventInfo)).flat()
            console.log(events)
        })
    })



})