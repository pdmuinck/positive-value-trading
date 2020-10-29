const axios = require('axios')

const environment = process.env.NODE_ENV

const KAMBI_SERVICE_IP = environment === 'development' ? 'kambi' : '10.0.35.203'
const KAMBI_SERVICE_PORT = '3000'

const orchestrator = {}

orchestrator.getBetOffers = async(provider, eventId, book) => {
   
    if(provider.toUpperCase() === 'KAMBI') {
        const result = await axios.get('http://' + KAMBI_SERVICE_IP + ':' + KAMBI_SERVICE_PORT + '/bookmakers/' + book + '/events/' + eventId + '/betoffers').then(response => response.data).catch(error => console.log(error))
        return result

    } else if(provider.toUpperCase() === 'SBTECH') {

    }


}

orchestrator.getEvents = async(provider, book) => {
    if(provider.toUpperCase() === 'KAMBI') {
        const result = await axios.get('http://' + KAMBI_SERVICE_IP + ':' + KAMBI_SERVICE_PORT + '/bookmakers/' + book + '/events/').then(response => response.data).catch(error => console.log(error))
        return result

    } else {

    }
}

module.exports = orchestrator



