import {Scraper} from "../../client/scraper";
import {footballCompetitions} from "../../client/config";
import {SbtechScraper} from "../../client/sbtech/sbtech";

const expect = require('chai').expect

describe("scraper should call third party api", function(){

    describe("getEvents", function() {
        this.timeout(20000)
        it("should return events with bookmaker ids",  async function() {
            const scraper = new Scraper()
            const results = await scraper.getEventsForCompetition(footballCompetitions[0])
            expect(results).to.equal(footballCompetitions[0].bookmakerIds.length)
        })
    })

    describe("getBetOffers", function() {
        this.timeout(20000)
        it("should return betoffers with bookmaker ids",  async function() {
            const scraper = new Scraper()
            const events = await scraper.getEventsForCompetition(footballCompetitions[0])
            const results = await scraper.getBetOffers(events)
            expect(results).to.equal(footballCompetitions[0].bookmakerIds.length)
        })
    })

    describe("get Sbtech events", function() {
        this.timeout(20000)
        it("should return betoffers with bookmaker ids",  async function() {
            const events = await SbtechScraper.getEventsForCompetition("40815")
            const betOffers = await SbtechScraper.getBetOffersForEvent(events[0])
            console.log(events)
        })
    })



})