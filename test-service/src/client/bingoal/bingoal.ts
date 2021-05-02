import axios from "axios";
import {BetType, Bookmaker, Provider} from "../../service/bookmaker";
import {BookMakerInfo, EventInfo} from "../../service/events";
import {getSportRadarEventUrl} from "../sportradar/sportradar";
import {BetOffer} from "../../service/betoffers";
import {ApiResponse} from "../apiResponse";
import {cachedDataVersionTag} from "v8";
import {calculateMargin} from "../utils";

export function bingoalQueryKParam(response) {
    const ieVars = response.data.split("var _ie")[1]
    return ieVars.split("_k")[1].split(',')[0].split("=")[1].split("'").join("").trim()
}

export function bingoalHeaders(response) {
    const cookie = response.headers["set-cookie"].map(entry => entry.split(";")[0]).join("; ")
    const headers = {
        headers : {
            "Cookie": cookie
        }
    }
    return headers
}

export async function getBingoalEventsForCompetition(id: string){
    return axios.get("https://www.bingoal.be/nl/Sport").then(response => {
        const headers = this.bingoalHeaders(response)
        const k = this.bingoalQueryKParam(response)
        const leagueUrl = "https://www.bingoal.be/A/sport?k=" + k + "&func=sport&id=" + id
        return axios.get(leagueUrl, headers)
            .then(response => {
                return response.data.sports.map(sport => sport.matches).flat().filter(match => !match.outright).map(match => {
                    const url = "https://www.bingoal.be/A/sport?k=" + k + "&func=detail&id=" + match.ID
                    const bookmakerInfo = new BookMakerInfo(Provider.BINGOAL, Bookmaker.BINGOAL, id, match.ID, leagueUrl,
                        [url], headers, undefined, "GET")
                    return new EventInfo(match.betradarID.toString(), getSportRadarEventUrl(match.betradarID), [bookmakerInfo])
                })
            })})
}

export function parseBingoalBetOffers(apiResponse: ApiResponse): BetOffer[] {
    const betOffers: BetOffer[] = []
    const event = apiResponse.data.box[0].match
    event.importantSubbets.forEach(subbet => {
        const betType: BetType = determineBetType(subbet)
        if(betType !== BetType.UNKNOWN) {
            const margin = calculateMargin(subbet.tips.map(tip => parseFloat(tip.odd)))
            subbet.tips.forEach(tip => {
                betOffers.push(new BetOffer(betType, event.ID, Bookmaker.BINGOAL, tip.shortName, parseFloat(tip.odd), undefined, margin))
            })
        }
    })
    return betOffers
}

function determineBetType(subbet) {
    switch(subbet.marketID) {
        case "1":
            return BetType._1X2
        case "10":
            return BetType.DOUBLE_CHANCE
        case "11":
            return BetType.DRAW_NO_BET
        case "14":
            return BetType.HANDICAP
        case "17":
            return BetType.OVER_UNDER
        case "27":
            return BetType.BOTH_TEAMS_SCORE
        case "55":
            return BetType._1X2_H1
        default:
            return BetType.UNKNOWN
    }
}