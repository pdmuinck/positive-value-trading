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
exports.SbtechToken = exports.SbtechTokenRepository = void 0;
var betoffer_1 = require("../../domain/betoffer");
var axios = require('axios');
var NodeCache = require('node-cache');
var ttlSeconds = 60 * 60 * 30;
var SbtechTokenRepository = /** @class */ (function () {
    function SbtechTokenRepository() {
        this._tokenUrls = [
            new SbtechTokenRequest(betoffer_1.Bookmaker.BET777, 'https://sbapi.sbtech.com/bet777/auth/platform/v1/api/GetTokenBySiteId/72', SbtechApi.V1),
            new SbtechTokenRequest(betoffer_1.Bookmaker.BETFIRST, 'https://sbapi.sbtech.com/bet777/auth/platform/v1/api/GetTokenBySiteId/28', SbtechApi.V1),
        ];
        this._tokenCache = new NodeCache({ stdTTL: ttlSeconds, checkperiod: ttlSeconds * 0.2, useClones: false });
    }
    SbtechTokenRepository.prototype.getToken = function (bookmaker) {
        return __awaiter(this, void 0, void 0, function () {
            var token, requests, sbtechTokenRequest, token_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        token = this._tokenCache.get(bookmaker);
                        console.log(token);
                        if (!!token) return [3 /*break*/, 2];
                        requests = [];
                        sbtechTokenRequest = this._tokenUrls.filter(function (request) { return request.bookmaker === bookmaker; })[0];
                        if (sbtechTokenRequest.api === SbtechApi.V2) {
                            requests.push(axios.get(sbtechTokenRequest.url).then(function (res) { return res.data.token; }).catch(function (error) { return null; }));
                        }
                        else {
                            requests.push(axios.get(sbtechTokenRequest.url).then(function (res) { return res.data.split('ApiAccessToken = \'')[1].replace('\'', ''); }).catch(function (error) { return null; }));
                        }
                        return [4 /*yield*/, Promise.all(requests).then(function (values) {
                                token_1 = values[0];
                            })];
                    case 1:
                        _a.sent();
                        if (token_1) {
                            this._tokenCache.set(bookmaker, token_1);
                            return [2 /*return*/, token_1];
                        }
                        return [3 /*break*/, 3];
                    case 2: return [2 /*return*/, token];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return SbtechTokenRepository;
}());
exports.SbtechTokenRepository = SbtechTokenRepository;
var SbtechToken = /** @class */ (function () {
    function SbtechToken(bookmaker, token) {
        this._bookmaker = bookmaker;
        this._token = token;
    }
    Object.defineProperty(SbtechToken.prototype, "bookmaker", {
        get: function () {
            return this._bookmaker;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SbtechToken.prototype, "token", {
        get: function () {
            return this._token;
        },
        enumerable: false,
        configurable: true
    });
    return SbtechToken;
}());
exports.SbtechToken = SbtechToken;
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
/*
    "YOUBET": {name: 'youbet', tokenUrl: 'https://api.play-gaming.com/authentication/v1/api/GetTokenBySiteId/161', dataUrl: 'https://sbapi.sbtech.com/youbet/sportscontent/sportsbook/v1/Events/getBySportId'},
    "BETFIRST": {oddsUrl: 'https://sbapi.sbtech.com/betfirst/sportscontent/sportsbook/v1/Events/getByEventId', name: 'betfirst', licenses: ['BE'], tokenUrl: 'https://sbapi.sbtech.com/betfirst/auth/platform/v1/api/GetTokenBySiteId/28', dataUrl: 'https://sbapi.sbtech.com/betfirst/sportscontent/sportsbook/v1/Events/getBySportId'},
    "BET777": {oddsUrl: 'https://sbapi.sbtech.com/bet777/sportscontent/sportsbook/v1/Events/getByEventId', name: 'bet777', licenses: ['BE'], tokenUrl: 'https://sbapi.sbtech.com/bet777/auth/platform/v1/api/GetTokenBySiteId/72', dataUrl: 'https://sbapi.sbtech.com/bet777/sportscontent/sportsbook/v1/Events/getBySportId'},
    "BETHARD": {name: 'bethard', tokenUrl: 'https://sbapi.sbtech.com/bet777/auth/platform/v1/api/GetTokenBySiteId/99', dataUrl: 'https://sbapi.sbtech.com/bethard/sportscontent/sportsbook/v1/Events/getBySportId'},
    //"GANABET": {name: 'ganabet', tokenUrl: 'https://api.play-gaming.com/auth/v2/getTokenBySiteId/35', dataUrl: 'https://sbapi.sbtech.com/ganabet/sportscontent/sportsbook/v1/Events/getBySportId'},
    "VIRGIN_BET": {api: 'V2', name: 'virginbet', tokenUrl: 'https://api.play-gaming.com/auth/v2/getTokenBySiteId/227', dataUrl: 'https://sbapi.sbtech.com/virginbet/sportscontent/sportsbook/v1/Events/getBySportId'},
    "ETOTO": {name: 'etoto', country: 'PL', tokenUrl: 'https://api.play-gaming.com/auth/v1/api/getTokenBySiteId/159', dataUrl: 'https://sbapi.sbtech.com/etoto/sportscontent/sportsbook/v1/Events/getBySportId'},
    "10BET": {name: '10betuk', licenses: ['UK'], tokenUrl: 'https://api.play-gaming.com/authentication/v1/api/GetTokenBySiteId/1', dataUrl: 'https://sbapi.sbtech.com/10betuk/sportscontent/sportsbook/v1/Events/getBySportId'},
    "NETBET": {name: 'netbet', licenses: ['UK'], tokenUrl: 'https://api.play-gaming.com/authentication/v1/api/GetTokenBySiteId/31', dataUrl: 'https://sbapi.sbtech.com/netbet/sportscontent/sportsbook/v1/Events/getBySportId'},
    "WINMASTERS": {name: 'winmasters', licenses: ['UK'], tokenUrl: 'https://api.play-gaming.com/authentication/v1/api/GetTokenBySiteId/117', dataUrl: 'https://sbapi.sbtech.com/winmasters/sportscontent/sportsbook/v1/Events/getBySportId'},
    "KARAMBA": {api: 'V2', name: 'aspireglobal', country: '', tokenUrl: 'https://api.play-gaming.com/auth/v2/getTokenBySiteId/148', dataUrl: 'https://sbapi.sbtech.com/aspireglobal/sportscontent/sportsbook/v1/Events/getBySportId'},
    "HOPA": {api: 'V2', name: 'aspireglobal', licenses: ['UK', 'Malta'], tokenUrl: 'https://api.play-gaming.com/auth/v2/getTokenBySiteId/148', dataUrl: 'https://sbapi.sbtech.com/aspireglobal/sportscontent/sportsbook/v1/Events/getBySportId'},
    "SPORT_NATION": {api:'V2', name: 'sportnation', licenses: ['UK'], tokenUrl: 'https://api.play-gaming.com/auth/v2/getTokenBySiteId/154', dataUrl: 'https://sbapi.sbtech.com/sportnation/sportscontent/sportsbook/v1/Events/getBySportId'},
    "RED_ZONE_SPORTS": {api:'V2', name: 'redzonesports', licenses: ['UK'], tokenUrl: 'https://api.play-gaming.com/auth/v2/getTokenBySiteId/155',dataUrl: 'https://sbapi.sbtech.com/redzonesports/sportscontent/sportsbook/v1/Events/getBySportId'},
    "MR_PLAY": {api:'V2', name: 'mrplay', licenses: ['UK'], tokenUrl: 'https://api.play-gaming.com/auth/v2/getTokenBySiteId/333', dataUrl: 'https://sbapi.sbtech.com/mrplay/sportscontent/sportsbook/v1/Events/getBySportId'},
    "MANSION_BET": {name: 'mansionuk', licenses: ['UK'],  tokenUrl: 'https://api.play-gaming.com/authentication/v1/api/GetTokenBySiteId/179', dataUrl: 'https://sbapi.sbtech.com/mansionuk/sportscontent/sportsbook/v1/Events/getBySportId'},
    "SAZKA": {api:'V2', name: 'sazka', licenses: ['CZ'], tokenUrl: 'https://api.play-gaming.com/auth/v2/getTokenBySiteId/96', dataUrl: 'https://sbapi.sbtech.com/sazka/sportscontent/sportsbook/v1/Events/getBySportId'},
    //"LUCKIA": {api: 'V2', name: 'luckia', licenses: ['ES'], tokenUrl: 'https://api.play-gaming.com/authentication/v1/api/GetTokenBySiteId/106', dataUrl: 'https://sbapi.sbtech.com/luckia/sportscontent/sportsbook/v1/Events/getBySportId'},
    "OREGON_LOTTERY": {api: 'V2', name: 'oregonlottery', licenses: ['US'], tokenUrl: 'https://api-orp.sbtech.com/auth/v2/getTokenBySiteId/15002', dataUrl: 'https://api-orp.sbtech.com/oregonlottery/sportscontent/sportsbook/v1/Events/GetBySportId'},
    "BETPT": {api: 'V2', name: 'betpt', licenses: ['PT'], tokenUrl: 'https://api.play-gaming.com/auth/v2/getTokenBySiteId/85', dataUrl: 'https://sbapi.sbtech.com/betpt/sportscontent/sportsbook/v1/Events/getBySportId'}
*/ 
