import axios from "axios";
import {bet90Map} from "./leagues";
import {EventInfo} from "../../service/events";

const parser = require('node-html-parser')

const headers = {
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json; charset=UTF-8',
    }
}

export async function getBet90EventsForCompetition(id: string, sportRadarMatches) {
    const bookMap = bet90Map.filter(key => key.id === parseInt(id))[0]
    const eventBodyRequest = {leagueId: id, categoryId: bookMap.categoryId, sportId: bookMap.sport}

    return axios.post('https://bet90.be/Sports/SportLeagueGames', eventBodyRequest, headers).then(response => {
        const eventsParsed = parser.parse(response.data)
        const rows = eventsParsed.querySelectorAll('.divTableBody').map(row => row.childNodes)
        return rows.filter(row => row.length !== 3).map(row => {
            const eventNodes = row.filter(el => el.classNames && el.classNames.includes("dropd"))
            return eventNodes.map(node => {
                const eventId = node.rawAttrs.split('"')[1]
                const homeTeamName = node.childNodes.filter(node => node.classNames
                    && node.classNames.includes("first-team"))[0].childNodes[1].childNodes[0].rawText
                const awayTeamName = node.childNodes.filter(node => node.classNames
                    && node.classNames.includes("second-team"))[0].childNodes[1].childNodes[0].rawText
                const homeTeamId = node.childNodes.filter(node => node.classNames
                    && node.classNames.includes("league_cell_5"))[0].childNodes[3].childNodes[1].rawAttrs.split("data-team")[1].split('id="')[1].split('\n')[0].trim().split('"')[0].trim()
                const awayTeamId = node.childNodes.filter(node => node.classNames
                    && node.classNames.includes("league_cell_5"))[0].childNodes[3].childNodes[1].rawAttrs.split("data-team")[2].split('id="')[1].split('"')[0].trim()
                console.log(homeTeamName + " " + homeTeamId)
                console.log(awayTeamName + " " + awayTeamId)
                return new EventInfo("", "", [])
            })
        })
    })
}