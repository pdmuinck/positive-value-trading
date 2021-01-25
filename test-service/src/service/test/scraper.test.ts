import {BetOffer, Bookmaker, CompetitionName, Participant, SportName} from "../../domain/betoffer";
import {Scraper} from "../../client/scraper";
import {Parser} from "../parser";

const expect = require('chai').expect

describe("scraper should call third party api", function(){
    describe("getBetOffers", function() {
        this.timeout(20000)
        it("should return results for all bookies", async function() {
            const scraper = new Scraper()
            const results = await scraper.getBetOffers(SportName.FOOTBALL)
            const betOffers: BetOffer[] = results.map(result => Parser.parse(result)).flat()
            expect(betOffers.filter(betOffer => betOffer.bookMaker === Bookmaker.UNIBET_BELGIUM).length).is.not.equal(0)
            expect(betOffers.filter(betOffer => betOffer.bookMaker === Bookmaker.NAPOLEON_GAMES).length).is.not.equal(0)
            expect(betOffers.filter(betOffer => betOffer.bookMaker === Bookmaker.PINNACLE).length).is.not.equal(0)
            expect(betOffers.filter(betOffer => betOffer.bookMaker === Bookmaker.BETFIRST).length).is.not.equal(0)
            expect(betOffers.filter(betOffer => betOffer.bookMaker === Bookmaker.BET777).length).is.not.equal(0)
        })
    })

    describe("getParticipants", function() {
        this.timeout(20000)
        it("should return participants with bookmaker ids", async function() {
            const scraper = new Scraper()
            const results = await scraper.getParticipants(SportName.FOOTBALL, CompetitionName.JUPILER_PRO_LEAGUE)
            const participants: Participant[] = results.map(result => Parser.parse(result)).flat()
            expect(participants).to.not.equal(undefined)

        })
    })
})