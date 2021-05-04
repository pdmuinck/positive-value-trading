import {Bookmaker, BookmakerInfo} from "../bookmaker"
import {Event} from "../event"

const books = [Bookmaker.GOLDEN_PALACE]

export async function getAltenarEventsForCompetition(id) {
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
                    return new BookmakerInfo(Provider.ALTENAR, book, id, event.Id, url, [eventUrl],
                        undefined, undefined, "GET")
                })
                return new Event(sportRadarId, getSportRadarEventUrl(sportRadarId), bookmakerInfos)
            })
        }).catch(error => console.log(error))
}