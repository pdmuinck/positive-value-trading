import {
    CompetitionName,
    IdType,
    RequestType,
    SportEvent,
    SportName
} from "../../domain/betoffer";
import {ValueBetService} from "../valuebet-service";
import {ApiResponse, FakeScraper} from "../../client/scraper";
import {jupilerProLeagueParticipants} from "../../client/config";
import {BookmakerId, Provider} from "../bookmaker";

const expect = require('chai').expect
/*
describe('ValueBetService tests', function() {
    describe('searchForValueBet', function() {
        const today = new Date()

        const eventBookmakerIds = [
            new BookmakerId(Provider.KAMBI, "1006478884", IdType.EVENT),
            new BookmakerId(Provider.PINNACLE, "1239809328", IdType.EVENT)
        ]

        const sportEvents = [
            new SportEvent(today, CompetitionName.JUPILER_PRO_LEAGUE, SportName.FOOTBALL, eventBookmakerIds,
                {}, {}, [jupilerProLeagueParticipants[0], jupilerProLeagueParticipants[1]])
        ]

        it('should detect value bets ', async function() {
            const apiData = {
                "KAMBI": [
                    new ApiResponse(Provider.KAMBI, require('../../client/kambi/unibet_betoffer_type_2_fake.json'),
                        RequestType.BET_OFFER),
                    new ApiResponse(Provider.KAMBI, require('../../client/kambi/unibet_betoffer_type_6.json'),
                        RequestType.BET_OFFER),
                ],
                "PINNACLE": [
                        new ApiResponse(Provider.PINNACLE, require('../../client/pinnacle/pinnacle_betoffer_fake.json'),
                            RequestType.BET_OFFER),
                ]
            }

            const fakeScraper = new FakeScraper(apiData)
            const service = new ValueBetService(fakeScraper, sportEvents)
            const valueBets = await service.searchForValueBets()
            expect(valueBets).to.be.have.lengthOf.at.least(1)
            expect(valueBets.filter(valueBet => valueBet.value > 0).length).to.equal(valueBets.length)
            expect(valueBets.filter(valueBet => valueBet.betOffer).length).to.equal(valueBets.length)
        })
        it('should skip bad api responses', async function() {
            const apiData = {
                "KAMBI": [
                    new ApiResponse(Provider.KAMBI, {"shitty": 123}, RequestType.BET_OFFER),
                    new ApiResponse(Provider.KAMBI, {"shitty": 123}, RequestType.BET_OFFER),
                ],
                "PINNACLE": [
                    new ApiResponse(Provider.PINNACLE, {"shitty": 123}, RequestType.BET_OFFER),
                ]
            }

            const fakeScraper = new FakeScraper(apiData)
            const service = new ValueBetService(fakeScraper, sportEvents)
            service.searchForValueBets()
            const sportEventsInService: SportEvent[] = service.sportEvents
            expect(sportEventsInService.filter(sportEvent => !sportEvent.betOffers[Provider.KAMBI]).length)
                .is.equal(sportEventsInService.length)

        })

        it('should skip betoffers with no bet type', async function() {
            const betOffer_unibet = {
                "betOffers": [
                    {
                        "id": 2234427533,
                        "closed": "2021-06-11T19:00:00Z",
                        "criterion": {
                            "id": 1000105110,
                            "label": "First Goal. No Goal, No Bet",
                            "englishLabel": "First Goal. No Goal, No Bet",
                        },
                        "betOfferType": {
                            "id": 2,
                            "name": "Match",
                            "englishName": "Match"
                        },
                        "eventId": 1006478884
                    }
                ]
            }

            const apiData = {
                "KAMBI": [
                    new ApiResponse(Provider.KAMBI, betOffer_unibet, RequestType.BET_OFFER)
                ]
            }

            const fakeScraper = new FakeScraper(apiData)
            const service = new ValueBetService(fakeScraper, sportEvents)
            service.searchForValueBets()
            const sportEventsInService: SportEvent[] = service.sportEvents
            expect(sportEventsInService.filter(sportEvent => !sportEvent.betOffers[Provider.KAMBI]).length)
                .is.equal(sportEventsInService.length)

        })
    })
    describe('constructor', function() {
        it('should skip sport events without participants or start date', async function(){
            const sportEvents = [
                new SportEvent(new Date(), CompetitionName.JUPILER_PRO_LEAGUE, SportName.FOOTBALL, [],
                    {}, {}, null),
                new SportEvent(new Date(), CompetitionName.JUPILER_PRO_LEAGUE, SportName.FOOTBALL, [],
                    {}, {}, []),
                new SportEvent(null, CompetitionName.JUPILER_PRO_LEAGUE, SportName.FOOTBALL, [],
                    {}, {}, [1, 2])
            ]
            const fakeScraper = new FakeScraper({})
            const service = new ValueBetService(fakeScraper, sportEvents)
            const sportEventsInService = service.sportEvents
            const bookmakerEventCache = service.bookmakerEventCache
            expect(sportEventsInService.length).is.equal(0)
            expect(bookmakerEventCache.length).is.equal(0)
        })

        it('it should skip bookmaker mapping when no event map', async function(){
            const sportEvents = [
                new SportEvent(new Date(), CompetitionName.JUPILER_PRO_LEAGUE, SportName.FOOTBALL, [],
                    {}, {}, [jupilerProLeagueParticipants[0], jupilerProLeagueParticipants[1]]),
            ]
            const fakeScraper = new FakeScraper({})
            const service = new ValueBetService(fakeScraper, sportEvents)
            const sportEventsInService = service.sportEvents
            const bookmakerEventCache = service.bookmakerEventCache
            expect(sportEventsInService.length).is.equal(1)
            expect(bookmakerEventCache.length).is.equal(0)
        })
    })
})

 */


