const schedule = require("node-schedule")
const {getEvents} = require("./event-mapper")
const fs = require("fs")

getEvents().then(response => console.log(JSON.stringify(response, null, 2), { depth: null }))

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
    console.dir(events, { depth: null })
})

