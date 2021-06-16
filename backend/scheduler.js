const schedule = require("node-schedule")
const {getEvents} = require("./event-mapper")
const fs = require("fs")
const {identifyValueBets} = require("./betoffer");
const {getBetOffersForEvents} = require("./betoffer");

async function apply() {
    const events = await getEvents()
    console.log("Found events: " + events.length)
    /*
    if(events.length > 0) {
        const betOffers = await getBetOffersForEvents(events)
        console.log("Found bet offers: " + betOffers.length)
        const valueBets = betOffers.map(betOffer => identifyValueBets(betOffer))
        console.log(valueBets)
    }

     */

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

