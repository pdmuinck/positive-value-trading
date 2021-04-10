import {BookMakerInfo, EventInfo} from "../../service/events";
import axios from "axios";

export async function getPinnacleEventsForCompetition(id: string, sportRadarMatches): Promise<EventInfo[]> {
    const requestConfig = {
        headers: {
            "X-API-Key": "CmX2KcMrXuFmNg6YFbmTxE0y9CIrOi0R",
            "Referer": "https://www.pinnacle.com/",
            "Accept": "application/json",
            "Content-Type": "application/json"
        }
    }
    return axios.get("https://guest.api.arcadia.pinnacle.com/0.1/leagues/" + id + "/matchups", requestConfig).then(response => {

        // TODO use sportradar pinnacle map to create participants based on sportRadarMatches
        const bookmakerInfos = []
        return [new EventInfo(undefined, undefined, bookmakerInfos, undefined, [])]
    })
}