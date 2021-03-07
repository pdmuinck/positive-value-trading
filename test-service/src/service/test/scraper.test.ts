import {
    BetOffer, Competition,
    CompetitionName,
    IdType,
    Participant,
    RequestType,
    SportName
} from "../../domain/betoffer"
import {Bookmaker, Provider} from "../bookmaker";
import {Scraper} from "../../client/scraper";
import {Parser} from "../parser";
import {ParticipantMapper} from "../mapper";
import {footballCompetitions, jupilerProLeagueParticipants} from "../../client/config";

const expect = require('chai').expect

describe("scraper should call third party api", function(){

    describe("getEvents", function() {
        this.timeout(20000)
        it("should return events with bookmaker ids",  async function() {
            const scraper = new Scraper()
            const results = await scraper.getEventsForCompetition(footballCompetitions[0])
            expect(results.length).to.equal(footballCompetitions[0].bookmakerIds.length)
        })
    })

    describe("getBetOffers", function() {
        this.timeout(20000)
        it("should return betoffers with bookmaker ids",  async function() {
            const scraper = new Scraper()
            const results = await scraper.getBetOffersForCompetition(footballCompetitions[0])
            expect(results.length).to.equal(footballCompetitions[0].bookmakerIds.length)
        })
    })



})