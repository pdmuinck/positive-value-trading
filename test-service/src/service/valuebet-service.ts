import {BetOffer, ValueBetFoundEvent} from "../domain/betoffer";
const NodeCache = require('node-cache')
const ttlSeconds = 60 * 1 * 1
const sportEvents = new NodeCache({ stdTTL: ttlSeconds * 60 * 24, checkperiod: ttlSeconds * 0.2, useClones: false })

export class ValuebetService {

    // launches the scraping
    // calls parsers
    // maps sport events: holds sport events data
    //

}

