"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.ApiResponse = exports.FakeScraper = exports.Scraper = void 0;
var betoffer_1 = require("../domain/betoffer");
var config_1 = require("./config");
var axios_1 = require("axios");
var token_1 = require("./sbtech/token");
var leagues_1 = require("./bet90/leagues");
var Scraper = /** @class */ (function () {
    function Scraper() {
        this._sbtechTokenRepository = new token_1.SbtechTokenRepository();
    }
    Scraper.prototype.getBetOffers = function (sportName, competition) {
        return __awaiter(this, void 0, void 0, function () {
            var sport, requests;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sport = config_1.sports.filter(function (sport) { return sport.name === sportName; })[0];
                        requests = this.toApiRequests(sport.bookmakerIds, betoffer_1.RequestType.BET_OFFER);
                        return [4 /*yield*/, this.getApiResponses(requests.flat())];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Scraper.prototype.getParticipants = function (sportName, competitionName) {
        return __awaiter(this, void 0, void 0, function () {
            var requests;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        requests = config_1.sports.filter(function (sport) { return sport.name === sportName; })
                            .map(function (sport) { return sport.competitions; }).flat()
                            .filter(function (competition) { return competition.name === competitionName; })
                            .map(function (competition) { return _this.toApiRequests(competition.bookmakerIds, betoffer_1.RequestType.PARTICIPANT); });
                        return [4 /*yield*/, this.getApiResponses(requests.flat())];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Scraper.prototype.getEvents = function (bookmaker, sportName, competitionName) {
        return __awaiter(this, void 0, void 0, function () {
            var requests;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        requests = config_1.sports.filter(function (sport) { return sport.name === sportName; })
                            .map(function (sport) { return sport.competitions; }).flat()
                            .filter(function (competition) { return competition.name === competitionName; })
                            .map(function (competition) { return _this.toApiRequests(competition.bookmakerIds, betoffer_1.RequestType.EVENT); });
                        return [4 /*yield*/, this.getApiResponses(requests)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Scraper.prototype.toApiRequests = function (bookmakerIds, requestType) {
        var _this = this;
        return bookmakerIds.map(function (bookmakerId) {
            switch (bookmakerId.bookmaker) {
                case betoffer_1.Bookmaker.UNIBET_BELGIUM:
                    return _this.toKambiRequests(bookmakerId, requestType);
                case betoffer_1.Bookmaker.NAPOLEON_GAMES:
                    return _this.toKambiRequests(bookmakerId, requestType);
                case betoffer_1.Bookmaker.PINNACLE:
                    return _this.toPinnacleRequests(bookmakerId, requestType);
                case betoffer_1.Bookmaker.BET777:
                    return _this.toSbtechRequests(bookmakerId, requestType);
                case betoffer_1.Bookmaker.BETFIRST:
                    return _this.toSbtechRequests(bookmakerId, requestType);
                case betoffer_1.Bookmaker.GOLDEN_PALACE:
                    return _this.toAltenarRequests(bookmakerId, requestType);
                case betoffer_1.Bookmaker.BET90:
                    return _this.toBet90Requests(bookmakerId, requestType);
            }
        });
    };
    Scraper.prototype.toBet90Requests = function (bookmakerId, requestType) {
        var headers = {
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/json; charset=UTF-8',
            }
        };
        var map = leagues_1.bet90Map.filter(function (key) { return key.id === parseInt(bookmakerId.id); })[0];
        var body = { leagueId: bookmakerId.id, categoryId: map.categoryId, sportId: map.sport };
        return [axios_1.default.post('https://bet90.be/Sports/SportLeagueGames', body, headers)
                .then(function (response) { return new ApiResponse(bookmakerId.bookmaker, response.data, requestType, bookmakerId.idType); })
                .catch(function (error) { return new ApiResponse(bookmakerId.bookmaker, null, requestType, bookmakerId.idType); })];
    };
    Scraper.prototype.toAltenarRequests = function (bookmakerId, requestType) {
        var url = 'https://sb1capi-altenar.biahosted.com/Sportsbook/GetEvents?timezoneOffset=-60&langId=1' +
            '&skinName=goldenpalace&configId=1&culture=en-GB&deviceType=Mobile&numformat=en&sportids=0&categoryids=0' +
            '&champids=' + bookmakerId.id + '&group=AllEvents&period=periodall&withLive=false&outrightsDisplay=none' +
            '&couponType=0&startDate=2020-04-11T08%3A28%3A00.000Z&endDate=2200-04-18T08%3A27%3A00.000Z';
        return [axios_1.default.get(url)
                .then(function (response) { return new ApiResponse(bookmakerId.bookmaker, response.data, requestType, bookmakerId.idType); })
                .catch(function (error) { return new ApiResponse(bookmakerId.bookmaker, null, requestType, bookmakerId.idType); })];
    };
    Scraper.prototype.toPinnacleRequests = function (bookmakerId, requestType) {
        var requestConfig = {
            headers: {
                "X-API-Key": "CmX2KcMrXuFmNg6YFbmTxE0y9CIrOi0R",
                "Referer": "https://www.pinnacle.com/",
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        };
        var url = 'https://guest.api.arcadia.pinnacle.com/0.1/' + (bookmakerId.idType === betoffer_1.IdType.SPORT ?
            'sports/' : 'leagues/') + bookmakerId.id + (requestType === betoffer_1.RequestType.EVENT || requestType === betoffer_1.RequestType.PARTICIPANT
            ? '/matchups' : '/markets/straight?primaryOnly=true');
        return [
            axios_1.default.get(url, requestConfig).then(function (response) { return new ApiResponse(bookmakerId.bookmaker, response.data, requestType, bookmakerId.idType); })
                .catch(function (error) { return new ApiResponse(bookmakerId.bookmaker, null, requestType, bookmakerId.idType); })
        ];
    };
    Scraper.prototype.toKambiRequests = function (bookmakerId, requestType) {
        var kambiBetOfferTypes = {};
        kambiBetOfferTypes[betoffer_1.BetType._1X2] = 2;
        kambiBetOfferTypes[betoffer_1.BetType.OVER_UNDER] = 6;
        var kambiBooks = {};
        kambiBooks[betoffer_1.Bookmaker.UNIBET_BELGIUM] = 'ubbe';
        kambiBooks[betoffer_1.Bookmaker.NAPOLEON_GAMES] = 'ngbe';
        var bookmaker = bookmakerId.bookmaker;
        var groupId = bookmakerId.id;
        switch (requestType) {
            case betoffer_1.RequestType.BET_OFFER:
                return Object.keys(kambiBetOfferTypes).map(function (key) {
                    var betOfferType = kambiBetOfferTypes[key];
                    return [axios_1.default.get('https://eu-offering.kambicdn.org/offering/v2018/' + kambiBooks[bookmaker] + '/betoffer/group/'
                            + groupId + '.json?type=' + betOfferType).then(function (response) { return new ApiResponse(bookmaker, response.data, requestType, bookmakerId.idType); })
                            .catch(function (error) { return new ApiResponse(bookmaker, null, requestType, bookmakerId.idType); })];
                });
            default:
                return [
                    axios_1.default('https://eu-offering.kambicdn.org/offering/v2018/' + kambiBooks[bookmaker] + '/event/group/'
                        + groupId + '.json?includeParticipants=true')
                        .then(function (response) { return new ApiResponse(bookmaker, response.data, requestType, bookmakerId.idType); })
                        .catch(function (error) { return new ApiResponse(bookmaker, null, requestType, bookmakerId.idType); })
                ];
        }
    };
    Scraper.prototype.toSbtechRequests = function (bookmakerId, requestType) {
        var _this = this;
        var tokenData = [
            new SbtechTokenRequest(betoffer_1.Bookmaker.BET777, 'https://sbapi.sbtech.com/bet777/auth/platform/v1/api/GetTokenBySiteId/72', SbtechApi.V1),
            new SbtechTokenRequest(betoffer_1.Bookmaker.BETFIRST, 'https://sbapi.sbtech.com/bet777/auth/platform/v1/api/GetTokenBySiteId/28', SbtechApi.V1),
        ];
        var id = bookmakerId.id;
        var pages = [
            { "eventState": "Mixed", "eventTypes": ["Fixture"], "ids": [id], "pagination": { "top": 300, "skip": 0 } },
            { "eventState": "Mixed", "eventTypes": ["Fixture"], "ids": [id], "pagination": { "top": 300, "skip": 300 } },
            { "eventState": "Mixed", "eventTypes": ["Fixture"], "ids": [id], "pagination": { "top": 300, "skip": 600 } },
            { "eventState": "Mixed", "eventTypes": ["Fixture"], "ids": [id], "pagination": { "top": 300, "skip": 900 } },
            { "eventState": "Mixed", "eventTypes": ["Fixture"], "ids": [id], "pagination": { "top": 300, "skip": 1200 } },
            { "eventState": "Mixed", "eventTypes": ["Fixture"], "ids": [id], "pagination": { "top": 300, "skip": 1500 } },
        ];
        var tokenRequest = tokenData.filter(function (data) { return data.bookmaker === bookmakerId.bookmaker; })[0];
        return pages.map(function (page) {
            if (requestType === betoffer_1.RequestType.BET_OFFER) {
                page["marketTypeRequests"] = [{ "marketTypeIds": ["1_0", "1_39", "2_0", "2_39", "3_0", "3_39"] }];
            }
            if (tokenRequest.api === SbtechApi.V2) {
                return axios_1.default.get(tokenRequest.url).then(function (res) { return _this.toSbtechBetOfferRequest(bookmakerId, res.data.token, page, requestType); })
                    .catch(function (error) { return null; });
            }
            else {
                return axios_1.default.get(tokenRequest.url).then(function (res) { return _this.toSbtechBetOfferRequest(bookmakerId, res.data.split('ApiAccessToken = \'')[1].replace('\'', ''), page, requestType); }).catch(function (error) { return null; });
            }
        });
    };
    Scraper.prototype.toSbtechBetOfferRequest = function (bookmakerId, token, page, requestType) {
        var headers = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
                'locale': 'en'
            }
        };
        return axios_1.default.post('https://sbapi.sbtech.com/' + bookmakerId.bookmaker +
            '/sportscontent/sportsbook/v1/Events/' + (bookmakerId.idType === betoffer_1.IdType.SPORT ? 'GetBySportId' : 'GetByLeagueId'), page, headers)
            .then(function (response) { return new ApiResponse(bookmakerId.bookmaker, response.data, requestType, bookmakerId.idType); })
            .catch(function (error) {
            return new ApiResponse(bookmakerId.bookmaker, null, requestType, bookmakerId.idType);
        });
    };
    Scraper.prototype.getApiResponses = function (requests) {
        return __awaiter(this, void 0, void 0, function () {
            var apiResponses;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        apiResponses = [];
                        if (!requests) return [3 /*break*/, 2];
                        return [4 /*yield*/, Promise.all(requests.flat().filter(function (x) { return x; })).then(function (responses) {
                                responses.forEach(function (response) {
                                    apiResponses.push(response);
                                });
                            })];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/, apiResponses];
                }
            });
        });
    };
    return Scraper;
}());
exports.Scraper = Scraper;
var FakeScraper = /** @class */ (function (_super) {
    __extends(FakeScraper, _super);
    function FakeScraper(testData) {
        var _this = _super.call(this) || this;
        _this._testData = testData;
        return _this;
    }
    FakeScraper.prototype.getBetOffers = function (sport, competition) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, [
                        this._testData[betoffer_1.Bookmaker.UNIBET_BELGIUM],
                        this._testData[betoffer_1.Bookmaker.PINNACLE]
                    ].flat()];
            });
        });
    };
    return FakeScraper;
}(Scraper));
exports.FakeScraper = FakeScraper;
var ApiResponse = /** @class */ (function () {
    function ApiResponse(bookmaker, data, requestType, idType) {
        this._bookmaker = bookmaker;
        this._data = data;
        this._idType = idType;
        this._requestType = requestType;
    }
    Object.defineProperty(ApiResponse.prototype, "bookmaker", {
        get: function () {
            return this._bookmaker;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ApiResponse.prototype, "data", {
        get: function () {
            return this._data;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ApiResponse.prototype, "requestType", {
        get: function () {
            return this._requestType;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ApiResponse.prototype, "idType", {
        get: function () {
            return this._idType;
        },
        enumerable: false,
        configurable: true
    });
    return ApiResponse;
}());
exports.ApiResponse = ApiResponse;
var SbtechTokenRequest = /** @class */ (function () {
    function SbtechTokenRequest(bookmaker, url, api) {
        this._bookmaker = bookmaker;
        this._url = url;
        this._api = api;
    }
    Object.defineProperty(SbtechTokenRequest.prototype, "bookmaker", {
        get: function () {
            return this._bookmaker;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SbtechTokenRequest.prototype, "url", {
        get: function () {
            return this._url;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SbtechTokenRequest.prototype, "api", {
        get: function () {
            return this._api;
        },
        enumerable: false,
        configurable: true
    });
    return SbtechTokenRequest;
}());
var SbtechApi;
(function (SbtechApi) {
    SbtechApi["V1"] = "V1";
    SbtechApi["V2"] = "V2";
})(SbtechApi || (SbtechApi = {}));
