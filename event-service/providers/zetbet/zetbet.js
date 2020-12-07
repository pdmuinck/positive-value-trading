const axios = require('axios')
const parser = require('node-html-parser')
const leagues = require('./resources/leagues.json')
const NodeCache = require('node-cache')
const ttlSeconds = 60 * 60 * 1
const eventCache = new NodeCache({ stdTTL: ttlSeconds, checkperiod: ttlSeconds * 0.2, useClones: false })
const eventDetailCache = new NodeCache({ stdTTL: ttlSeconds, checkperiod: ttlSeconds * 0.2, useClones: false })

JSON.safeStringify = (obj, indent = 2) => {
    let cache = [];
    const retVal = JSON.stringify(
      obj,
      (key, value) =>
        typeof value === "object" && value !== null
          ? cache.includes(value)
            ? undefined // Duplicate reference found, discard key
            : cache.push(value) && value // Store value in our collection
          : value,
      indent
    );
    cache = null;
    return retVal;
  }
  

const zetbet = {}

zetbet.getEventsForBookAndSport = async (book, sport) => {
  if(eventDetailCache.keys()) {
    return Object.values(eventDetailCache.mget(eventDetailCache.keys()))
  } else {
    return []
  }
  
}

function parse(data) {
  const root = parser.parse(data)
  return root.querySelectorAll('a').map(htmlElement => htmlElement.rawAttrs).filter(url => url.includes('event')).map(link => link.split('\n')[0].split('href=')[1].replace(/"/g, ''))
}

async function getEventDetails(eventIds) {
  const requests = eventIds.map(id => {
    if(!eventDetailCache.get(id)) {
      return axios.get('https://www.zebet.be' + id).then(response => parseEvents(id, response.data)).catch(error => console.log(error))
    }
  })
  console.log('About to get events: ' + requests.length)
  let results
  await Promise.all(requests).then(values => {
    results = values.flat()
    console.log('found zetbet events')
  })
  return results
}

async function getEventIds() {
  const leagueRequests = leagues.map(league => axios.get('https://www.zebet.be/en/competition/' + league.id).then(response => parse(response.data)))
  let eventIds
  await Promise.all(leagueRequests).then(values => {
    eventIds = values.flat()
    eventCache.set('EVENTS', eventIds)
  })
  return eventIds
}

module.exports = zetbet

function parseEvents(id, data) {
    const root = parser.parse(data)
    const event = {id: id, participants: JSON.parse(JSON.safeStringify(root.querySelector('title'))).childNodes[0].rawText.split(' - ')[0].split(' / ')}
    eventDetailCache.set(id, event)
    return event
}

function parseBets(data) {
  return JSON.parse(JSON.safeStringify(root.querySelectorAll('.pmq-cote')))
  //return JSON.parse(JSON.safeStringify(root.querySelectorAll('a').filter(htmlElement => htmlElement.rawAttrs.includes('betting'))))
}

zetbet.getByIdEuroTierce = async (id) => {
    return axios.get('https://sports.eurotierce.be/nl/event/3326165-milan-ac-celtic-glasgow').then(response => parseEvent(response.data))
}

zetbet.open = async () => {
  console.log('Wait for zetbet')
  const eventIds = await getEventIds()
  console.log('zetbet event ids found: ' + eventIds.length)
  await getEventDetails(eventIds)
  console.log('zetbet events found')
}

function parseEvent(data) {
    const root = parser.parse(data)
    return JSON.parse(JSON.safeStringify(root.querySelectorAll('.odds-question')))

    // bettype: snc-odds-actor
    // bet product: odds-question-label
    // odds-question
    // price: snc-odds-odd nb-load
    
    return root.querySelectorAll('.snc-odds-odd')
}