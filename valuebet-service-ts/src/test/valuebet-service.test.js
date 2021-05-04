"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var betoffer_1 = require("../domain/betoffer");
var valuebet_service_1 = require("../service/valuebet-service");
var scraper_1 = require("../client/scraper");
var config_1 = require("../client/config");
var expect = require('chai').expect;
describe('ValueBetService tests', function () {
    describe('searchForValueBet', function () {
        var today = new Date();
        var eventBookmakerIds = [
            new betoffer_1.BookmakerId(betoffer_1.Bookmaker.UNIBET_BELGIUM, "1006478884", betoffer_1.IdType.EVENT),
            new betoffer_1.BookmakerId(betoffer_1.Bookmaker.PINNACLE, "1239809328", betoffer_1.IdType.EVENT)
        ];
        var sportEvents = [
            new betoffer_1.SportEvent(today, betoffer_1.CompetitionName.JUPILER_PRO_LEAGUE, betoffer_1.SportName.FOOTBALL, eventBookmakerIds, {}, {}, [config_1.jupilerProLeagueParticipants[0], config_1.jupilerProLeagueParticipants[1]])
        ];
        it('should detect value bets ', function () {
            return __awaiter(this, void 0, void 0, function () {
                var apiData, fakeScraper, service, valueBets;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            apiData = {
                                "UNIBET_BELGIUM": [
                                    new scraper_1.ApiResponse(betoffer_1.Bookmaker.UNIBET_BELGIUM, require('../client/kambi/unibet_betoffer_type_2_fake.json'), betoffer_1.RequestType.BET_OFFER, betoffer_1.IdType.BET_OFFER),
                                    new scraper_1.ApiResponse(betoffer_1.Bookmaker.UNIBET_BELGIUM, require('../client/kambi/unibet_betoffer_type_6.json'), betoffer_1.RequestType.BET_OFFER, betoffer_1.IdType.BET_OFFER),
                                ],
                                "PINNACLE": [
                                    new scraper_1.ApiResponse(betoffer_1.Bookmaker.PINNACLE, require('../client/pinnacle/pinnacle_betoffer_fake.json'), betoffer_1.RequestType.BET_OFFER, betoffer_1.IdType.BET_OFFER),
                                ]
                            };
                            fakeScraper = new scraper_1.FakeScraper(apiData);
                            service = new valuebet_service_1.ValueBetService(fakeScraper, sportEvents);
                            return [4 /*yield*/, service.searchForValueBets()];
                        case 1:
                            valueBets = _a.sent();
                            expect(valueBets).to.be.have.lengthOf.at.least(1);
                            expect(valueBets.filter(function (valueBet) { return valueBet.value > 0; }).length).to.equal(valueBets.length);
                            expect(valueBets.filter(function (valueBet) { return valueBet.betOffer; }).length).to.equal(valueBets.length);
                            return [2 /*return*/];
                    }
                });
            });
        });
        it('should skip bad api responses', function () {
            return __awaiter(this, void 0, void 0, function () {
                var apiData, fakeScraper, service, sportEventsInService;
                return __generator(this, function (_a) {
                    apiData = {
                        "UNIBET_BELGIUM": [
                            new scraper_1.ApiResponse(betoffer_1.Bookmaker.UNIBET_BELGIUM, { "shitty": 123 }, betoffer_1.RequestType.BET_OFFER, betoffer_1.IdType.BET_OFFER),
                            new scraper_1.ApiResponse(betoffer_1.Bookmaker.UNIBET_BELGIUM, { "shitty": 123 }, betoffer_1.RequestType.BET_OFFER, betoffer_1.IdType.BET_OFFER),
                        ],
                        "PINNACLE": [
                            new scraper_1.ApiResponse(betoffer_1.Bookmaker.PINNACLE, { "shitty": 123 }, betoffer_1.RequestType.BET_OFFER, betoffer_1.IdType.BET_OFFER),
                        ]
                    };
                    fakeScraper = new scraper_1.FakeScraper(apiData);
                    service = new valuebet_service_1.ValueBetService(fakeScraper, sportEvents);
                    service.searchForValueBets();
                    sportEventsInService = service.sportEvents;
                    expect(sportEventsInService.filter(function (sportEvent) { return !sportEvent.betOffers[betoffer_1.Bookmaker.UNIBET_BELGIUM]; }).length)
                        .is.equal(sportEventsInService.length);
                    return [2 /*return*/];
                });
            });
        });
        it('should skip betoffers with no bet type', function () {
            return __awaiter(this, void 0, void 0, function () {
                var betOffer_unibet, apiData, fakeScraper, service, sportEventsInService;
                return __generator(this, function (_a) {
                    betOffer_unibet = {
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
                    };
                    apiData = {
                        "UNIBET_BELGIUM": [
                            new scraper_1.ApiResponse(betoffer_1.Bookmaker.UNIBET_BELGIUM, betOffer_unibet, betoffer_1.RequestType.BET_OFFER, betoffer_1.IdType.BET_OFFER)
                        ]
                    };
                    fakeScraper = new scraper_1.FakeScraper(apiData);
                    service = new valuebet_service_1.ValueBetService(fakeScraper, sportEvents);
                    service.searchForValueBets();
                    sportEventsInService = service.sportEvents;
                    expect(sportEventsInService.filter(function (sportEvent) { return !sportEvent.betOffers[betoffer_1.Bookmaker.UNIBET_BELGIUM]; }).length)
                        .is.equal(sportEventsInService.length);
                    return [2 /*return*/];
                });
            });
        });
    });
    describe('constructor', function () {
        it('should skip sport events without participants or start date', function () {
            return __awaiter(this, void 0, void 0, function () {
                var sportEvents, fakeScraper, service, sportEventsInService, bookmakerEventCache;
                return __generator(this, function (_a) {
                    sportEvents = [
                        new betoffer_1.SportEvent(new Date(), betoffer_1.CompetitionName.JUPILER_PRO_LEAGUE, betoffer_1.SportName.FOOTBALL, [], {}, {}, null),
                        new betoffer_1.SportEvent(new Date(), betoffer_1.CompetitionName.JUPILER_PRO_LEAGUE, betoffer_1.SportName.FOOTBALL, [], {}, {}, []),
                        new betoffer_1.SportEvent(null, betoffer_1.CompetitionName.JUPILER_PRO_LEAGUE, betoffer_1.SportName.FOOTBALL, [], {}, {}, [1, 2])
                    ];
                    fakeScraper = new scraper_1.FakeScraper({});
                    service = new valuebet_service_1.ValueBetService(fakeScraper, sportEvents);
                    sportEventsInService = service.sportEvents;
                    bookmakerEventCache = service.bookmakerEventCache;
                    expect(sportEventsInService.length).is.equal(0);
                    expect(bookmakerEventCache.length).is.equal(0);
                    return [2 /*return*/];
                });
            });
        });
        it('it should skip bookmaker mapping when no event map', function () {
            return __awaiter(this, void 0, void 0, function () {
                var sportEvents, fakeScraper, service, sportEventsInService, bookmakerEventCache;
                return __generator(this, function (_a) {
                    sportEvents = [
                        new betoffer_1.SportEvent(new Date(), betoffer_1.CompetitionName.JUPILER_PRO_LEAGUE, betoffer_1.SportName.FOOTBALL, [], {}, {}, [config_1.jupilerProLeagueParticipants[0], config_1.jupilerProLeagueParticipants[1]]),
                    ];
                    fakeScraper = new scraper_1.FakeScraper({});
                    service = new valuebet_service_1.ValueBetService(fakeScraper, sportEvents);
                    sportEventsInService = service.sportEvents;
                    bookmakerEventCache = service.bookmakerEventCache;
                    expect(sportEventsInService.length).is.equal(1);
                    expect(bookmakerEventCache.length).is.equal(0);
                    return [2 /*return*/];
                });
            });
        });
    });
});
