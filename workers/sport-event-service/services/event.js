const axios = require('axios')
const CronJob = require('cron').CronJob

const environment = process.env.NODE_ENV
const WORKER_INTERFACE_IP = 'localhost'
const WORKER_INTERFACE_PORT = 3001


const requests = [
    axios.get('http://' + WORKER_INTERFACE_IP + ':' + WORKER_INTERFACE_PORT + '/providers/KAMBI/books/UNIBET_BELGIUM/events').then(response => response.data).catch(error => console.log(error)),
    axios.get('http://' + WORKER_INTERFACE_IP + ':' + WORKER_INTERFACE_PORT + '/providers/SBTECH/books/BETFIRST/events').then(response => response.data).catch(error => console.log(error)),
    axios.get('http://' + WORKER_INTERFACE_IP + ':' + WORKER_INTERFACE_PORT + '/providers/BET_RADAR/books/BET_RADAR/events').then(response => response.data).catch(error => console.log(error)),
]

const event = {}

event.job = new CronJob('10 * * * * *', () => {
    Promise.all(requests).then(function(values) {
        console.log(values)
    })
}, null, true)

event.getEvents = async () => {


    // cron job that searches for events in sportradar, kambi, sbtech workers and merges them, stores them in cache and db


    const data = await axios.get('https://lsc.fn.sportradar.com/betradar/en/Europe:Berlin/gismo/event_fullfeed').then(response => response.data)

    const parsedMatches = []
        
        data.doc[0].data.forEach(sport => {

            sport.realcategories.forEach(category => {

                let country 

                if(category.cc) {
                    country = category.cc.name
                }

                const tournaments = category.tournaments

                tournaments.forEach(tournament => {

                    const tournamentName = tournament.name

                    const matches = tournament.matches

                    matches.forEach(match => {

                        participants = []

                        participants.push({id: match.teams.home._id,name: match.teams.home.mediumname})
                        participants.push({id: match.teams.away._id,name: match.teams.away.mediumname}) 
                        
                        parsedMatches.push({match: match, country: country, sport: sport.name, competition: tournamentName})

                    })

                })



            })

        })

        return parsedMatches
}


module.exports = event