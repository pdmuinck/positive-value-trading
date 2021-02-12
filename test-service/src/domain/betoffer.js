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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValueBetFoundEvent = exports.Provider = exports.Bookmaker = exports.BetType = exports.BetOffer = exports.CompetitionName = exports.ClosingLineRegistered = exports.BetOfferRegistered = exports.Participant = exports.TradedBetOffer = exports.PerformanceMetric = exports.SportEvent = exports.ParticipantName = exports.BookmakerId = exports.Competition = exports.SportName = exports.RequestType = exports.IdType = exports.Sport = void 0;
var Sport = /** @class */ (function () {
    function Sport(name, bookmakerIds, competitions) {
        this._name = name;
        this._bookmakerIds = bookmakerIds;
        this._competitions = competitions;
    }
    Object.defineProperty(Sport.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Sport.prototype, "bookmakerIds", {
        get: function () {
            return this._bookmakerIds;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Sport.prototype, "competitions", {
        get: function () {
            return this._competitions;
        },
        enumerable: false,
        configurable: true
    });
    return Sport;
}());
exports.Sport = Sport;
var IdType;
(function (IdType) {
    IdType["BET_OFFER"] = "BET_OFFER";
    IdType["PARTICIPANT"] = "PARTICIPANT";
    IdType["EVENT"] = "EVENT";
    IdType["COMPETITION"] = "COMPETITION";
    IdType["SPORT"] = "SPORT";
})(IdType = exports.IdType || (exports.IdType = {}));
var RequestType;
(function (RequestType) {
    RequestType["BET_OFFER"] = "BET_OFFER";
    RequestType["EVENT"] = "EVENT";
    RequestType["PARTICIPANT"] = "PARTICIPANT";
})(RequestType = exports.RequestType || (exports.RequestType = {}));
var SportName;
(function (SportName) {
    SportName["FOOTBALL"] = "FOOTBALL";
})(SportName = exports.SportName || (exports.SportName = {}));
var Competition = /** @class */ (function () {
    function Competition(name, bookmakerIds, participants) {
        this._name = name;
        this._bookmakerIds = bookmakerIds;
        this._participants = participants;
    }
    Object.defineProperty(Competition.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Competition.prototype, "bookmakerIds", {
        get: function () {
            return this._bookmakerIds;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Competition.prototype, "participants", {
        get: function () {
            return this._participants;
        },
        enumerable: false,
        configurable: true
    });
    return Competition;
}());
exports.Competition = Competition;
var BookmakerId = /** @class */ (function () {
    function BookmakerId(bookmaker, id, idType) {
        this._bookmaker = bookmaker;
        this._id = id;
        this._idType = idType;
    }
    Object.defineProperty(BookmakerId.prototype, "bookmaker", {
        get: function () {
            return this._bookmaker;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BookmakerId.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BookmakerId.prototype, "idType", {
        get: function () {
            return this._idType;
        },
        enumerable: false,
        configurable: true
    });
    return BookmakerId;
}());
exports.BookmakerId = BookmakerId;
var ParticipantName;
(function (ParticipantName) {
    ParticipantName["NOT_FOUND"] = "Not Found";
    ParticipantName["CLUB_BRUGGE"] = "Club Brugge KV";
    ParticipantName["ANDERLECHT"] = "R.S.C Anderlecht";
    ParticipantName["STANDARD_LIEGE"] = "Standard Li\u00E8ge";
    ParticipantName["MOESKROEN"] = "Royal Excel Mouscron";
    ParticipantName["CERCLE_BRUGGE"] = "Cercle Brugge K.S.V.";
    ParticipantName["SINT_TRUIDEN"] = "Sint-Truidense V.V.";
    ParticipantName["OHL"] = "Oud-Heverlee Leuven";
    ParticipantName["BEERSCHOT"] = "K Beerschot VA";
    ParticipantName["EUPEN"] = "K.A.S. Eupen";
    ParticipantName["GENT"] = "K.A.A. Gent";
    ParticipantName["GENK"] = "K.R.C. Genk";
    ParticipantName["ANTWERP"] = "Royal Antwerp F.C.";
    ParticipantName["WAASLAND_BEVEREN"] = "Waasland-Beveren";
    ParticipantName["CHARLEROI"] = "R. Charleroi S.C.";
    ParticipantName["OOSTENDE"] = "K.V. Oostende";
    ParticipantName["ZULTE_WAREGEM"] = "S.V. Zulte Waregem";
    ParticipantName["KORTRIJK"] = "K.V. Kortrijk";
    ParticipantName["MECHELEN"] = "K.V. Mechelen";
})(ParticipantName = exports.ParticipantName || (exports.ParticipantName = {}));
var SportEvent = /** @class */ (function () {
    function SportEvent(startDateTime, competition, sport, bookmakerIds, betOffers, closingLines, participants) {
        this._startDateTime = startDateTime;
        this._betOffers = betOffers;
        this._bookmakerIds = bookmakerIds;
        this._sport = sport;
        this._competition = competition;
        this._betOffers = betOffers;
        this._closingLines = closingLines;
        this._participants = participants;
    }
    Object.defineProperty(SportEvent.prototype, "startDateTime", {
        get: function () {
            return this._startDateTime;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SportEvent.prototype, "competition", {
        get: function () {
            return this._competition;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SportEvent.prototype, "sport", {
        get: function () {
            return this._sport;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SportEvent.prototype, "bookmakerIds", {
        get: function () {
            return this._bookmakerIds;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SportEvent.prototype, "betOffers", {
        get: function () {
            return this._betOffers;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SportEvent.prototype, "closingLines", {
        get: function () {
            return this._closingLines;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SportEvent.prototype, "participants", {
        get: function () {
            return this._participants;
        },
        enumerable: false,
        configurable: true
    });
    SportEvent.prototype.registerBetOffer = function (betOffer) {
        return this.registerBetOfferInCollection(betOffer, this._betOffers);
    };
    SportEvent.prototype.registerClosingLine = function (betOffer) {
        return this.registerBetOfferInCollection(betOffer, this._closingLines);
    };
    SportEvent.prototype.registerBetOfferInCollection = function (betOffer, betOfferCollection) {
        if (this._bookmakerIds.map(function (bookmakerId) { return bookmakerId.id; }).flat().includes(betOffer.eventId.toString())) {
            var key = betOffer.key;
            var betOffers = betOfferCollection[key];
            if (betOffers) {
                betOffers[betOffer.bookMaker] = betOffer;
                betOfferCollection[key] = betOffers;
            }
            else {
                var toRegister = {};
                toRegister[betOffer.bookMaker] = betOffer;
                betOfferCollection[key] = toRegister;
            }
            return new BetOfferRegistered(betOffer);
        }
    };
    SportEvent.prototype.detectValueBets = function (betOfferKey) {
        var _this = this;
        if (betOfferKey) {
            return this.findValue(betOfferKey);
        }
        else {
            var foundValueBets_1 = [];
            Object.keys(this._betOffers).forEach(function (betOfferKey) {
                var valueBets = _this.findValue(betOfferKey);
                if (valueBets)
                    foundValueBets_1.push(valueBets.filter(function (valueBet) { return valueBet; }));
            });
            return foundValueBets_1.flat();
        }
    };
    SportEvent.prototype.findValue = function (betOfferKey) {
        var _this = this;
        var pinnacleBetOffer = this._betOffers[betOfferKey][Bookmaker.PINNACLE];
        if (pinnacleBetOffer) {
            return Object.keys(this._betOffers[betOfferKey]).filter(function (bookmaker) { return bookmaker != Bookmaker.PINNACLE; })
                .map(function (bookmaker) {
                if (bookmaker != Bookmaker.PINNACLE) {
                    var betOffer = _this._betOffers[betOfferKey][bookmaker];
                    var value = (1 / pinnacleBetOffer.vigFreePrice * betOffer.price) - 1;
                    if (value > 0) {
                        return new ValueBetFoundEvent(betOffer, value);
                    }
                }
            });
        }
    };
    SportEvent.prototype.calculateMetrics = function (tradedBetOffer, closingLine) {
        if (closingLine.bookMaker === Bookmaker.PINNACLE) {
            // only check closing line pinnacle or other sharp, because that is the best guess of outcome game
            var realValue = (1 / closingLine.betOffer.vigFreePrice + tradedBetOffer.betOffer.price) - 1;
            return new PerformanceMetric(realValue, tradedBetOffer);
        }
    };
    return SportEvent;
}());
exports.SportEvent = SportEvent;
var PerformanceMetric = /** @class */ (function () {
    function PerformanceMetric(realValue, tradedBetOffer) {
        this._realValue = realValue;
        this._tradedBetOffer = tradedBetOffer;
    }
    Object.defineProperty(PerformanceMetric.prototype, "realValue", {
        get: function () {
            return this._realValue;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PerformanceMetric.prototype, "tradedBetOffer", {
        get: function () {
            return this._tradedBetOffer;
        },
        enumerable: false,
        configurable: true
    });
    return PerformanceMetric;
}());
exports.PerformanceMetric = PerformanceMetric;
var TradedBetOffer = /** @class */ (function () {
    function TradedBetOffer(stake, dateTimeOfTrade, betOffer, value) {
        this._stake = stake;
        this._dateTimeOfTrade = dateTimeOfTrade;
        this._betOffer = betOffer;
        this._value = value;
    }
    Object.defineProperty(TradedBetOffer.prototype, "stake", {
        get: function () {
            return this._stake;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TradedBetOffer.prototype, "dateTimeOfTrade", {
        get: function () {
            return this._dateTimeOfTrade;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TradedBetOffer.prototype, "betOffer", {
        get: function () {
            return this._betOffer;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TradedBetOffer.prototype, "value", {
        get: function () {
            return this._value;
        },
        enumerable: false,
        configurable: true
    });
    return TradedBetOffer;
}());
exports.TradedBetOffer = TradedBetOffer;
var Participant = /** @class */ (function () {
    function Participant(name, bookmakerIds) {
        this._name = name;
        this._bookmakerIds = bookmakerIds;
    }
    Object.defineProperty(Participant.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Participant.prototype, "bookmakerIds", {
        get: function () {
            return this._bookmakerIds;
        },
        enumerable: false,
        configurable: true
    });
    return Participant;
}());
exports.Participant = Participant;
var BetOfferRegistered = /** @class */ (function () {
    function BetOfferRegistered(betOffer) {
        this._betOffer = betOffer;
    }
    Object.defineProperty(BetOfferRegistered.prototype, "betOffer", {
        get: function () {
            return this._betOffer;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BetOfferRegistered.prototype, "bookMaker", {
        get: function () {
            return this._betOffer.bookMaker;
        },
        enumerable: false,
        configurable: true
    });
    return BetOfferRegistered;
}());
exports.BetOfferRegistered = BetOfferRegistered;
var ClosingLineRegistered = /** @class */ (function (_super) {
    __extends(ClosingLineRegistered, _super);
    function ClosingLineRegistered(betOffer) {
        return _super.call(this, betOffer) || this;
    }
    return ClosingLineRegistered;
}(BetOfferRegistered));
exports.ClosingLineRegistered = ClosingLineRegistered;
var CompetitionName;
(function (CompetitionName) {
    CompetitionName["JUPILER_PRO_LEAGUE"] = "JUPILER_PRO_LEAGUE";
    CompetitionName["SERIE_A"] = "SERIE_A";
    CompetitionName["LA_LIGA"] = "LA_LIGA";
    CompetitionName["BUNDESLIGA"] = "BUNDESLIGA";
    CompetitionName["PREMIER_LEAGUE"] = "PREMIER_LEAGUE";
    CompetitionName["EREDIVISIE"] = "EREDIVISIE";
    CompetitionName["LIGUE_1"] = "LIGUE_1";
})(CompetitionName = exports.CompetitionName || (exports.CompetitionName = {}));
var BetOffer = /** @class */ (function () {
    function BetOffer(betType, eventId, bookMaker, betOptionName, price, line, vigFreePrice) {
        this._betOptionName = betOptionName;
        this._price = price;
        this._line = line;
        this._betType = betType;
        this._eventId = eventId;
        this._bookMaker = bookMaker;
        this._vigFreePrice = vigFreePrice;
    }
    Object.defineProperty(BetOffer.prototype, "betOptionName", {
        get: function () {
            return this._betOptionName;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BetOffer.prototype, "price", {
        get: function () {
            return this._price;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BetOffer.prototype, "line", {
        get: function () {
            return this._line;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BetOffer.prototype, "betType", {
        get: function () {
            return this._betType;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BetOffer.prototype, "eventId", {
        get: function () {
            return this._eventId;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BetOffer.prototype, "bookMaker", {
        get: function () {
            return this._bookMaker;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BetOffer.prototype, "vigFreePrice", {
        get: function () {
            return this._vigFreePrice;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BetOffer.prototype, "key", {
        get: function () {
            return [this._betType, this._betOptionName, this._line].join(';');
        },
        enumerable: false,
        configurable: true
    });
    return BetOffer;
}());
exports.BetOffer = BetOffer;
var BetType;
(function (BetType) {
    BetType["_1X2"] = "1X2";
    BetType["DOUBLE_CHANCE"] = "DOUBLE_CHANCE";
    BetType["OVER_UNDER"] = "OVER_UNDER";
    BetType["HANDICAP"] = "HANDICAP";
    BetType["UNKNOWN"] = "UNKNOWN";
})(BetType = exports.BetType || (exports.BetType = {}));
var Bookmaker;
(function (Bookmaker) {
    Bookmaker["UNIBET_BELGIUM"] = "UNIBET_BELGIUM";
    Bookmaker["NAPOLEON_GAMES"] = "NAPOLEON_GAMES";
    Bookmaker["PINNACLE"] = "PINNACLE";
    Bookmaker["BETFIRST"] = "betfirst";
    Bookmaker["GOLDEN_PALACE"] = "goldenpalace";
    Bookmaker["BETCENTER"] = "BETCENTER";
    Bookmaker["LADBROKES"] = "LADBROKES";
    Bookmaker["MERIDIAN"] = "MERIDIAN";
    Bookmaker["BET777"] = "bet777";
    Bookmaker["BET90"] = "BET90";
    Bookmaker["MAGIC_BETTING"] = "MAGIC_BETTING";
    Bookmaker["STAR_CASINO"] = "STAR_CASINO";
    Bookmaker["SCOOORE"] = "SCOOORE";
    Bookmaker["CIRCUS"] = "CIRCUS";
    Bookmaker["STANLEYBET"] = "STANLEYBET";
})(Bookmaker = exports.Bookmaker || (exports.Bookmaker = {}));
var Provider = /** @class */ (function () {
    // private to disallow creating other instances of this type
    function Provider(key, bookmakers) {
        this.key = key;
        this.bookmakers = bookmakers;
    }
    Provider.prototype.toString = function () {
        return this.key;
    };
    Provider.keys = function () {
        return [this.KAMBI, this.SBTECH, this.OTHER];
    };
    Provider.KAMBI = new Provider('KAMBI', [Bookmaker.UNIBET_BELGIUM, Bookmaker.NAPOLEON_GAMES]);
    Provider.SBTECH = new Provider('SBTECH', [Bookmaker.BETFIRST, Bookmaker.BET777]);
    Provider.OTHER = new Provider('OTHER', [Bookmaker.BETCENTER, Bookmaker.BET90, Bookmaker.PINNACLE]);
    return Provider;
}());
exports.Provider = Provider;
var ValueBetFoundEvent = /** @class */ (function () {
    function ValueBetFoundEvent(betOffer, value) {
        this._betOffer = betOffer;
        this._value = value;
    }
    Object.defineProperty(ValueBetFoundEvent.prototype, "betOffer", {
        get: function () {
            return this._betOffer;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ValueBetFoundEvent.prototype, "value", {
        get: function () {
            return this._value;
        },
        enumerable: false,
        configurable: true
    });
    return ValueBetFoundEvent;
}());
exports.ValueBetFoundEvent = ValueBetFoundEvent;
