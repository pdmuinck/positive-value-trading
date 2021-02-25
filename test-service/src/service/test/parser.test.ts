import {ApiResponse} from "../../client/scraper";
import pinnacle from "./resources/pinnacle.json"
import kambi from "./resources/kambi.json"
import sbtech from "./resources/sbtech.json"
import bet90 from "./resources/bet90.json"
import betcenter from "./resources/betcenter.json"
import ladbrokes from "./resources/ladbrokes.json"
import meridian from "./resources/meridian.json"
import altenar from "./resources/altenar.json"
import circus from "./resources/circus.json"

import {
    AltenarParser,
    Bet90Parser,
    BetcenterParser,
    CircusParser,
    Event,
    KambiParser,
    LadbrokesParser,
    MeridianParser,
    PinnacleParser,
    SbtechParser
} from '../parser';
import {
    BetOffer,
    BetType,
    Bookmaker,
    BookmakerId,
    IdType,
    Participant,
    ParticipantName,
    RequestType
} from "../../domain/betoffer";

const expect = require('chai').expect

describe('Parser tests', function() {

    describe('Circus Parser Tests', function() {
        it("should parse events", function() {
            const events = CircusParser.parse(new ApiResponse(Bookmaker.CIRCUS, circus, RequestType.EVENT, IdType.EVENT))
            const expected = [

            ]
        })
    })


    describe('Kambi Parser Tests', function() {
        describe('#parse', function() {
            it('should parse betoffers', function() {
                const book = Bookmaker.UNIBET_BELGIUM
                const betOffers = KambiParser.parse(new ApiResponse(book, kambi.betoffers, RequestType.BET_OFFER, IdType.BET_OFFER))
                const expected = [
                    new BetOffer(BetType._1X2, 1006478884, book, '1', 8.80, NaN),
                    new BetOffer(BetType._1X2, 1006478884, book, 'X', 4.0, NaN),
                    new BetOffer(BetType._1X2, 1006478884, book, '2', 1.47, NaN),
                    new BetOffer(BetType.OVER_UNDER, 1006478884, book, 'OVER', 2.12, 2.5),
                    new BetOffer(BetType.OVER_UNDER, 1006478884, book, 'UNDER', 1.72, 2.5),
                    new BetOffer(BetType.HANDICAP, 1007031368, book, '1', 1.93, 0.5),
                    new BetOffer(BetType.HANDICAP, 1007031368, book, '2', 1.89, -0.5)
                ]
                expect(JSON.stringify(betOffers)).to.equal(JSON.stringify(expected))
            })

            it('should parse events', function() {
                const events = KambiParser.parse(new ApiResponse(Bookmaker.UNIBET_BELGIUM, kambi.test, RequestType.EVENT, IdType.BET_OFFER))
                const expected = [
                    new Event(new BookmakerId(Bookmaker.UNIBET_BELGIUM, "1007294061", IdType.EVENT), "2021-02-26T19:45:00Z",
                        [
                            new Participant(ParticipantName.CHARLEROI,
                                [new BookmakerId(Bookmaker.UNIBET_BELGIUM, "1002206222", IdType.PARTICIPANT)]),
                            new Participant(ParticipantName.GENK,
                                [new BookmakerId(Bookmaker.UNIBET_BELGIUM, "1000000234", IdType.PARTICIPANT)])
                        ])
                ]
                expect(JSON.stringify(events)).to.equal(JSON.stringify(expected))
            })

            it('should parse participants', function() {
                const participants = KambiParser.parse(new ApiResponse(Bookmaker.UNIBET_BELGIUM, kambi.test, RequestType.PARTICIPANT, IdType.BET_OFFER))
                const expected = [
                    new Participant(ParticipantName.CHARLEROI,
                        [new BookmakerId(Bookmaker.UNIBET_BELGIUM, "1002206222", IdType.PARTICIPANT)]),
                    new Participant(ParticipantName.GENK,
                        [new BookmakerId(Bookmaker.UNIBET_BELGIUM, "1000000234", IdType.PARTICIPANT)])
                ]
                expect(JSON.stringify(participants)).to.equal(JSON.stringify(expected))
            })
        })
    })

    describe('SBTECH parser tests', function() {
        it('should parse betoffers', function() {
            const book = Bookmaker.BETFIRST
            const betOffers = SbtechParser.parse(new ApiResponse(book, sbtech, RequestType.BET_OFFER, IdType.BET_OFFER))
            const expected = [
                new BetOffer(BetType._1X2, '19522273', book, 'X', 3.8, NaN),
                new BetOffer(BetType._1X2, '19522273', book, '2', 4.75, NaN),
                new BetOffer(BetType._1X2, '19522273', book, '1', 1.86956522, NaN),
                new BetOffer(BetType.OVER_UNDER, '21112532', book, 'UNDER', 1.70343413, 2.5),
                new BetOffer(BetType.OVER_UNDER, '21112532', book, 'OVER', 2.17357752, 2.5),
            ]
            expect(JSON.stringify(betOffers)).to.equal(JSON.stringify(expected))
        })

        it('should parse events', function() {
            const events = SbtechParser.parse(new ApiResponse(Bookmaker.BETFIRST, sbtech, RequestType.EVENT, IdType.BET_OFFER))
            const expected = [
                new Event(new BookmakerId(Bookmaker.BETFIRST, "21410549", IdType.EVENT), "2021-01-26T17:45:00Z",
                    [
                        new Participant(ParticipantName.WAASLAND_BEVEREN,
                            [new BookmakerId(Bookmaker.BETFIRST, "78925", IdType.PARTICIPANT)]),
                        new Participant(ParticipantName.MECHELEN,
                            [new BookmakerId(Bookmaker.BETFIRST, "6246", IdType.PARTICIPANT)])
                    ])
            ]
            expect(JSON.stringify(events)).to.equal(JSON.stringify(expected))
        })

        it('should parse participants', function() {
            const participants = SbtechParser.parse(new ApiResponse(Bookmaker.BETFIRST, sbtech, RequestType.PARTICIPANT, IdType.BET_OFFER))
            const expected = [
                new Participant(ParticipantName.WAASLAND_BEVEREN,
                    [new BookmakerId(Bookmaker.BETFIRST, "78925", IdType.PARTICIPANT)]),
                new Participant(ParticipantName.MECHELEN,
                    [new BookmakerId(Bookmaker.BETFIRST, "6246", IdType.PARTICIPANT)])
            ]
            expect(JSON.stringify(participants)).to.equal(JSON.stringify(expected))
        })
    })

    describe('ALTENAR parser tests', function() {
        it('should parse betoffers', function() {
            const book = Bookmaker.GOLDEN_PALACE
            const betOffers = AltenarParser.parse(new ApiResponse(book, altenar, RequestType.BET_OFFER, IdType.BET_OFFER))
            const expected = [
                new BetOffer(BetType._1X2, 200001404193, book, '1', 3.1, NaN),
                new BetOffer(BetType._1X2, 200001404193, book, 'X', 3.65, NaN),
                new BetOffer(BetType._1X2, 200001404193, book, '2', 2.16, NaN),
                new BetOffer(BetType.DOUBLE_CHANCE, 200001404193, book, '1X', 1.64, NaN),
                new BetOffer(BetType.DOUBLE_CHANCE, 200001404193, book, '12', 1.28, NaN),
                new BetOffer(BetType.DOUBLE_CHANCE, 200001404193, book, 'X2', 1.35, NaN),
                new BetOffer(BetType.HANDICAP, 200001404193, book, '1', 2.7, -0.25),
                new BetOffer(BetType.HANDICAP, 200001404193, book, '2', 1.45, 0.25),
                new BetOffer(BetType.OVER_UNDER, 200001404193, book, 'OVER', 1.02, 0.5),
                new BetOffer(BetType.OVER_UNDER, 200001404193, book, 'UNDER', 10.0, 0.5)
            ]
            expect(JSON.stringify(betOffers)).to.equal(JSON.stringify(expected))
        })

        it('should parse events', function() {
            const events = AltenarParser.parse(new ApiResponse(Bookmaker.GOLDEN_PALACE, altenar, RequestType.EVENT, IdType.BET_OFFER))
            const expected = [
                new Event(new BookmakerId(Bookmaker.GOLDEN_PALACE, "200001404193", IdType.EVENT), "2021-02-16T20:00:00Z",
                    [
                        new Participant(ParticipantName.CHARLEROI,
                            [new BookmakerId(Bookmaker.GOLDEN_PALACE, "CHARLEROI", IdType.PARTICIPANT)]),
                        new Participant(ParticipantName.ANDERLECHT,
                            [new BookmakerId(Bookmaker.GOLDEN_PALACE, "ANDERLECHT", IdType.PARTICIPANT)])
                    ])
            ]
            expect(JSON.stringify(events)).to.equal(JSON.stringify(expected))
        })

        it('should parse participants', function() {
            const participants = AltenarParser.parse(new ApiResponse(Bookmaker.GOLDEN_PALACE, altenar, RequestType.PARTICIPANT, IdType.BET_OFFER))
            const expected = [
                new Participant(ParticipantName.CHARLEROI,
                    [new BookmakerId(Bookmaker.GOLDEN_PALACE, "CHARLEROI", IdType.PARTICIPANT)]),
                new Participant(ParticipantName.ANDERLECHT,
                    [new BookmakerId(Bookmaker.GOLDEN_PALACE, "ANDERLECHT", IdType.PARTICIPANT)])
            ]
            expect(JSON.stringify(participants)).to.equal(JSON.stringify(expected))
        })
    })

    describe('BETCENTER parser tests', function() {
        it('should parse betoffers', function() {
            const book = Bookmaker.BETCENTER
            const betOffers = BetcenterParser.parse(new ApiResponse(book, betcenter, RequestType.BET_OFFER, IdType.BET_OFFER))
            const expected = [
                new BetOffer(BetType._1X2, 3140760552, book, '1', 1.92, NaN),
                new BetOffer(BetType._1X2, 3140760552, book, 'X', 3.50, NaN),
                new BetOffer(BetType._1X2, 3140760552, book, '2', 4.11, NaN),
                new BetOffer(BetType.DOUBLE_CHANCE, 3140760552, book, '1X', 1.25, NaN),
                new BetOffer(BetType.DOUBLE_CHANCE, 3140760552, book, '12', 1.30, NaN),
                new BetOffer(BetType.DOUBLE_CHANCE, 3140760552, book, 'X2', 1.88, NaN),
                new BetOffer(BetType.OVER_UNDER, 3140760552, book, 'OVER', 1.67, 2.5),
                new BetOffer(BetType.OVER_UNDER, 3140760552, book, 'UNDER', 2.12, 2.5)
            ]
            expect(JSON.stringify(betOffers)).to.equal(JSON.stringify(expected))
        })

        it('should parse events', function() {
            const events = BetcenterParser.parse(new ApiResponse(Bookmaker.BETCENTER, betcenter, RequestType.EVENT, IdType.EVENT))
            const expected = [
                new Event(new BookmakerId(Bookmaker.BETCENTER, "3140760552", IdType.EVENT), "2021-01-09T15:15:00Z",
                    [
                        new Participant(ParticipantName.ZULTE_WAREGEM,
                            [new BookmakerId(Bookmaker.BETCENTER, "104734", IdType.PARTICIPANT)]),
                        new Participant(ParticipantName.MOESKROEN,
                            [new BookmakerId(Bookmaker.BETCENTER, "104362", IdType.PARTICIPANT)])
                    ])
            ]
            expect(JSON.stringify(events)).to.equal(JSON.stringify(expected))
        })

        it('should parse participants', function() {
            const participants = BetcenterParser.parse(new ApiResponse(Bookmaker.BETCENTER, betcenter, RequestType.PARTICIPANT, IdType.EVENT))
            const expected = [
                new Participant(ParticipantName.ZULTE_WAREGEM,
                    [new BookmakerId(Bookmaker.BETCENTER, "104734", IdType.PARTICIPANT)]),
                new Participant(ParticipantName.MOESKROEN,
                    [new BookmakerId(Bookmaker.BETCENTER, "104362", IdType.PARTICIPANT)])
            ]
            expect(JSON.stringify(participants)).to.equal(JSON.stringify(expected))
        })
    })

    describe('LADBROKES parser tests', function() {
        it('should parse betoffers', function() {
            const book = Bookmaker.LADBROKES
            const betOffers = LadbrokesParser.parse(new ApiResponse(book, ladbrokes, RequestType.BET_OFFER, IdType.BET_OFFER))
            const expected = [
                new BetOffer(BetType._1X2, "barcellona-paris-saint-germain-202102162100", book, '1', 2.3, NaN),
                new BetOffer(BetType._1X2, "barcellona-paris-saint-germain-202102162100", book, 'X', 3.65, NaN),
                new BetOffer(BetType._1X2, "barcellona-paris-saint-germain-202102162100", book, '2', 2.90, NaN),
                new BetOffer(BetType.OVER_UNDER, "barcellona-paris-saint-germain-202102162100", book, 'OVER', 1.45, 2.5),
                new BetOffer(BetType.OVER_UNDER, "barcellona-paris-saint-germain-202102162100", book, 'UNDER', 2.55, 2.5)
            ]
            expect(JSON.stringify(betOffers)).to.equal(JSON.stringify(expected))
        })

        it('should parse events', function() {
            const events = LadbrokesParser.parse(new ApiResponse(Bookmaker.LADBROKES, ladbrokes, RequestType.EVENT, IdType.EVENT))
            const expected = [
                new Event(
                    new BookmakerId(Bookmaker.LADBROKES, "barcellona-paris-saint-germain-202102162100", IdType.EVENT),
                    "1613505600000",
                    [new Participant(ParticipantName.CHARLEROI,
                        [new BookmakerId(Bookmaker.LADBROKES, "CHARLEROI", IdType.PARTICIPANT)]),
                        new Participant(ParticipantName.ANDERLECHT,
                            [new BookmakerId(Bookmaker.LADBROKES, "ANDERLECHT", IdType.PARTICIPANT)])]
                )
            ]
            expect(JSON.stringify(events)).to.equal(JSON.stringify(expected))
        })

        it('should parse participants', function() {
            const participants = LadbrokesParser.parse(new ApiResponse(Bookmaker.LADBROKES, ladbrokes, RequestType.PARTICIPANT, IdType.EVENT))
            const expected = [new Participant(ParticipantName.CHARLEROI,
                [new BookmakerId(Bookmaker.LADBROKES, "CHARLEROI", IdType.PARTICIPANT)]),
                new Participant(ParticipantName.ANDERLECHT,
                    [new BookmakerId(Bookmaker.LADBROKES, "ANDERLECHT", IdType.PARTICIPANT)])]
            expect(JSON.stringify(participants)).to.equal(JSON.stringify(expected))
        })
    })

    describe('MERIDIAN parser tests', function() {
        it('should parse betoffers', function() {
            const book = Bookmaker.MERIDIAN
            const betOffers = MeridianParser.parse(new ApiResponse(book, meridian.betoffers, RequestType.BET_OFFER, IdType.BET_OFFER))
            const expected = [
                new BetOffer(BetType._1X2, "8817779",
                    book, '1', 4.4, NaN),
                new BetOffer(BetType._1X2, "8817779",
                    book, 'X', 3.75, NaN),
                new BetOffer(BetType._1X2, "8817779",
                    book, '2', 1.83, NaN),
                new BetOffer(BetType.OVER_UNDER, "8817779",
                    book, 'UNDER', 1.98, 2.5),
                new BetOffer(BetType.OVER_UNDER, "8817779",
                    book, 'OVER', 1.83, 2.5),
                new BetOffer(BetType._1X2, "8817779",
                    book, '1', 4.4, NaN),
                new BetOffer(BetType._1X2, "8817779",
                    book, 'X', 3.75, NaN),
                new BetOffer(BetType._1X2, "8817779",
                    book, '2', 1.83, NaN),
                new BetOffer(BetType.OVER_UNDER, "8817779",
                    book, 'UNDER', 1.98, 2.5),
                new BetOffer(BetType.OVER_UNDER, "8817779",
                    book, 'OVER', 1.83, 2.5),
            ]
            expect(JSON.stringify(betOffers)).to.equal(JSON.stringify(expected))
        })

        it('should parse events', function() {
            const events = MeridianParser.parse(new ApiResponse(Bookmaker.MERIDIAN, meridian.events, RequestType.EVENT, IdType.EVENT))
            const expected = [
                new Event(new BookmakerId(Bookmaker.MERIDIAN, "9015186", IdType.EVENT), "2021-02-26T19:45:00.000Z",
                    [new Participant(ParticipantName.CHARLEROI,
                        [new BookmakerId(Bookmaker.MERIDIAN, "329006", IdType.PARTICIPANT)]),
                    new Participant(ParticipantName.GENK,
                        [new BookmakerId(Bookmaker.MERIDIAN, "995", IdType.PARTICIPANT)])])
            ]
            expect(JSON.stringify(events)).to.equal(JSON.stringify(expected))
        })

        it('should parse participants', function() {
            const participants = MeridianParser.parse(new ApiResponse(Bookmaker.MERIDIAN, meridian.events, RequestType.PARTICIPANT, IdType.EVENT))
            const expected = [new Participant(ParticipantName.CHARLEROI,
                [new BookmakerId(Bookmaker.MERIDIAN, "329006", IdType.PARTICIPANT)]),
                new Participant(ParticipantName.GENK,
                    [new BookmakerId(Bookmaker.MERIDIAN, "995", IdType.PARTICIPANT)])]
            expect(JSON.stringify(participants)).to.equal(JSON.stringify(expected))
        })
    })

    describe('PINNACLE parser tests', function() {
        it('should parse betoffers', function() {
            const book = Bookmaker.PINNACLE
            const betOffers = PinnacleParser.parse(new ApiResponse(book, pinnacle.betOffers, RequestType.BET_OFFER, IdType.BET_OFFER))
            const expected = [
                new BetOffer(BetType._1X2, 1235631053,
                    book, '1', PinnacleParser.toDecimalOdds(-176), NaN, 1.51),
                new BetOffer(BetType._1X2, 1235631053,
                    book, '2', PinnacleParser.toDecimalOdds(542), NaN, 6.19),
                new BetOffer(BetType._1X2, 1235631053,
                    book, 'X', PinnacleParser.toDecimalOdds(310), NaN, 3.96),
                new BetOffer(BetType.OVER_UNDER, 1235631053,
                    book, 'OVER', PinnacleParser.toDecimalOdds(-102), 2.5, 1.91),
                new BetOffer(BetType.OVER_UNDER, 1235631053,
                    book, 'UNDER', PinnacleParser.toDecimalOdds(-112), 2.5, 1.83)
            ]
            expect(JSON.stringify(betOffers)).to.equal(JSON.stringify(expected))
        })

        it('should parse events', function() {
            const events = PinnacleParser.parse(new ApiResponse(Bookmaker.PINNACLE, pinnacle.events, RequestType.EVENT, IdType.EVENT))
            const expected = [
                new Event(new BookmakerId(Bookmaker.PINNACLE, "1245514434", IdType.EVENT), "2021-01-26T19:45:00+00:00",
                    [
                        new Participant(ParticipantName.ANDERLECHT, [new BookmakerId(Bookmaker.PINNACLE, "ANDERLECHT", IdType.PARTICIPANT)]),
                        new Participant(ParticipantName.CHARLEROI, [new BookmakerId(Bookmaker.PINNACLE, "CHARLEROI", IdType.PARTICIPANT)])
                    ],
                    [new BookmakerId(Bookmaker.PINNACLE, "1246015261", IdType.MARKET),
                    new BookmakerId(Bookmaker.PINNACLE, "1246015198", IdType.MARKET)])
            ]
            expect(JSON.stringify(events)).to.equal(JSON.stringify(expected))
        })

        it('should parse participants', function() {
            const participants = PinnacleParser.parse(new ApiResponse(Bookmaker.PINNACLE, pinnacle.events, RequestType.PARTICIPANT, IdType.EVENT))
            const expected = [
                new Participant(ParticipantName.ANDERLECHT, [new BookmakerId(Bookmaker.PINNACLE, "ANDERLECHT", IdType.PARTICIPANT)]),
                new Participant(ParticipantName.CHARLEROI, [new BookmakerId(Bookmaker.PINNACLE, "CHARLEROI", IdType.PARTICIPANT)])
            ]
            expect(JSON.stringify(participants)).to.equal(JSON.stringify(expected))
        })
    })

    describe("BET90 parser tests", function(){
        it("should parse events", function() {
            const events: Event[] = Bet90Parser.parse(new ApiResponse(Bookmaker.BET90, bet90.events, RequestType.EVENT, IdType.SPORT))
            const expected: Event[] = [
                new Event(new BookmakerId(Bookmaker.BET90, "1105655", IdType.EVENT), "12-2-2021T20:45",
                    [new Participant(ParticipantName.OHL, [new BookmakerId(
                        Bookmaker.BET90, "579135", IdType.PARTICIPANT)]),
                        new Participant(ParticipantName.KORTRIJK, [new BookmakerId(
                            Bookmaker.BET90, "5308", IdType.PARTICIPANT)])]),
                new Event(new BookmakerId(Bookmaker.BET90, "1105649", IdType.EVENT), "13-2-2021T16:15",
                    [new Participant(ParticipantName.WAASLAND_BEVEREN, [new BookmakerId(
                        Bookmaker.BET90, "6690", IdType.PARTICIPANT)]),
                        new Participant(ParticipantName.EUPEN, [new BookmakerId(
                            Bookmaker.BET90, "4558", IdType.PARTICIPANT)])]),
                new Event(new BookmakerId(Bookmaker.BET90, "1105650", IdType.EVENT), "13-2-2021T18:30",
                    [new Participant(ParticipantName.SINT_TRUIDEN, [new BookmakerId(
                        Bookmaker.BET90, "6131", IdType.PARTICIPANT)]),
                        new Participant(ParticipantName.ZULTE_WAREGEM, [new BookmakerId(
                            Bookmaker.BET90, "6689", IdType.PARTICIPANT)])]),
                new Event(new BookmakerId(Bookmaker.BET90, "1105645", IdType.EVENT), "13-2-2021T20:45",
                    [new Participant(ParticipantName.OOSTENDE, [new BookmakerId(
                        Bookmaker.BET90, "4030", IdType.PARTICIPANT)]),
                        new Participant(ParticipantName.GENK, [new BookmakerId(
                            Bookmaker.BET90, "4025", IdType.PARTICIPANT)])]),
                new Event(new BookmakerId(Bookmaker.BET90, "1105646", IdType.EVENT), "14-2-2021T13:30",
                    [new Participant(ParticipantName.STANDARD_LIEGE, [new BookmakerId(
                        Bookmaker.BET90, "4028", IdType.PARTICIPANT)]),
                        new Participant(ParticipantName.ANTWERP, [new BookmakerId(
                            Bookmaker.BET90, "93017", IdType.PARTICIPANT)])]),
                new Event(new BookmakerId(Bookmaker.BET90, "1105662", IdType.EVENT), "14-2-2021T16:00",
                    [new Participant(ParticipantName.BEERSCHOT, [new BookmakerId(
                        Bookmaker.BET90, "579134", IdType.PARTICIPANT)]),
                        new Participant(ParticipantName.MECHELEN, [new BookmakerId(
                            Bookmaker.BET90, "4557", IdType.PARTICIPANT)])]),
                new Event(new BookmakerId(Bookmaker.BET90, "1105659", IdType.EVENT), "14-2-2021T18:15",
                    [new Participant(ParticipantName.CHARLEROI, [new BookmakerId(
                        Bookmaker.BET90, "4027", IdType.PARTICIPANT)]),
                        new Participant(ParticipantName.CLUB_BRUGGE, [new BookmakerId(
                            Bookmaker.BET90, "4029", IdType.PARTICIPANT)])]),
                new Event(new BookmakerId(Bookmaker.BET90, "1105661", IdType.EVENT), "14-2-2021T20:45",
                    [new Participant(ParticipantName.CERCLE_BRUGGE, [new BookmakerId(
                        Bookmaker.BET90, "270736", IdType.PARTICIPANT)]),
                        new Participant(ParticipantName.ANDERLECHT, [new BookmakerId(
                            Bookmaker.BET90, "5309", IdType.PARTICIPANT)])]),
                new Event(new BookmakerId(Bookmaker.BET90, "1105652", IdType.EVENT), "15-2-2021T20:45",
                    [new Participant(ParticipantName.GENT, [new BookmakerId(
                        Bookmaker.BET90, "7687", IdType.PARTICIPANT)]),
                        new Participant(ParticipantName.MOESKROEN, [new BookmakerId(
                            Bookmaker.BET90, "6132", IdType.PARTICIPANT)])]),
            ]
            expect(JSON.stringify(events)).to.equal(JSON.stringify(expected))
        })

        it("should parse participants", function() {
            const expected = [
                new Participant(ParticipantName.OHL, [new BookmakerId(Bookmaker.BET90, "579135", IdType.PARTICIPANT)]),
                new Participant(ParticipantName.KORTRIJK, [new BookmakerId(Bookmaker.BET90, "5308", IdType.PARTICIPANT)]),
                new Participant(ParticipantName.WAASLAND_BEVEREN, [new BookmakerId(Bookmaker.BET90, "6690", IdType.PARTICIPANT)]),
                new Participant(ParticipantName.EUPEN, [new BookmakerId(Bookmaker.BET90, "4558", IdType.PARTICIPANT)]),
                new Participant(ParticipantName.SINT_TRUIDEN, [new BookmakerId(Bookmaker.BET90, "6131", IdType.PARTICIPANT)]),
                new Participant(ParticipantName.ZULTE_WAREGEM, [new BookmakerId(Bookmaker.BET90, "6689", IdType.PARTICIPANT)]),
                new Participant(ParticipantName.OOSTENDE, [new BookmakerId(Bookmaker.BET90, "4030", IdType.PARTICIPANT)]),
                new Participant(ParticipantName.GENK, [new BookmakerId(Bookmaker.BET90, "4025", IdType.PARTICIPANT)]),
                new Participant(ParticipantName.STANDARD_LIEGE, [new BookmakerId(Bookmaker.BET90, "4028", IdType.PARTICIPANT)]),
                new Participant(ParticipantName.ANTWERP, [new BookmakerId(Bookmaker.BET90, "93017", IdType.PARTICIPANT)]),
                new Participant(ParticipantName.BEERSCHOT, [new BookmakerId(Bookmaker.BET90, "579134", IdType.PARTICIPANT)]),
                new Participant(ParticipantName.MECHELEN, [new BookmakerId(Bookmaker.BET90, "4557", IdType.PARTICIPANT)]),
                new Participant(ParticipantName.CHARLEROI, [new BookmakerId(Bookmaker.BET90, "4027", IdType.PARTICIPANT)]),
                new Participant(ParticipantName.CLUB_BRUGGE, [new BookmakerId(Bookmaker.BET90, "4029", IdType.PARTICIPANT)]),
                new Participant(ParticipantName.CERCLE_BRUGGE, [new BookmakerId(Bookmaker.BET90, "270736", IdType.PARTICIPANT)]),
                new Participant(ParticipantName.ANDERLECHT, [new BookmakerId(Bookmaker.BET90, "5309", IdType.PARTICIPANT)]),
                new Participant(ParticipantName.GENT, [new BookmakerId(Bookmaker.BET90, "7687", IdType.PARTICIPANT)]),
                new Participant(ParticipantName.MOESKROEN, [new BookmakerId(Bookmaker.BET90, "6132", IdType.PARTICIPANT)])
            ]

            const participants = Bet90Parser.parse(new ApiResponse(Bookmaker.BET90, bet90.events, RequestType.PARTICIPANT, IdType.EVENT))
            expect(JSON.stringify(participants)).to.equal(JSON.stringify(expected))

        })

        it("should parse betoffers", function (){
            const specialBetOffers = Bet90Parser.parse(new ApiResponse(Bookmaker.BET90, {data: bet90.betoffers, id: "id"}, RequestType.SPECIAL_BET_OFFER, IdType.SPORT))
            const expected = [
                new BetOffer(BetType.OVER_UNDER, "id", Bookmaker.BET90, "OVER", "1.50", "2.5"),
                new BetOffer(BetType.OVER_UNDER, "id", Bookmaker.BET90, "UNDER", "2.55", "2.5"),
                new BetOffer(BetType.OVER_UNDER, "id", Bookmaker.BET90, "OVER", "1.05", "0.5"),
                new BetOffer(BetType.OVER_UNDER, "id", Bookmaker.BET90, "UNDER", "9.00", "0.5"),
                new BetOffer(BetType.OVER_UNDER, "id", Bookmaker.BET90, "OVER", "1.15", "1.5"),
                new BetOffer(BetType.OVER_UNDER, "id", Bookmaker.BET90, "UNDER", "5.20", "1.5"),
                new BetOffer(BetType.OVER_UNDER, "id", Bookmaker.BET90, "OVER", "2.20", "3.5"),
                new BetOffer(BetType.OVER_UNDER, "id", Bookmaker.BET90, "UNDER", "1.65", "3.5"),
                new BetOffer(BetType.OVER_UNDER, "id", Bookmaker.BET90, "OVER", "3.40", "4.5"),
                new BetOffer(BetType.OVER_UNDER, "id", Bookmaker.BET90, "UNDER", "1.30", "4.5"),
                new BetOffer(BetType.OVER_UNDER, "id", Bookmaker.BET90, "OVER", "6.50", "5.5"),
                new BetOffer(BetType.OVER_UNDER, "id", Bookmaker.BET90, "UNDER", "1.10", "5.5"),
                new BetOffer(BetType.DOUBLE_CHANCE, "id", Bookmaker.BET90, "1X", "1.07", NaN),
                new BetOffer(BetType.DOUBLE_CHANCE, "id", Bookmaker.BET90, "12", "1.14", NaN),
                new BetOffer(BetType.DOUBLE_CHANCE, "id", Bookmaker.BET90, "X2", "3.55", NaN)
            ]

            expect(JSON.stringify(specialBetOffers)).to.equal(JSON.stringify(expected))

            const betOffers = Bet90Parser.parse(new ApiResponse(Bookmaker.BET90, bet90.events, RequestType.BET_OFFER, IdType.EVENT))

            const expectedBetOffers = [
                new BetOffer(BetType._1X2, "1105655", Bookmaker.BET90, "1", "2.55", NaN),
                new BetOffer(BetType._1X2, "1105655", Bookmaker.BET90, "X", "3.50", NaN),
                new BetOffer(BetType._1X2, "1105655", Bookmaker.BET90, "2", "2.40", NaN),

                new BetOffer(BetType._1X2, "1105649", Bookmaker.BET90, "1", "3.10", NaN),
                new BetOffer(BetType._1X2, "1105649", Bookmaker.BET90, "X", "3.50", NaN),
                new BetOffer(BetType._1X2, "1105649", Bookmaker.BET90, "2", "2.15", NaN),

                new BetOffer(BetType._1X2, "1105650", Bookmaker.BET90, "1", "2.05", NaN),
                new BetOffer(BetType._1X2, "1105650", Bookmaker.BET90, "X", "3.50", NaN),
                new BetOffer(BetType._1X2, "1105650", Bookmaker.BET90, "2", "3.40", NaN),

                new BetOffer(BetType._1X2, "1105645", Bookmaker.BET90, "1", "2.55", NaN),
                new BetOffer(BetType._1X2, "1105645", Bookmaker.BET90, "X", "3.60", NaN),
                new BetOffer(BetType._1X2, "1105645", Bookmaker.BET90, "2", "2.40", NaN),

                new BetOffer(BetType._1X2, "1105646", Bookmaker.BET90, "1", "2.05", NaN),
                new BetOffer(BetType._1X2, "1105646", Bookmaker.BET90, "X", "3.40", NaN),
                new BetOffer(BetType._1X2, "1105646", Bookmaker.BET90, "2", "3.40", NaN),

                new BetOffer(BetType._1X2, "1105662", Bookmaker.BET90, "1", "3.15", NaN),
                new BetOffer(BetType._1X2, "1105662", Bookmaker.BET90, "X", "3.25", NaN),
                new BetOffer(BetType._1X2, "1105662", Bookmaker.BET90, "2", "2.25", NaN),

                new BetOffer(BetType._1X2, "1105659", Bookmaker.BET90, "1", "5.40", NaN),
                new BetOffer(BetType._1X2, "1105659", Bookmaker.BET90, "X", "3.75", NaN),
                new BetOffer(BetType._1X2, "1105659", Bookmaker.BET90, "2", "1.60", NaN),

                new BetOffer(BetType._1X2, "1105661", Bookmaker.BET90, "1", "3.90", NaN),
                new BetOffer(BetType._1X2, "1105661", Bookmaker.BET90, "X", "3.60", NaN),
                new BetOffer(BetType._1X2, "1105661", Bookmaker.BET90, "2", "1.85", NaN),

                new BetOffer(BetType._1X2, "1105652", Bookmaker.BET90, "1", "1.50", NaN),
                new BetOffer(BetType._1X2, "1105652", Bookmaker.BET90, "X", "4.30", NaN),
                new BetOffer(BetType._1X2, "1105652", Bookmaker.BET90, "2", "5.70", NaN),
            ]

            expect(JSON.stringify(betOffers)).to.equal(JSON.stringify(expectedBetOffers))
        })
    })
})


