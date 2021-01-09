const expect = require('chai').expect
import {altenar, betcenter, kambi, ladbrokes, sbtech, meridian} from './test-data'
import {KambiParser, SbtechParser, AltenarParser, BetcenterParser, LadbrokesParser, MeridianParser} from '../parser'
import {BetOffer, BetType} from "../../domain/betoffer";

describe('Kambi Parser Tests', function() {
    describe('#parse', function() {
        it('should parse betoffers', function() {
            const book = 'UNIBET_BE'
            const betOffers = KambiParser.parse(book, kambi)
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
        const book = 'BETFIRST'
        const betOffers = SbtechParser.parse(book, sbtech)
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
        const book = 'goldenpalace'
        const betOffers = AltenarParser.parse(book, altenar)
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
        const book = 'betcenter'
        const betOffers = BetcenterParser.parse(book, betcenter)
        const expected = [
            new BetOffer(BetType._1X2, "barcellona-paris-saint-germain-202102162100", book, '1', 1.92, NaN),
            new BetOffer(BetType._1X2, "barcellona-paris-saint-germain-202102162100", book, 'X', 3.50, NaN),
            new BetOffer(BetType._1X2, "barcellona-paris-saint-germain-202102162100", book, '2', 4.11, NaN),
            new BetOffer(BetType.DOUBLE_CHANCE, "barcellona-paris-saint-germain-202102162100", book, '1X', 1.25, NaN),
            new BetOffer(BetType.DOUBLE_CHANCE, "barcellona-paris-saint-germain-202102162100", book, '12', 1.30, NaN),
            new BetOffer(BetType.DOUBLE_CHANCE, "barcellona-paris-saint-germain-202102162100", book, 'X2', 1.88, NaN),
            new BetOffer(BetType.OVER_UNDER, "barcellona-paris-saint-germain-202102162100", book, 'OVER', 1.67, 2.5),
            new BetOffer(BetType.OVER_UNDER, "barcellona-paris-saint-germain-202102162100", book, 'UNDER', 2.12, 2.5)
        ]
        expect(JSON.stringify(betOffers)).to.equal(JSON.stringify(expected))
    })
})

describe('LADBROKES parser tests', function() {
    it('should parse betoffers', function() {
        const book = 'meridian'
        const betOffers = LadbrokesParser.parse(book, ladbrokes)
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
        const book = 'meridian'
        const betOffers = MeridianParser.parse(book, meridian)
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


