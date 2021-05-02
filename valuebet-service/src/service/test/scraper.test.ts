import {Scraper} from "../../client/scraper";
import {getBetOffersForEvents, identifyValueBets} from "../../client/utils";
import {EventInfo} from "../events";

const expect = require('chai').expect

describe("scraper should call third party api", function(){

    describe("get Sbtech events", function() {
        this.timeout(20000)
        it("should return betoffers with bookmaker ids",  async function() {
            const events: EventInfo[] = await Scraper.getEventsForLeague()
            const betOffers = await getBetOffersForEvents(events)
            const valueBets = betOffers.map(eventInfo => identifyValueBets(eventInfo)).flat()
            console.log(events)
        })
    })
})