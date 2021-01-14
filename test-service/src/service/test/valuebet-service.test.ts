import {BetOffer, BetType, BookMaker, Participant, Sport, SportCompetition, SportEvent} from "../../domain/betoffer";
import {ValueBetService} from "../valuebet-service";
import {ApiResponse, FakeScraper} from "../../client/scraper";

const expect = require('chai').expect


describe('ValueBetService tests', function() {
    describe('searchForValueBet', function() {
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
        it('should detect value bets ', async function() {
            const apiData = {
                "UNIBET_BELGIUM": [
                    new ApiResponse(BookMaker.UNIBET_BELGIUM, require('../../client/kambi/unibet_betoffer_type_2_fake.json')),
                    new ApiResponse(BookMaker.UNIBET_BELGIUM, require('../../client/kambi/unibet_betoffer_type_6.json')),
                ],
                "PINNACLE": [
                        new ApiResponse(BookMaker.PINNACLE, require('../../client/pinnacle/pinnacle_betoffer_fake.json')),
                ]
            }

            const fakeScraper = new FakeScraper(apiData)
            const service = new ValueBetService(fakeScraper, sportEvents)
            const valueBets = await service.searchForValueBets()
            expect(valueBets.filter(valueBet => valueBet.value > 0).length).to.equal(valueBets.length)
            expect(valueBets.filter(valueBet => valueBet.betOffer).length).to.equal(valueBets.length)
        })
        it('should skip bad api responses', async function() {
            const apiData = {
                "UNIBET_BELGIUM": [
                    new ApiResponse(BookMaker.UNIBET_BELGIUM, {"shitty": 123}),
                    new ApiResponse(BookMaker.UNIBET_BELGIUM, {"shitty": 123}),
                ],
                "PINNACLE": [
                    new ApiResponse(BookMaker.PINNACLE, {"shitty": 123}),
                ]
            }

            const fakeScraper = new FakeScraper(apiData)
            const service = new ValueBetService(fakeScraper, sportEvents)
            service.searchForValueBets()
            const sportEventsInService: SportEvent[] = service.sportEvents
            expect(sportEventsInService.filter(sportEvent => !sportEvent.betOffers[BookMaker.UNIBET_BELGIUM]).length)
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
                "UNIBET_BELGIUM": [
                    new ApiResponse(BookMaker.UNIBET_BELGIUM, betOffer_unibet)
                ]
            }

            const fakeScraper = new FakeScraper(apiData)
            const service = new ValueBetService(fakeScraper, sportEvents)
            service.searchForValueBets()
            const sportEventsInService: SportEvent[] = service.sportEvents
            expect(sportEventsInService.filter(sportEvent => !sportEvent.betOffers[BookMaker.UNIBET_BELGIUM]).length)
                .is.equal(sportEventsInService.length)

        })
    })
    describe('constructor', function() {
        it('should skip sport events without participants or start date', async function(){
            const sportEvents = [
                new SportEvent(new Date(), SportCompetition.JUPILER_PRO_LEAGUE, Sport.FOOTBALL, {},
                    {}, {}, null),
                new SportEvent(new Date(), SportCompetition.JUPILER_PRO_LEAGUE, Sport.FOOTBALL, {},
                    {}, {}, []),
                new SportEvent(null, SportCompetition.JUPILER_PRO_LEAGUE, Sport.FOOTBALL, {},
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
                new SportEvent(new Date(), SportCompetition.JUPILER_PRO_LEAGUE, Sport.FOOTBALL, {},
                    {}, {}, [new Participant('test'), new Participant('bla')]),
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


