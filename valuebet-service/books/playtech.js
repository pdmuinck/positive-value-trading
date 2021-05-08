const {Bookmaker, Provider, BookmakerInfo, BetType} = require("../bookmaker")
const {Event} = require("../event")
const {BetOffer} = require("../betoffer")
const {calculateMargin} = require("../utils/utils")
const WebSocket = require("ws")

const books = {}

books[Bookmaker.MAGIC_BETTING] = "wss://magicbetting.be/api/"

let magicBettingEvents = undefined
let magicBettingMarkets = undefined

exports.getPlaytechEventsForCompetition = async function getPlaytechEventsForCompetition(id, sportRadarMatches) {
    const ws = startMagicBettingWS()
    ws.on('open', function open() {
        ws.send(JSON.stringify(["SUBSCRIBE\nid:/api/eventgroups/" + id + "-all-match-events-grouped-by-type\ndestination:/api/eventgroups/" + id + "-all-match-events-grouped-by-type\nlocale:nl\n\n\u0000"]))
    })
    return new Promise(resolve => {
        const interval = setInterval(() => {
            if (magicBettingEvents) {
                const eventInfos = magicBettingEvents.map(event => {
                    const match = sportRadarMatches.filter(match => match && match.participants[0] === magicbetting_sportradar[event.participants[0].id] &&
                        match.participants[1] === magicbetting_sportradar[event.participants[1].id])[0]
                    if(match) {
                        const bookmakerInfo = new BookmakerInfo(Provider.PLAYTECH, Bookmaker.MAGIC_BETTING, id, event.id,
                            undefined, event.marketIds,
                            undefined, undefined, undefined)
                        return new Event(match.sportRadarId, match.sportRadarEventUrl, [bookmakerInfo])
                    }
                })
                resolve(eventInfos)
                clearInterval(interval)
            }
        }, 1000)
    })
}

exports.getPlaytechBetOffers = async function getPlaytechBetOffers(marketIds) {
    const ws = startMagicBettingWS()
    ws.on('open', function open() {
        marketIds.forEach(id => {
            ws.send(JSON.stringify(["SUBSCRIBE\nid:/api/markets/" + id + "\ndestination:/api/markets/" + id + "\nlocale:nl\n\n\u0000"]))
        })
    })
    return new Promise(resolve => {
        const interval = setInterval(() => {
            if (magicBettingMarkets) {
                const betOffers = []
                magicBettingMarkets.forEach(market => {
                    const betType = determineBetType(market.type)
                    if(betType !== BetType.UNKNOWN) {
                        const margin = calculateMargin(market.selectionMap.map(selection => parseFloat(selection.prices[0].decimalLabel)))
                        return Object.values(market.selectionMap).forEach(selection => {
                            // @ts-ignore
                            const line = selection.handicapLabel ? selection.handicapLabel : undefined
                            // @ts-ignore
                            betOffers.push(new BetOffer(betType, selection.eventId, Bookmaker.MAGIC_BETTING, determineOutcome(selection.type), parseFloat(selection.prices[0].decimalLabel), line, margin))
                        })
                    }
                })
                resolve(betOffers)
                clearInterval(interval)
            }
        }, 1000)
    })
}

function determineOutcome(outcome) {
    if(outcome === "E") return "EVEN"
    if(outcome === "O") return "ODD"
    if(outcome === "Y") return "YES"
    if(outcome === "N") return "NO"
    return outcome
}

function determineBetType(type) {
    switch(type) {
        case "1":
            return BetType._1X2
        case "12":
            return BetType._1X2_H1
        case "15":
            return BetType._1X2_H2

        case "4":
            return BetType.HANDICAP

        case "1967":
            return BetType.ASIAN_HANDICAP
        case "1968":
            return BetType.ASIAN_HANDICAP_H1

        case "19":
            return BetType.OVER_UNDER // ASIAN TOTALS
        case "23":
            return BetType.OVER_UNDER_H1

        case "2":
            return BetType.DOUBLE_CHANCE

        case "192":
            return BetType.CORRECT_SCORE

        case "31":
            return BetType.BOTH_TEAMS_SCORE
        case "987":
            return BetType.BOTH_TEAMS_SCORE_H2
        case "336":
            return BetType.BOTH_TEAMS_SCORE_H1


        case "38":
            return BetType.ODD_EVEN
        case "41":
            return BetType.ODD_EVEN_H1
        case "1692":
            return BetType.ODD_EVEN_H2

        case "154":
            return BetType.DRAW_NO_BET_H1
        case "18":
            return BetType.OVER_UNDER
        case "1813":
            return BetType.OVER_UNDER_H2
        case "20":
            return BetType.OVER_UNDER
        case "24":
            return BetType.OVER_UNDER_H1
        case "113":
            return BetType.OVER_UNDER_TEAM2_H1
        case "112":
            return BetType.OVER_UNDER_TEAM1_H1
        case "1812":
            return BetType.OVER_UNDER_H1

        case "160":
            return BetType.OVER_UNDER_TEAM1
        case "161":
            return BetType.OVER_UNDER_TEAM2
        case "1720":
            return BetType.OVER_UNDER_H1
        default:
            return BetType.UNKNOWN



    }
}

function startMagicBettingWS() {
    function string(t) {
        const crypto = require("crypto")
        const s = "abcdefghijklmnopqrstuvwxyz012345"
        const i = 43
        for (var e = s.length, n = crypto.randomBytes(t), r = [], o = 0; o < t; o++) r.push(s.substr(n[o] % e, 1));
        return r.join("")
    }

    function number(t) {
        return Math.floor(Math.random() * t)
    }

    function numberString(t) {
        var e = ("" + (t - 1)).length;
        return (new Array(e + 1).join("0") + number(t)).slice(-e)
    }


    function getMagicBettingApiUrl() {
        const generatedId = string(8)
        const server = numberString(1e3)
        return "wss://magicbetting.be/api/" + server + "/" + generatedId + "/websocket"
    }

    let ws = new WebSocket(getMagicBettingApiUrl(), null, {rejectUnauthorized: false})

    ws.on('open', function open() {
        ws.send(JSON.stringify(["CONNECT\nprotocol-version:1.5\naccept-version:1.1,1.0\nheart-beat:100000,100000\n\n\u0000"]))
        ws.send(JSON.stringify(["SUBSCRIBE\nid:/user/request-response\ndestination:/user/request-response\n\n\u0000"]))
        ws.send(JSON.stringify(["SUBSCRIBE\nid:/api/items/list/all-sports-with-events\ndestination:/api/items/list/all-sports-with-events\n\n\u0000"]))
    })

    ws.on('message', function incoming(data) {
        if(data.includes("api/eventgroups")) {
            const events = parseJson(data)
            if(events.groups) {
                const eventIds = events.groups[0].events.map(event => event.id)
                eventIds.forEach(id => {
                    ws.send(JSON.stringify(["SUBSCRIBE\nid:/api/events/" + id + "\ndestination:/api/events/" + id + "\nlocale:nl\n\n\u0000"]))
                })
            }
        } else if(data.includes("api/events/")) {
            if(magicBettingEvents) magicBettingEvents.push(parseJson(data))
            else magicBettingEvents = [parseJson(data)]
        } else if(data.includes("api/markets/")) {
            if(magicBettingMarkets) magicBettingMarkets.push(parseJson(data))
            else magicBettingMarkets = [parseJson(data)]
        }
    })

    return ws
}

function parseJson(message) {
    return JSON.parse(message.split("\\n\\n")[1].split("\\").join("").split("u0000")[0])
}