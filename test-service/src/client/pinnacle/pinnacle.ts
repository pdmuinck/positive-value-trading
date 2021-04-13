import {BookMakerInfo, EventInfo} from "../../service/events";
import axios from "axios";
import {pinnacle_sportradar} from "./participants";
import {Bookmaker, Provider} from "../../service/bookmaker";

export async function getPinnacleEventsForCompetition(id: string, sportRadarMatches): Promise<EventInfo[]> {
    const requestConfig = {
        headers: {
            "X-API-Key": "CmX2KcMrXuFmNg6YFbmTxE0y9CIrOi0R",
            "Referer": "https://www.pinnacle.com/",
            "Accept": "application/json",
            "Content-Type": "application/json"
        }
    }
    const leagueUrl = "https://guest.api.arcadia.pinnacle.com/0.1/leagues/" + id + "/matchups"
    return axios.get(leagueUrl, requestConfig).then(response => {
        return response.data.map(event => {
            const match = sportRadarMatches.filter(match => match && match.participants[0] === pinnacle_sportradar[event.participants[0].name] &&
                match.participants[1] === pinnacle_sportradar[event.participants[1].name])[0]
            const bookmakerInfo = new BookMakerInfo(Provider.PINNACLE, Bookmaker.PINNACLE, id, event.id,
                leagueUrl, ["https://guest.api.arcadia.pinnacle.com/0.1/matchups/" + event.id + "/related",
                    "https://guest.api.arcadia.pinnacle.com/0.1/matchups/" + event.id + "/markets/related/straight"],
                requestConfig, undefined, "GET")
            return new EventInfo(match.sportRadarId, match.sportRadarEventUrl, [bookmakerInfo])
        })
    })
}