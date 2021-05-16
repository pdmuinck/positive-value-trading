const schedule = require("node-schedule")
const {getEvents} = require("./event-mapper")

getEvents().then(response => console.log(response))

/*
const getValueBetsJob = schedule.scheduleJob('* * * * *', function(){
    if(events) {
        const betOffers = getBetOffersForEvents(events)
        const valueBets = betOffers.map(betOffer => identifyValueBets(betOffer))
        console.log(valueBets)
    } else {
        events = getEvents()
    }
})
*/


const getEventsJob = schedule.scheduleJob('0 * * * *', async function(){
    events = await getEvents()
    console.log(events)
})

