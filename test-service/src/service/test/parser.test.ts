import {ApiResponse} from "../../client/scraper";
import {altenar, betcenter, kambi, ladbrokes, meridian, pinnacle, sbtech} from './test-data'
import {
    AltenarParser,
    BetcenterParser,
    KambiParser,
    LadbrokesParser,
    MeridianParser,
    PinnacleParser,
    SbtechParser
} from '../parser'
import {BetOffer, BetType, Bookmaker, IdType, RequestType} from "../../domain/betoffer";

const expect = require('chai').expect

describe('Parser tests', function() {

    describe('Kambi Parser Tests', function() {
        describe('#parse', function() {
            it('should parse betoffers', function() {
                const book = Bookmaker.UNIBET_BELGIUM
                const betOffers = KambiParser.parse(new ApiResponse(book, kambi, RequestType.BET_OFFER, IdType.BET_OFFER))
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
                new BetOffer(BetType.OVER_UNDER, "barcellona-paris-saint-germain-202102162100", book, 'UNDER', 2.55, 2.5),
                new BetOffer(BetType._1X2, "barcellona-paris-saint-germain-202102162100", book, '1', 2.3, NaN),
                new BetOffer(BetType._1X2, "barcellona-paris-saint-germain-202102162100", book, 'X', 3.65, NaN),
                new BetOffer(BetType._1X2, "barcellona-paris-saint-germain-202102162100", book, '2', 2.90, NaN),
                new BetOffer(BetType.OVER_UNDER, "barcellona-paris-saint-germain-202102162100", book, 'OVER', 1.45, 2.5),
                new BetOffer(BetType.OVER_UNDER, "barcellona-paris-saint-germain-202102162100", book, 'UNDER', 2.55, 2.5)
            ]
            expect(JSON.stringify(betOffers)).to.equal(JSON.stringify(expected))
        })
    })

    describe('MERIDIAN parser tests', function() {
        it('should parse betoffers', function() {
            const book = Bookmaker.MERIDIAN
            const betOffers = MeridianParser.parse(new ApiResponse(book, meridian, RequestType.BET_OFFER, IdType.BET_OFFER))
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
    })

    describe('PINNACLE parser tests', function() {
        it('should parse betoffers', function() {
            const book = Bookmaker.PINNACLE
            const betOffers = PinnacleParser.parse(new ApiResponse(book, pinnacle, RequestType.BET_OFFER, IdType.BET_OFFER))
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
    })

})


