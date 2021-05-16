import {identifyValueBets} from "../valuebet-service-ts/src/client/utils";

const schedule = require("node-schedule")
const {getBetOffersForEvents} = require("./betoffer");
const {getEvents} = require("./event-mapper");

let events

const getValueBetsJob = schedule.scheduleJob('* * * * *', function(){
    if(events) {
        const betOffers = getBetOffersForEvents(events)
        const valueBets = betOffers.map(betOffer => identifyValueBets(betOffer))
        console.log(valueBets)
    } else {
        events = getEvents()

    }
})


const getEventsJob = schedule.scheduleJob('0 * * * *', function(){
    events = getEvents()
})

