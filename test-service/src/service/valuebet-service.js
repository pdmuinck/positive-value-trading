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
exports.ValueBetService = void 0;
var betoffer_1 = require("../domain/betoffer");
var parser_1 = require("./parser");
var NodeCache = require('node-cache');
var ttlSeconds = 60 * 1 * 1;
var ValueBetService = /** @class */ (function () {
    function ValueBetService(scraper, sportEvents) {
        var _this = this;
        this._sportEventsCache = new NodeCache({ stdTTL: ttlSeconds * 60 * 24, checkperiod: ttlSeconds * 0.2, useClones: false });
        this._bookmakerEventIdCache = new NodeCache({ stdTTL: ttlSeconds * 60 * 24, checkperiod: ttlSeconds * 0.2, useClones: false });
        this._scraper = scraper;
        sportEvents.forEach(function (sportEvent) {
            if (sportEvent.startDateTime && sportEvent.participants && sportEvent.participants.length == 2) {
                var eventKey_1 = [sportEvent.startDateTime, sportEvent.participants.map(function (participant) { return participant.name; }).join(';')].join(';');
                _this._sportEventsCache.set(eventKey_1, sportEvent);
                sportEvent.bookmakerIds.forEach(function (bookmakerId) {
                    _this._bookmakerEventIdCache.set([bookmakerId.bookmaker, bookmakerId.id].join(';'), eventKey_1);
                });
            }
        });
    }
    ValueBetService.prototype.searchForValueBets = function () {
        return __awaiter(this, void 0, void 0, function () {
            var apiResponses, betOffers, sportEvents, valueBets;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._scraper.getBetOffers(betoffer_1.SportName.FOOTBALL)];
                    case 1:
                        apiResponses = _a.sent();
                        betOffers = apiResponses.map(function (apiResponse) { return parser_1.Parser.parse(apiResponse); }).flat();
                        betOffers.forEach(function (betOffer) {
                            if (betOffer && betOffer.betType) {
                                var eventKey = _this._bookmakerEventIdCache.get([betOffer.bookMaker, betOffer.eventId].join(';'));
                                if (eventKey) {
                                    var sportEvent = _this._sportEventsCache.get(eventKey);
                                    sportEvent.registerBetOffer(betOffer);
                                    _this._sportEventsCache.set(eventKey, sportEvent);
                                }
                            }
                        });
                        sportEvents = Object.values(this._sportEventsCache.mget(this._sportEventsCache.keys()));
                        valueBets = sportEvents.map(function (sportEvent) { return sportEvent.detectValueBets(); }).flat();
                        // produce kafka messages
                        return [2 /*return*/, valueBets];
                }
            });
        });
    };
    Object.defineProperty(ValueBetService.prototype, "sportEvents", {
        get: function () {
            return Object.values(this._sportEventsCache.mget(this._sportEventsCache.keys()));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ValueBetService.prototype, "bookmakerEventCache", {
        get: function () {
            return Object.values(this._bookmakerEventIdCache.mget(this._bookmakerEventIdCache.keys()));
        },
        enumerable: false,
        configurable: true
    });
    // serves an endpoint to get value bets
    ValueBetService.prototype.getValueBets = function () {
    };
    return ValueBetService;
}());
exports.ValueBetService = ValueBetService;
