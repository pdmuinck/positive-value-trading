import {ApiResponse} from "../scraper";
import {BetOffer} from "../../service/betoffers";
import {BetType, Bookmaker, Provider} from "../../service/bookmaker";
import {BookMakerInfo, EventInfo} from "../../service/events";
import axios from "axios";
import {getSportRadarEventUrl} from "../sportradar/sportradar";

const books = [Bookmaker.GOLDEN_PALACE]

export async function getAltenarEventsForCompetition(id: string): Promise<EventInfo[]> {
    const url = 'https://sb1capi-altenar.biahosted.com/Sportsbook/GetEvents?timezoneOffset=-60&langId=1' +
        '&skinName=' + books[0] + '&configId=1&culture=en-GB&deviceType=Mobile&numformat=en&sportids=0&categoryids=0' +
        '&champids=' + id  +'&group=AllEvents&period=periodall&withLive=false&outrightsDisplay=none' +
        '&couponType=0&startDate=2020-04-11T08%3A28%3A00.000Z&endDate=2200-04-18T08%3A27%3A00.000Z'
    return axios.get(url)
        .then(response => {
            return response.data.Result.Items[0].Events.map(event => {
                const sportRadarId = event.ExtId
                const eventUrl = "https://sb1-geteventdetailsapi-altenar.biahosted.com/Sportsbook/GetEventDetails?timezoneOffset=-120&langId=1&skinName=goldenpalace&configId=1&culture=en-GB&numformat=en&eventId=" + event.Id
                const bookmakerInfos = books.map(book => {
                    return new BookMakerInfo(Provider.ALTENAR, book, id, event.Id, url, [url],
                        undefined, undefined, "GET")
                })
                return new EventInfo(sportRadarId, getSportRadarEventUrl(sportRadarId), bookmakerInfos)
            })
        }).catch(error => console.log(error))
}

export function parseAltenarBetOffers(apiResponse: ApiResponse): BetOffer[] {
    if(!apiResponse.data.Result) return []
    return apiResponse.data.Result.Items[0].Events.map(event => transformToBetOffer(apiResponse.provider, event)).flat()
}

function transformToBetOffer(bookMaker: Provider, event): BetOffer[] {
    const betOffers = []
    const eventId = event.Id
    event.Items.map(item => {
        const betType = determineBetType(item.MarketTypeId)
        if(betType) {
            item.Items.forEach(option => {
                const price = option.Price
                let outcome = option.Name.toUpperCase()
                let line = item.SpecialOddsValue === '' ? NaN : parseFloat(item.SpecialOddsValue)
                if(betType === BetType.HANDICAP) {
                    outcome = option.Name.split('(')[0].trim().toUpperCase()
                    line = parseFloat(option.Name.split('(')[1].split(')')[0].trim().toUpperCase())
                } else if(betType === BetType.OVER_UNDER){
                    outcome = outcome.includes('OVER') ? 'OVER' : 'UNDER'
                }
                betOffers.push(new BetOffer(betType, eventId, bookMaker, outcome, price, line))
            })
        }
    })
    return betOffers
}

function determineBetType(typeId: string): BetType {
    if(typeId.startsWith("1_")) return BetType._1X2
    if(typeId.startsWith("10_")) return BetType.DOUBLE_CHANCE
    if(typeId.startsWith("11_")) return BetType.DRAW_NO_BET
    if(typeId.startsWith("16_")) return BetType.HANDICAP
    if(typeId.startsWith("18_")) return BetType.OVER_UNDER
    if(typeId.startsWith("26_")) return BetType.ODD_EVEN
}