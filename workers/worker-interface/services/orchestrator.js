const axios = require('axios')

const environment = process.env.NODE_ENV

const KAMBI_SERVICE_IP = environment === 'development' ? 'kambi' : '10.0.35.203'
const KAMBI_SERVICE_PORT = '3000'

const SBTECH_SERVICE_IP = 'sbtech'
const SBTECH_PORT = 3001

const BETRADAR_IP = 'betradar'
const BETRADAR_PORT = 3002

const PINNACLE_IP = 'pinnacle'
const PINNACLE_PORT = 3005

const orchestrator = {}

orchestrator.getBetOffers = async(provider, eventId, book) => {
   
    if(provider.toUpperCase() === 'KAMBI') {
        return await axios.get('http://' + KAMBI_SERVICE_IP + ':' + KAMBI_SERVICE_PORT + '/bookmakers/' + book + '/events/' + eventId + '/betoffers').then(response => response.data).catch(error => console.log(error))
    } else if(provider.toUpperCase() === 'SBTECH') {
        return await axios.get('http://' + SBTECH_SERVICE_IP + ':' + SBTECH_PORT + '/bookmakers/' + book + '/events/' + eventId + '/betoffers').then(response => response.data).catch(error => console.log(error))
    } else if(provider.toUpperCase() === 'BETRADAR') {
        return await axios.get('http://' + BETRADAR_IP + ':' + BETRADAR_PORT + '/bookmakers/' + book + '/events/' + eventId + '/betoffers').then(response => response.data).catch(error => console.log(error))
    } else if(provider.toUpperCase() === 'PINNACLE') {
        return await axios.get('http://' + PINNACLE_IP + ':' + PINNACLE_PORT + '/bookmakers/' + book + '/events/' + eventId + '/betoffers').then(response => response.data).catch(error => console.log(error))
    }


}

orchestrator.getEvents = async(provider, book, sport) => {

    if(provider.toUpperCase() === 'KAMBI') {
        return await axios.get('http://' + KAMBI_SERVICE_IP + ':' + KAMBI_SERVICE_PORT + '/bookmakers/' + book + '/events?sport=' + sport).then(response => response.data).catch(error => console.log(error))
    } else if(provider.toUpperCase() === 'SBTECH') {
        return await axios.get('http://' + SBTECH_SERVICE_IP + ':' + SBTECH_PORT + '/bookmakers/' + book + '/events?sport=' + sport).then(response => response.data).catch(error => console.log(error))
    } else if(provider.toUpperCase() === 'BETRADAR') {
        return await axios.get('http://' + BETRADAR_IP + ':' + BETRADAR_PORT + '/bookmakers/' + book + '/events?sport=' + sport).then(response => response.data).catch(error => console.log(error))
    } else if(provider.toUpperCase() === 'PINNACLE') {
        return await axios.get('http://' + PINNACLE_IP + ':' + PINNACLE_PORT + '/bookmakers/' + book + '/events?sport=' + sport).then(response => response.data).catch(error => console.log(error))
    }
}

module.exports = orchestrator



