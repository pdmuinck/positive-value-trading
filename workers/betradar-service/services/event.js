const axios = require('axios')

const event = {}

event.getEvents = async () => {
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