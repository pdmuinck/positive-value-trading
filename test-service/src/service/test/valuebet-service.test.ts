import {BetOffer, BetType} from "../../domain/betoffer";
import {ValueBetService} from "../valuebet-service";

const expect = require('chai').expect

describe('searchForValueBet', function() {
    it('should scrape for betoffers ', async function() {
        const service = new ValueBetService()
        await service.searchForValueBets()
    })
})