/*
import bet90 from "./resources/bet90/events.json"
import bet90ExpectedEvents from './resources/bet90/expected_events.json'
import bet90ExpectedSpecialBetOffers from './resources/bet90/expected_special_betoffers.json'
import bet90SpecialBetOffers from './resources/bet90/special_betoffers.json'
import bet90ExpectedBetOffers from './resources/bet90/expected_betoffers.json'


import {
    Event,
    Parser
} from '../parser';
import {
    RequestType
} from "../../domain/betoffer";

import {Provider} from "../bookmaker";

const expect = require('chai').expect

describe('Parser tests', function() {


    const providers = [Provider.BETWAY]

    providers.forEach(provider => {
        const eventsToParse: ApiResponse = require("./resources/" + provider + "/events.json")
        const betOffersToParse: ApiResponse = require("./resources/" + provider + "/betoffers.json")
        const expectedEvents = require("./resources/" + provider + "/expected_events.json")
        const expectedBetOffers = require("./resources/" + provider + "/expected_betoffers.json")

        it("should parse events for: " + provider, function() {
            const events = Parser.parse(eventsToParse)
            expect(JSON.stringify(events)).to.equal(JSON.stringify(expectedEvents))
        })

        it("should parse betoffers for: " + provider, function() {
            const betOffers = Parser.parse(betOffersToParse)
            expect(JSON.stringify(betOffers)).to.equal(JSON.stringify(expectedBetOffers))
        })
    })


    it("should parse events for: BET90", function() {
        const events: Event[] = Parser.parse(new ApiResponse(Provider.BET90, bet90, RequestType.EVENT))
        expect(JSON.stringify(events)).to.equal(JSON.stringify(bet90ExpectedEvents))
    })


    it("should parse betoffers for: BET90", function (){
        const betOffers = Parser.parse(new ApiResponse(Provider.BET90, bet90, RequestType.BET_OFFER))
        const specialBetOffers = Parser.parse(new ApiResponse(Provider.BET90, {
            specialBetOffers: bet90SpecialBetOffers["betoffers"], eventId: "1121449", _1X2: betOffers.filter(betOffer => betOffer.eventId === "1121449" )}, RequestType.SPECIAL_BET_OFFER))

        expect(JSON.stringify(betOffers)).to.equal(JSON.stringify(bet90ExpectedBetOffers))
        expect(JSON.stringify(specialBetOffers)).to.equal(JSON.stringify(bet90ExpectedSpecialBetOffers))
    })

})

 */


