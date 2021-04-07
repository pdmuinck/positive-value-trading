import {Scraper} from "../../client/scraper";
import {footballCompetitions} from "../../client/config";
import {SbtechScraper} from "../../client/sbtech/sbtech";
import {KambiScraper} from "../../client/kambi/kambi";
import {getBetOffers, getBetOffersForEvents} from "../../client/utils";

const expect = require('chai').expect

describe("scraper should call third party api", function(){

    describe("get Sbtech events", function() {
        this.timeout(20000)
        it("should return betoffers with bookmaker ids",  async function() {
            const events = await Scraper.getEventsForLeague("JUPILER_PRO_LEAGUE")
            const betOffers = await getBetOffersForEvents(events)
            console.log(events)
        })
    })



})