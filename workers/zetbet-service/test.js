const axios = require('axios')
const parser = require('node-html-parser')

/*
axios.get('https://www.zebet.be/en/competition/6674-champions_league').then(response => console.log(parse(response.data)))

function parse(data) {
    const root = parser.parse(data)
    return root.querySelectorAll('a').map(htmlElement => htmlElement.rawAttrs).filter(url => url.includes('event')).map(link => link.split('\n')[0].split('href=')[1].replace(/"/g, ''))
}
*/

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
  

const event = {}

event.getById = async (id) => {
    return axios.get('https://www.zebet.be/en/event/wjaz1-fk_krasnodar_rennes').then(response => parseBets(response.data)).catch(error => console.log(error))
}

module.exports = event

function parseBets(data) {
    const root = parser.parse(data)
    return JSON.parse(JSON.safeStringify(root.querySelectorAll('.pmq-cote')))
    //return JSON.parse(JSON.safeStringify(root.querySelectorAll('a').filter(htmlElement => htmlElement.rawAttrs.includes('betting'))))
}

event.getByIdEuroTierce = async (id) => {
    return axios.get('https://sports.eurotierce.be/nl/event/3326165-milan-ac-celtic-glasgow').then(response => testparse(response.data))
}

function testparse(data) {
    const root = parser.parse(data)
    return JSON.parse(JSON.safeStringify(root.querySelectorAll('.odds-question')))

    // bettype: snc-odds-actor
    // bet product: odds-question-label
    // odds-question
    // price: snc-odds-odd nb-load
    
    return root.querySelectorAll('.snc-odds-odd')
}