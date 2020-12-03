const axios = require('axios')

const altenar = {}

const sports = {
    "FOOTBALL": 1
}

altenar.getEventsForBookAndSport = async (book, sport) => {
    return axios.get('https://sb1capi-altenar.biahosted.com/Sportsbook/GetEvents?timezoneOffset=-120&langId=1&skinName=' + book +'&configId=1&culture=en&countryCode=BE&deviceType=Mobile&numformat=en&sportids={sportId}&categoryids=0&group=AllEvents&period=periodall&withLive=true&outrightsDisplay=none&couponType=0&startDate=2020-04-11T08%3A28%3A00.000Z&endDate=2200-04-18T08%3A28%3A00.000Z'.replace('{sportId}', sports[sport.toUpperCase()])).then(response => parse(response.data.Result.Items[0].Events)).catch(error => null)
}

function parse(events) {
    return events.map(event => { return {id: event.Id, participants: event.Competitors.map(competitor => {return {id: competitor.Name, name: competitor.Name}})}})
}

module.exports = altenar