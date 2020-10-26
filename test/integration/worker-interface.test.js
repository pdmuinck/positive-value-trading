const axios = require('axios')
const assert = require('assert').strict
const exec = require('child_process').execSync


test = async () => {
    const stop = exec('docker-compose down --rmi all')

    // build kambi worker and worker interface
    const start = exec('docker-compose up -d')

    console.log(start)

    console.log('done compose up')

    const results = await axios.get('http://localhost:3000/bookmakers/UNIBET_BELGIUM/events', {proxy: {host: '127.0.0.1', port: 3000}})
    .then(response => response.data).catch(error => console.log(error))

    const eventId = results[0].events[0].id

    console.log(eventId)
    
    const result = await axios.post('http://localhost:3001/providers/KAMBI/events/' + eventId + '/betoffers', {book: 'UNIBET_BELGIUM'})
    .then(response => response.data).catch(error => console.log(error))

    const test = assert.notStrictEqual(result.betOffers, undefined)

}

test()










