"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PinnacleParser = exports.Bet90Parser = exports.MeridianParser = exports.LadbrokesParser = exports.BetcenterParser = exports.AltenarParser = exports.SbtechParser = exports.KambiParser = exports.Parser = exports.Event = void 0;
var betoffer_1 = require("../domain/betoffer");
var mapper_1 = require("./mapper");
var parser = require('node-html-parser');
var Event = /** @class */ (function () {
    function Event(id, startTime, participants) {
        this._id = id;
        this._startTime = startTime;
        this._participants = participants;
    }
    Object.defineProperty(Event.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Event.prototype, "startTime", {
        get: function () {
            return this._startTime;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Event.prototype, "participants", {
        get: function () {
            return this._participants;
        },
        enumerable: false,
        configurable: true
    });
    return Event;
}());
exports.Event = Event;
var Parser = /** @class */ (function () {
    function Parser() {
    }
    Parser.parse = function (apiResponse) {
        if (apiResponse) {
            switch (apiResponse.bookmaker) {
                case betoffer_1.Bookmaker.BETCENTER:
                    return BetcenterParser.parse(apiResponse);
                case betoffer_1.Bookmaker.PINNACLE:
                    return PinnacleParser.parse(apiResponse);
                case betoffer_1.Bookmaker.UNIBET_BELGIUM:
                    return KambiParser.parse(apiResponse);
                case betoffer_1.Bookmaker.NAPOLEON_GAMES:
                    return KambiParser.parse(apiResponse);
                case betoffer_1.Bookmaker.GOLDEN_PALACE:
                    return AltenarParser.parse(apiResponse);
                case betoffer_1.Bookmaker.BETFIRST:
                    return SbtechParser.parse(apiResponse);
                case betoffer_1.Bookmaker.BET777:
                    return SbtechParser.parse(apiResponse);
                case betoffer_1.Bookmaker.LADBROKES:
                    return LadbrokesParser.parse(apiResponse);
                case betoffer_1.Bookmaker.MERIDIAN:
                    return MeridianParser.parse(apiResponse);
                case betoffer_1.Bookmaker.BET90:
                    return Bet90Parser.parse(apiResponse);
                default:
                    return [];
            }
        }
        else {
            return [];
        }
    };
    return Parser;
}());
exports.Parser = Parser;
var KambiParser = /** @class */ (function () {
    function KambiParser() {
    }
    KambiParser.parse = function (apiResponse) {
        switch (apiResponse.requestType) {
            case betoffer_1.RequestType.BET_OFFER:
                return this.parseBetOffers(apiResponse);
            case betoffer_1.RequestType.EVENT:
                return this.parseEvents(apiResponse);
            case betoffer_1.RequestType.PARTICIPANT:
                return this.parseParticipants(apiResponse);
        }
    };
    KambiParser.parseParticipants = function (apiResponse) {
        if (!apiResponse.data.events)
            return [];
        return apiResponse.data.events.filter(function (event) { return event.participants.length === 2; }).map(function (event) { return event.participants; })
            .flat().map(function (participant) { return new betoffer_1.Participant(getParticipantName(participant.name.toUpperCase()), [
            new betoffer_1.BookmakerId(apiResponse.bookmaker, participant.participantId, betoffer_1.IdType.PARTICIPANT)
        ]); });
    };
    KambiParser.parseEvents = function (apiResponse) {
        if (!apiResponse.data.events)
            return [];
        return apiResponse.data.events.filter(function (event) { return event.participants.length === 2; }).map(function (event) {
            var participants = event.participants.map(function (participant) { return new betoffer_1.Participant(getParticipantName(participant.name), [new betoffer_1.BookmakerId(apiResponse.bookmaker, participant.participantId, betoffer_1.IdType.PARTICIPANT)]); });
            return new Event(new betoffer_1.BookmakerId(apiResponse.bookmaker, event.id, betoffer_1.IdType.EVENT), event.start, participants);
        });
    };
    KambiParser.parseBetOffers = function (apiResponse) {
        var _this = this;
        if (!apiResponse.data.betOffers)
            return [];
        return apiResponse.data.betOffers.map(function (betOffer) { return _this.transformToBetOffers(apiResponse.bookmaker, betOffer); }).flat();
    };
    KambiParser.transformToBetOffers = function (bookMaker, betOfferContent) {
        var _this = this;
        var typeId = betOfferContent.criterion.id;
        var betOfferType = this.determineBetOfferType(typeId);
        if (!betOfferType)
            return [];
        var eventId = betOfferContent.eventId;
        var betOffers = [];
        if (betOfferContent.outcomes) {
            betOfferContent.outcomes.forEach(function (outcome) {
                var outcomeType = _this.determineOutcomeType(outcome.type);
                var price = Math.round(outcome.odds + Number.EPSILON) / 1000;
                var line = outcome.line / 1000;
                betOffers.push(new betoffer_1.BetOffer(betOfferType, eventId, bookMaker, outcomeType, price, line));
            });
        }
        return betOffers;
    };
    KambiParser.determineBetOfferType = function (typeId) {
        switch (typeId) {
            case 1001159858:
                return betoffer_1.BetType._1X2;
            case 1001159926:
                return betoffer_1.BetType.OVER_UNDER;
            case 1001159711:
                return betoffer_1.BetType.HANDICAP;
        }
    };
    KambiParser.determineOutcomeType = function (betOptionName) {
        switch (betOptionName) {
            case 'OT_ONE':
                return '1';
            case 'OT_TWO':
                return '2';
            case 'OT_CROSS':
                return 'X';
            case 'OT_OVER':
                return 'OVER';
            case 'OT_UNDER':
                return 'UNDER';
        }
    };
    return KambiParser;
}());
exports.KambiParser = KambiParser;
var SbtechParser = /** @class */ (function () {
    function SbtechParser() {
    }
    SbtechParser.parse = function (apiResponse) {
        switch (apiResponse.requestType) {
            case betoffer_1.RequestType.BET_OFFER:
                return this.parseBetOffers(apiResponse);
            case betoffer_1.RequestType.PARTICIPANT:
                return this.parseParticipants(apiResponse);
            case betoffer_1.RequestType.EVENT:
                return this.parseEvents(apiResponse);
        }
    };
    SbtechParser.parseParticipants = function (apiResponse) {
        if (!apiResponse.data.events)
            return [];
        return apiResponse.data.events.map(function (event) { return event.participants.map(function (participant) { return new betoffer_1.Participant(getParticipantName(participant.name), [new betoffer_1.BookmakerId(apiResponse.bookmaker, participant.id, betoffer_1.IdType.PARTICIPANT)]); }); }).flat();
    };
    SbtechParser.parseBetOffers = function (apiResponse) {
        if (!apiResponse.data.markets)
            return [];
        return apiResponse.data.markets.map(function (market) { return SbtechParser.transformToBetOffer(apiResponse.bookmaker, market); }).flat();
    };
    SbtechParser.parseEvents = function (apiResponse) {
        if (!apiResponse.data.events)
            return [];
        return apiResponse.data.events.map(function (event) {
            var participants = event.participants.map(function (participant) {
                new betoffer_1.Participant(getParticipantName(participant.name), [new betoffer_1.BookmakerId(apiResponse.bookmaker, participant.id, betoffer_1.IdType.PARTICIPANT)]);
            });
            return new Event(new betoffer_1.BookmakerId(apiResponse.bookmaker, event.id, betoffer_1.IdType.EVENT), event.startEventDate, participants);
        });
    };
    SbtechParser.transformToBetOffer = function (bookmaker, market) {
        var typeId = market.marketType.id;
        var betOfferType = SbtechParser.determineBetOfferType(typeId);
        if (!betOfferType)
            return [];
        var eventId = market.eventId;
        var betOffers = [];
        market.selections.forEach(function (selection) {
            var outcomeType = SbtechParser.determineOutcomeType(selection.outcomeType);
            var price = selection.trueOdds;
            var line = selection.points ? selection.points : NaN;
            betOffers.push(new betoffer_1.BetOffer(betOfferType, eventId, bookmaker, outcomeType, price, line));
        });
        return betOffers;
    };
    SbtechParser.determineOutcomeType = function (outcomeType) {
        switch (outcomeType) {
            case 'Home':
                return '1';
            case 'Away':
                return '2';
            case 'Tie':
                return 'X';
            case 'Under':
                return 'UNDER';
            case 'Over':
                return 'OVER';
        }
    };
    SbtechParser.determineBetOfferType = function (typeId) {
        switch (typeId) {
            case '1_0':
                return betoffer_1.BetType._1X2;
            case '3_0':
                return betoffer_1.BetType.OVER_UNDER;
        }
    };
    return SbtechParser;
}());
exports.SbtechParser = SbtechParser;
var AltenarParser = /** @class */ (function () {
    function AltenarParser() {
    }
    AltenarParser.parse = function (apiResponse) {
        switch (apiResponse.requestType) {
            case betoffer_1.RequestType.BET_OFFER:
                return this.parseBetOffers(apiResponse);
            case betoffer_1.RequestType.PARTICIPANT:
                return this.parseParticipants(apiResponse);
            case betoffer_1.RequestType.EVENT:
                return this.parseEvents(apiResponse);
        }
    };
    AltenarParser.parseEvents = function (apiResponse) {
        if (!apiResponse.data.Result)
            return [];
        return apiResponse.data.Result.Items[0].Events.map(function (event) { return new Event(new betoffer_1.BookmakerId(apiResponse.bookmaker, event.Id, betoffer_1.IdType.EVENT), event.EventDate, event.Competitors.map(function (competitor) { return new betoffer_1.Participant(getParticipantName(competitor.Name.toUpperCase()), [new betoffer_1.BookmakerId(apiResponse.bookmaker, competitor.Name, betoffer_1.IdType.PARTICIPANT)]); })); }).flat();
    };
    AltenarParser.parseParticipants = function (apiResponse) {
        if (!apiResponse.data.Result)
            return [];
        return apiResponse.data.Result.Items[0].Events.map(function (event) { return event.Competitors.map(function (participant) { return new betoffer_1.Participant(getParticipantName(participant.Name), [new betoffer_1.BookmakerId(apiResponse.bookmaker, participant.Name, betoffer_1.IdType.PARTICIPANT)]); }); }).flat();
    };
    AltenarParser.parseBetOffers = function (apiResponse) {
        if (!apiResponse.data.Result)
            return [];
        return apiResponse.data.Result.Items[0].Events.map(function (event) { return AltenarParser.transformToBetOffer(apiResponse.bookmaker, event); }).flat();
    };
    AltenarParser.transformToBetOffer = function (bookMaker, event) {
        var betOffers = [];
        var eventId = event.Id;
        event.Items.map(function (item) {
            var betType = AltenarParser.determineBetType(item.MarketTypeId);
            if (betType) {
                item.Items.forEach(function (option) {
                    var price = option.Price;
                    var outcome = option.Name.toUpperCase();
                    var line = item.SpecialOddsValue === '' ? NaN : parseFloat(item.SpecialOddsValue);
                    if (betType === betoffer_1.BetType.HANDICAP) {
                        outcome = option.Name.split('(')[0].trim().toUpperCase();
                        line = parseFloat(option.Name.split('(')[1].split(')')[0].trim().toUpperCase());
                    }
                    else if (betType === betoffer_1.BetType.OVER_UNDER) {
                        outcome = outcome.includes('OVER') ? 'OVER' : 'UNDER';
                    }
                    betOffers.push(new betoffer_1.BetOffer(betType, eventId, bookMaker, outcome, price, line));
                });
            }
        });
        return betOffers;
    };
    AltenarParser.determineBetType = function (typeId) {
        if (typeId.startsWith("1_"))
            return betoffer_1.BetType._1X2;
        if (typeId.startsWith("10_"))
            return betoffer_1.BetType.DOUBLE_CHANCE;
        if (typeId.startsWith("16_"))
            return betoffer_1.BetType.HANDICAP;
        if (typeId.startsWith("18_"))
            return betoffer_1.BetType.OVER_UNDER;
    };
    return AltenarParser;
}());
exports.AltenarParser = AltenarParser;
var BetcenterParser = /** @class */ (function () {
    function BetcenterParser() {
    }
    BetcenterParser.parse = function (apiResponse) {
        if (!apiResponse.data.games)
            return [];
        return apiResponse.data.games.map(function (event) { return BetcenterParser.transformToBetOffer(apiResponse.bookmaker, event); }).flat();
    };
    BetcenterParser.transformToBetOffer = function (bookMaker, event) {
        var betOffers = [];
        event.markets.forEach(function (market) {
            var betType = BetcenterParser.determineBetType(market.id);
            var line = BetcenterParser.determineBetLine(market, betType);
            if (betType) {
                market.tips.forEach(function (tip) {
                    var outcome = tip.text.toUpperCase();
                    var price = tip.odds / 100;
                    if (betType === betoffer_1.BetType.OVER_UNDER) {
                        outcome = outcome.includes('+') ? 'OVER' : 'UNDER';
                    }
                    betOffers.push(new betoffer_1.BetOffer(betType, event.id, bookMaker, outcome, price, line));
                });
            }
        });
        return betOffers;
    };
    BetcenterParser.determineBetType = function (id) {
        switch (id) {
            case 22242:
                return betoffer_1.BetType._1X2;
            case 22462:
                return betoffer_1.BetType.OVER_UNDER;
            case 22252:
                return betoffer_1.BetType.OVER_UNDER;
            case 22472:
                return betoffer_1.BetType.OVER_UNDER;
            case 22482:
                return betoffer_1.BetType.OVER_UNDER;
            case 22492:
                return betoffer_1.BetType.OVER_UNDER;
            case 22502:
                return betoffer_1.BetType.OVER_UNDER;
            case 22512:
                return betoffer_1.BetType.OVER_UNDER;
            case 22522:
                return betoffer_1.BetType.DOUBLE_CHANCE;
        }
    };
    BetcenterParser.determineBetLine = function (market, betType) {
        if (betType === betoffer_1.BetType.OVER_UNDER) {
            return market.anchor;
        }
        else {
            return NaN;
        }
    };
    return BetcenterParser;
}());
exports.BetcenterParser = BetcenterParser;
var LadbrokesParser = /** @class */ (function () {
    function LadbrokesParser() {
    }
    LadbrokesParser.parse = function (apiResponse) {
        if (!apiResponse.data.result.dataGroupList)
            return [];
        return apiResponse.data.result.dataGroupList.map(function (group) { return group.itemList; }).flat()
            .map(function (event) { return LadbrokesParser.transformToBetOffer(apiResponse.bookmaker, event); }).flat();
    };
    LadbrokesParser.transformToBetOffer = function (bookMaker, event) {
        var betOffers = [];
        var eventId = event.eventInfo.aliasUrl;
        event.betGroupList[0].oddGroupList.forEach(function (market) {
            var betType = LadbrokesParser.determineBetOfferType(market.betId);
            if (betType !== betoffer_1.BetType.UNKNOWN) {
                var line_1 = market.additionalDescription ? parseFloat(market.additionalDescription.toUpperCase().trim()) : NaN;
                market.oddList.forEach(function (option) {
                    var outcome = option.oddDescription.toUpperCase();
                    var price = option.oddValue / 100;
                    betOffers.push(new betoffer_1.BetOffer(betType, eventId, bookMaker, outcome, price, line_1));
                });
            }
        });
        return betOffers;
    };
    // @ts-ignore
    LadbrokesParser.determineBetOfferType = function (id) {
        switch (id) {
            case 24:
                return betoffer_1.BetType._1X2;
            case 1907:
                return betoffer_1.BetType.OVER_UNDER;
            default:
                return betoffer_1.BetType.UNKNOWN;
        }
    };
    return LadbrokesParser;
}());
exports.LadbrokesParser = LadbrokesParser;
var MeridianParser = /** @class */ (function () {
    function MeridianParser() {
    }
    MeridianParser.parse = function (apiResponse) {
        if (!apiResponse.data.events)
            return [];
        return apiResponse.data.events.map(function (date) { return date.events; }).flat()
            .map(function (event) { return MeridianParser.parseBetOffers(apiResponse.bookmaker, event); })
            .flat();
    };
    MeridianParser.parseBetOffers = function (bookMaker, event) {
        var betOffers = [];
        var eventId = event.id;
        event.market.forEach(function (betOffer) {
            var betType = MeridianParser.determineBetType(betOffer.templateId);
            if (betType !== betoffer_1.BetType.UNKNOWN) {
                var line_2 = betOffer.overUnder ? parseFloat(betOffer.overUnder) : NaN;
                betOffer.selection.forEach(function (option) {
                    var price = parseFloat(option.price);
                    var outcome = option.nameTranslations.filter(function (trans) { return trans.locale === 'en'; })[0].translation.toUpperCase();
                    betOffers.push(new betoffer_1.BetOffer(betType, eventId, bookMaker, outcome, price, line_2));
                });
            }
        });
        return betOffers;
    };
    MeridianParser.determineBetType = function (id) {
        switch (id) {
            case '3999':
                return betoffer_1.BetType._1X2;
            case '4004':
                return betoffer_1.BetType.OVER_UNDER;
            case '4008':
                return betoffer_1.BetType.DOUBLE_CHANCE;
            default:
                return betoffer_1.BetType.UNKNOWN;
        }
    };
    return MeridianParser;
}());
exports.MeridianParser = MeridianParser;
function getParticipantName(name) {
    var found;
    Object.keys(mapper_1.participantMap).forEach(function (key) {
        if (mapper_1.participantMap[key].includes(name.toUpperCase())) {
            found = key;
        }
    });
    if (found)
        return found;
    return betoffer_1.ParticipantName.NOT_FOUND;
}
var Bet90Parser = /** @class */ (function () {
    function Bet90Parser() {
    }
    Bet90Parser.parse = function (apiResponse) {
        switch (apiResponse.requestType) {
            case betoffer_1.RequestType.BET_OFFER:
                return this.parseBetOffers(apiResponse);
            case betoffer_1.RequestType.EVENT:
                return this.parseEvents(apiResponse);
            case betoffer_1.RequestType.PARTICIPANT:
                return this.parseParticipants(apiResponse);
        }
    };
    Bet90Parser.parseParticipants = function (apiResponse) {
        if (!apiResponse.data)
            return [];
        var events = apiResponse.data;
        var firstTeams = parser.parse(events).querySelectorAll('.first-team').map(function (team) {
            return { id: team.parentNode.id, team1: team.childNodes[1].childNodes[0].rawText };
        });
        var secondTeams = parser.parse(events).querySelectorAll('.second-team').map(function (team) { return { id: team.parentNode.id, team1: team.childNodes[1].childNodes[0].rawText }; });
        var stats = parser.parse(events).querySelectorAll('.hg_nx_btn_stats').map(function (stat) { return { id: stat.parentNode.parentNode.parentNode.id, participantIds: stat.rawAttrs }; });
        return this.parseTeams(firstTeams, secondTeams, stats);
    };
    Bet90Parser.parseTeams = function (firstTeams, secondTeams, stats) {
        var participants = [];
        firstTeams.forEach(function (team) {
            var secondTeam = secondTeams.filter(function (secondTeam) { return secondTeam.id === team.id; })[0];
            var stat = stats.filter(function (stat) { return stat.id === team.id; })[0];
            var id = stat.participantIds.split('team1id="')[1].split('\"\r\n')[0];
            var id2 = stat.participantIds.split('team2id="')[1].split('\"')[0];
            participants.push(new betoffer_1.Participant(getParticipantName(team.team1), [new betoffer_1.BookmakerId(betoffer_1.Bookmaker.BET90, id, betoffer_1.IdType.PARTICIPANT)]));
            participants.push(new betoffer_1.Participant(getParticipantName(secondTeam.team1), [new betoffer_1.BookmakerId(betoffer_1.Bookmaker.BET90, id2, betoffer_1.IdType.PARTICIPANT)]));
        });
        return participants.flat();
    };
    Bet90Parser.parseBetOffers = function (apiResponse) {
        return [];
    };
    Bet90Parser.parseEvents = function (apiResponse) {
        if (!apiResponse.data)
            return [];
        var events = apiResponse.data;
        var parsedEvents = [];
        var firstTeams = parser.parse(events).querySelectorAll('.first-team').map(function (team) {
            return { id: team.parentNode.id, team1: team.childNodes[1].childNodes[0].rawText };
        });
        var secondTeams = parser.parse(events).querySelectorAll('.second-team').map(function (team) {
            return { id: team.parentNode.id, team1: team.childNodes[1].childNodes[0].rawText };
        });
        var stats = parser.parse(events).querySelectorAll('.hg_nx_btn_stats').map(function (stat) {
            return { id: stat.parentNode.parentNode.parentNode.id, participantIds: stat.rawAttrs };
        });
        firstTeams.forEach(function (team) {
            var secondTeam = secondTeams.filter(function (secondTeam) { return secondTeam.id === team.id; })[0];
            var stat = stats.filter(function (stat) { return stat.id === team.id; })[0];
            var participantId = stat.participantIds.split('team1id="')[1].split('\"\r\n')[0];
            var participantId2 = stat.participantIds.split('team2id="')[1].split('\"')[0];
            var participants = [new betoffer_1.Participant(getParticipantName(team.team1), [new betoffer_1.BookmakerId(betoffer_1.Bookmaker.BET90, participantId, betoffer_1.IdType.PARTICIPANT)]),
                new betoffer_1.Participant(getParticipantName(team.team1), [new betoffer_1.BookmakerId(betoffer_1.Bookmaker.BET90, participantId2, betoffer_1.IdType.PARTICIPANT)])
            ];
            var parsedEvent = new Event(new betoffer_1.BookmakerId(betoffer_1.Bookmaker.BET90, team.id, betoffer_1.IdType.EVENT), undefined, participants);
            parsedEvents.push(parsedEvent);
        });
        return parsedEvents;
    };
    return Bet90Parser;
}());
exports.Bet90Parser = Bet90Parser;
var PinnacleParser = /** @class */ (function () {
    function PinnacleParser() {
    }
    PinnacleParser.parse = function (apiResponse) {
        switch (apiResponse.requestType) {
            case betoffer_1.RequestType.BET_OFFER:
                return this.parseOffers(apiResponse);
            case betoffer_1.RequestType.PARTICIPANT:
                return this.parseParticipants(apiResponse);
            case betoffer_1.RequestType.EVENT:
                return this.parseEvents(apiResponse);
        }
    };
    PinnacleParser.parseEvents = function (apiResponse) {
        if (!apiResponse.data || apiResponse.data.constructor !== Array)
            return [];
        return apiResponse.data.filter(function (event) { return !event.parentId; }).map(function (event) {
            var participants = event.participants.map(function (participant) {
                new betoffer_1.Participant(getParticipantName(participant.name), [new betoffer_1.BookmakerId(apiResponse.bookmaker, participant.name, betoffer_1.IdType.PARTICIPANT)]);
            });
            return new Event(new betoffer_1.BookmakerId(apiResponse.bookmaker, event.id, betoffer_1.IdType.EVENT), event.startTime, participants);
        });
    };
    PinnacleParser.parseParticipants = function (apiResponse) {
        if (!apiResponse.data || apiResponse.data.constructor !== Array)
            return [];
        return apiResponse.data.filter(function (event) { return !event.parentId; }).map(function (event) { return event.participants.map(function (participant) { return new betoffer_1.Participant(getParticipantName(participant.name), [new betoffer_1.BookmakerId(apiResponse.bookmaker, participant.name, betoffer_1.IdType.PARTICIPANT)]); }); }).flat();
    };
    PinnacleParser.parseOffers = function (apiResponse) {
        if (!apiResponse.data || apiResponse.data.constructor !== Array)
            return [];
        return apiResponse.data.filter(function (offer) { return offer.prices.filter(function (price) { return price.designation; }).length > 0; })
            .map(function (offer) { return PinnacleParser.parseBetOffers(apiResponse.bookmaker, offer); }).flat();
    };
    PinnacleParser.parseBetOffers = function (bookMaker, offer) {
        var _this = this;
        var betOffers = [];
        var eventId = offer.matchupId;
        var betType = PinnacleParser.determineBetType(offer.key);
        if (betType === betoffer_1.BetType.UNKNOWN)
            return [];
        var vigFreePrices = PinnacleParser.calculateVigFreePrices(offer.prices);
        offer.prices.forEach(function (price) {
            var outcome = PinnacleParser.determineOutcome(price.designation.toUpperCase());
            var line = price.points ? price.points : NaN;
            var odds = _this.toDecimalOdds(price.price);
            betOffers.push(new betoffer_1.BetOffer(betType, eventId, bookMaker, outcome, odds, line, parseFloat(vigFreePrices.filter(function (vigFreePrice) { return vigFreePrice.outcomeType === outcome; })[0].vigFreePrice)));
        });
        return betOffers;
    };
    PinnacleParser.determineBetType = function (key) {
        if (key === 's;0;m')
            return betoffer_1.BetType._1X2;
        if (key.includes('s;0;ou'))
            return betoffer_1.BetType.OVER_UNDER;
        return betoffer_1.BetType.UNKNOWN;
    };
    PinnacleParser.toDecimalOdds = function (americanOdds) {
        if (americanOdds < 0) {
            return parseFloat(((100 / Math.abs(americanOdds)) + 1).toFixed(2));
        }
        else {
            return parseFloat(((americanOdds / 100) + 1).toFixed(2));
        }
    };
    PinnacleParser.determineOutcome = function (outcome) {
        switch (outcome) {
            case 'HOME':
                return '1';
            case 'AWAY':
                return '2';
            case 'DRAW':
                return 'X';
            default:
                return outcome;
        }
    };
    PinnacleParser.calculateVigFreePrices = function (prices) {
        var _this = this;
        var decimalOdds = prices.map(function (price) { return _this.toDecimalOdds(price.price); });
        var vig = 0;
        decimalOdds.forEach(function (odd) {
            vig += 1 / odd;
        });
        var vigFreePrices = [];
        prices.forEach(function (price) {
            var outcomeType = _this.determineOutcome(price.designation.toUpperCase());
            var vigFreePrice = _this.toDecimalOdds(price.price) / vig;
            vigFreePrices.push({ outcomeType: outcomeType, vigFreePrice: vigFreePrice.toFixed(2) });
        });
        return vigFreePrices;
    };
    return PinnacleParser;
}());
exports.PinnacleParser = PinnacleParser;
