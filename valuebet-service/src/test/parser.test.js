"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var scraper_1 = require("../client/scraper");
var test_data_1 = require("./test-data");
var parser_1 = require("../service/parser");
var betoffer_1 = require("../domain/betoffer");
var expect = require('chai').expect;
describe('Parser tests', function () {
    describe('Kambi Parser Tests', function () {
        describe('#parse', function () {
            it('should parse betoffers', function () {
                var book = betoffer_1.Bookmaker.UNIBET_BELGIUM;
                var betOffers = parser_1.KambiParser.parse(new scraper_1.ApiResponse(book, test_data_1.kambi, betoffer_1.RequestType.BET_OFFER, betoffer_1.IdType.BET_OFFER));
                var expected = [
                    new betoffer_1.BetOffer(betoffer_1.BetType._1X2, 1006478884, book, '1', 8.80, NaN),
                    new betoffer_1.BetOffer(betoffer_1.BetType._1X2, 1006478884, book, 'X', 4.0, NaN),
                    new betoffer_1.BetOffer(betoffer_1.BetType._1X2, 1006478884, book, '2', 1.47, NaN),
                    new betoffer_1.BetOffer(betoffer_1.BetType.OVER_UNDER, 1006478884, book, 'OVER', 2.12, 2.5),
                    new betoffer_1.BetOffer(betoffer_1.BetType.OVER_UNDER, 1006478884, book, 'UNDER', 1.72, 2.5),
                    new betoffer_1.BetOffer(betoffer_1.BetType.HANDICAP, 1007031368, book, '1', 1.93, 0.5),
                    new betoffer_1.BetOffer(betoffer_1.BetType.HANDICAP, 1007031368, book, '2', 1.89, -0.5)
                ];
                expect(JSON.stringify(betOffers)).to.equal(JSON.stringify(expected));
            });
        });
    });
    describe('SBTECH parser tests', function () {
        it('should parse betoffers', function () {
            var book = betoffer_1.Bookmaker.BETFIRST;
            var betOffers = parser_1.SbtechParser.parse(new scraper_1.ApiResponse(book, test_data_1.sbtech, betoffer_1.RequestType.BET_OFFER, betoffer_1.IdType.BET_OFFER));
            var expected = [
                new betoffer_1.BetOffer(betoffer_1.BetType._1X2, '19522273', book, 'X', 3.8, NaN),
                new betoffer_1.BetOffer(betoffer_1.BetType._1X2, '19522273', book, '2', 4.75, NaN),
                new betoffer_1.BetOffer(betoffer_1.BetType._1X2, '19522273', book, '1', 1.86956522, NaN),
                new betoffer_1.BetOffer(betoffer_1.BetType.OVER_UNDER, '21112532', book, 'UNDER', 1.70343413, 2.5),
                new betoffer_1.BetOffer(betoffer_1.BetType.OVER_UNDER, '21112532', book, 'OVER', 2.17357752, 2.5),
            ];
            expect(JSON.stringify(betOffers)).to.equal(JSON.stringify(expected));
        });
    });
    describe('ALTENAR parser tests', function () {
        it('should parse betoffers', function () {
            var book = betoffer_1.Bookmaker.GOLDEN_PALACE;
            var betOffers = parser_1.AltenarParser.parse(new scraper_1.ApiResponse(book, test_data_1.altenar, betoffer_1.RequestType.BET_OFFER, betoffer_1.IdType.BET_OFFER));
            var expected = [
                new betoffer_1.BetOffer(betoffer_1.BetType._1X2, 200001404193, book, '1', 3.1, NaN),
                new betoffer_1.BetOffer(betoffer_1.BetType._1X2, 200001404193, book, 'X', 3.65, NaN),
                new betoffer_1.BetOffer(betoffer_1.BetType._1X2, 200001404193, book, '2', 2.16, NaN),
                new betoffer_1.BetOffer(betoffer_1.BetType.DOUBLE_CHANCE, 200001404193, book, '1X', 1.64, NaN),
                new betoffer_1.BetOffer(betoffer_1.BetType.DOUBLE_CHANCE, 200001404193, book, '12', 1.28, NaN),
                new betoffer_1.BetOffer(betoffer_1.BetType.DOUBLE_CHANCE, 200001404193, book, 'X2', 1.35, NaN),
                new betoffer_1.BetOffer(betoffer_1.BetType.HANDICAP, 200001404193, book, '1', 2.7, -0.25),
                new betoffer_1.BetOffer(betoffer_1.BetType.HANDICAP, 200001404193, book, '2', 1.45, 0.25),
                new betoffer_1.BetOffer(betoffer_1.BetType.OVER_UNDER, 200001404193, book, 'OVER', 1.02, 0.5),
                new betoffer_1.BetOffer(betoffer_1.BetType.OVER_UNDER, 200001404193, book, 'UNDER', 10.0, 0.5)
            ];
            expect(JSON.stringify(betOffers)).to.equal(JSON.stringify(expected));
        });
    });
    describe('BETCENTER parser tests', function () {
        it('should parse betoffers', function () {
            var book = betoffer_1.Bookmaker.BETCENTER;
            var betOffers = parser_1.BetcenterParser.parse(new scraper_1.ApiResponse(book, test_data_1.betcenter, betoffer_1.RequestType.BET_OFFER, betoffer_1.IdType.BET_OFFER));
            var expected = [
                new betoffer_1.BetOffer(betoffer_1.BetType._1X2, 3140760552, book, '1', 1.92, NaN),
                new betoffer_1.BetOffer(betoffer_1.BetType._1X2, 3140760552, book, 'X', 3.50, NaN),
                new betoffer_1.BetOffer(betoffer_1.BetType._1X2, 3140760552, book, '2', 4.11, NaN),
                new betoffer_1.BetOffer(betoffer_1.BetType.DOUBLE_CHANCE, 3140760552, book, '1X', 1.25, NaN),
                new betoffer_1.BetOffer(betoffer_1.BetType.DOUBLE_CHANCE, 3140760552, book, '12', 1.30, NaN),
                new betoffer_1.BetOffer(betoffer_1.BetType.DOUBLE_CHANCE, 3140760552, book, 'X2', 1.88, NaN),
                new betoffer_1.BetOffer(betoffer_1.BetType.OVER_UNDER, 3140760552, book, 'OVER', 1.67, 2.5),
                new betoffer_1.BetOffer(betoffer_1.BetType.OVER_UNDER, 3140760552, book, 'UNDER', 2.12, 2.5)
            ];
            expect(JSON.stringify(betOffers)).to.equal(JSON.stringify(expected));
        });
    });
    describe('LADBROKES parser tests', function () {
        it('should parse betoffers', function () {
            var book = betoffer_1.Bookmaker.LADBROKES;
            var betOffers = parser_1.LadbrokesParser.parse(new scraper_1.ApiResponse(book, test_data_1.ladbrokes, betoffer_1.RequestType.BET_OFFER, betoffer_1.IdType.BET_OFFER));
            var expected = [
                new betoffer_1.BetOffer(betoffer_1.BetType._1X2, "barcellona-paris-saint-germain-202102162100", book, '1', 2.3, NaN),
                new betoffer_1.BetOffer(betoffer_1.BetType._1X2, "barcellona-paris-saint-germain-202102162100", book, 'X', 3.65, NaN),
                new betoffer_1.BetOffer(betoffer_1.BetType._1X2, "barcellona-paris-saint-germain-202102162100", book, '2', 2.90, NaN),
                new betoffer_1.BetOffer(betoffer_1.BetType.OVER_UNDER, "barcellona-paris-saint-germain-202102162100", book, 'OVER', 1.45, 2.5),
                new betoffer_1.BetOffer(betoffer_1.BetType.OVER_UNDER, "barcellona-paris-saint-germain-202102162100", book, 'UNDER', 2.55, 2.5),
                new betoffer_1.BetOffer(betoffer_1.BetType._1X2, "barcellona-paris-saint-germain-202102162100", book, '1', 2.3, NaN),
                new betoffer_1.BetOffer(betoffer_1.BetType._1X2, "barcellona-paris-saint-germain-202102162100", book, 'X', 3.65, NaN),
                new betoffer_1.BetOffer(betoffer_1.BetType._1X2, "barcellona-paris-saint-germain-202102162100", book, '2', 2.90, NaN),
                new betoffer_1.BetOffer(betoffer_1.BetType.OVER_UNDER, "barcellona-paris-saint-germain-202102162100", book, 'OVER', 1.45, 2.5),
                new betoffer_1.BetOffer(betoffer_1.BetType.OVER_UNDER, "barcellona-paris-saint-germain-202102162100", book, 'UNDER', 2.55, 2.5)
            ];
            expect(JSON.stringify(betOffers)).to.equal(JSON.stringify(expected));
        });
    });
    describe('MERIDIAN parser tests', function () {
        it('should parse betoffers', function () {
            var book = betoffer_1.Bookmaker.MERIDIAN;
            var betOffers = parser_1.MeridianParser.parse(new scraper_1.ApiResponse(book, test_data_1.meridian, betoffer_1.RequestType.BET_OFFER, betoffer_1.IdType.BET_OFFER));
            var expected = [
                new betoffer_1.BetOffer(betoffer_1.BetType._1X2, "8817779", book, '1', 4.4, NaN),
                new betoffer_1.BetOffer(betoffer_1.BetType._1X2, "8817779", book, 'X', 3.75, NaN),
                new betoffer_1.BetOffer(betoffer_1.BetType._1X2, "8817779", book, '2', 1.83, NaN),
                new betoffer_1.BetOffer(betoffer_1.BetType.OVER_UNDER, "8817779", book, 'UNDER', 1.98, 2.5),
                new betoffer_1.BetOffer(betoffer_1.BetType.OVER_UNDER, "8817779", book, 'OVER', 1.83, 2.5),
                new betoffer_1.BetOffer(betoffer_1.BetType._1X2, "8817779", book, '1', 4.4, NaN),
                new betoffer_1.BetOffer(betoffer_1.BetType._1X2, "8817779", book, 'X', 3.75, NaN),
                new betoffer_1.BetOffer(betoffer_1.BetType._1X2, "8817779", book, '2', 1.83, NaN),
                new betoffer_1.BetOffer(betoffer_1.BetType.OVER_UNDER, "8817779", book, 'UNDER', 1.98, 2.5),
                new betoffer_1.BetOffer(betoffer_1.BetType.OVER_UNDER, "8817779", book, 'OVER', 1.83, 2.5),
            ];
            expect(JSON.stringify(betOffers)).to.equal(JSON.stringify(expected));
        });
    });
    describe('PINNACLE parser tests', function () {
        it('should parse betoffers', function () {
            var book = betoffer_1.Bookmaker.PINNACLE;
            var betOffers = parser_1.PinnacleParser.parse(new scraper_1.ApiResponse(book, test_data_1.pinnacle, betoffer_1.RequestType.BET_OFFER, betoffer_1.IdType.BET_OFFER));
            var expected = [
                new betoffer_1.BetOffer(betoffer_1.BetType._1X2, 1235631053, book, '1', parser_1.PinnacleParser.toDecimalOdds(-176), NaN, 1.51),
                new betoffer_1.BetOffer(betoffer_1.BetType._1X2, 1235631053, book, '2', parser_1.PinnacleParser.toDecimalOdds(542), NaN, 6.19),
                new betoffer_1.BetOffer(betoffer_1.BetType._1X2, 1235631053, book, 'X', parser_1.PinnacleParser.toDecimalOdds(310), NaN, 3.96),
                new betoffer_1.BetOffer(betoffer_1.BetType.OVER_UNDER, 1235631053, book, 'OVER', parser_1.PinnacleParser.toDecimalOdds(-102), 2.5, 1.91),
                new betoffer_1.BetOffer(betoffer_1.BetType.OVER_UNDER, 1235631053, book, 'UNDER', parser_1.PinnacleParser.toDecimalOdds(-112), 2.5, 1.83)
            ];
            expect(JSON.stringify(betOffers)).to.equal(JSON.stringify(expected));
        });
    });
});
