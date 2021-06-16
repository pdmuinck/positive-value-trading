const schedule = require("node-schedule")
const {getEvents} = require("./event-mapper")
const fs = require("fs")
const {getBetOffersForEvents} = require("./betoffer");

async function apply() {
    const events = await getEvents()
    console.log("Found events: " + events.length)
    const valueBets = await getBetOffersForEvents(events)
    console.log(valueBets.map(valueBet => valueBet.csvLine))
}

apply()



/*
const getValueBetsJob = schedule.scheduleJob('* * * * *', async function(){
    const events = await getEvents()
    const betOffers = await getBetOffersForEvents(events)
    const valueBets = betOffers.map(betOffer => identifyValueBets(betOffer))
    console.log(valueBets)
})

 */

