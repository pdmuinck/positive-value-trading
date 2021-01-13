import {BetOffer, BetType, BookMaker, Participant, Sport, SportCompetition, SportEvent} from "../../domain/betoffer";
import {ValueBetService} from "../valuebet-service";
import {FakeScraper} from "../../client/scraper";

const expect = require('chai').expect

describe('searchForValueBet', function() {
    it('should scrape for betoffers ', async function() {
        const today = new Date()
        const eventMap = {}
        eventMap[BookMaker.UNIBET_BELGIUM] = '1006478884'
        eventMap[BookMaker.PINNACLE] = '1239809328'
        const participant_club = new Participant('CLUB_BRUGGE')
        const participant_anderlecht = new Participant('ANDERLECHT')
        const sportEvents = [
            new SportEvent(today, SportCompetition.JUPILER_PRO_LEAGUE, Sport.FOOTBALL, eventMap,
                {}, {}, [participant_club, participant_anderlecht])
        ]
        const fakeScraper = new FakeScraper()
        const service = new ValueBetService(fakeScraper, sportEvents)
        const valueBets = await service.searchForValueBets()
        console.log(valueBets)
    })
})