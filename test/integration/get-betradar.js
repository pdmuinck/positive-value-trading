const axios = require('axios')

const fs = require('fs')
const util = require('util')
const log_file = fs.createWriteStream('C:/RADWorkspace/debug.log', {flags : 'w'})
const log_stdout = process.stdout

console.dir = function(d) { //
  log_file.write(util.format(d) + '\n');
  log_stdout.write(util.format(d) + '\n');
}

async function test() {
    const data = await axios.get('https://lsc.fn.sportradar.com/betradar/en/Europe:Berlin/gismo/event_fullfeed').then(response => response.data)

    jupilerProLeagueParticipantsRaw = []
            
    data.doc[0].data.forEach(sport => {
    
        sport.realcategories.forEach(category => {

            const tournaments = category.tournaments
    
            tournaments.forEach(tournament => {
    
                const matches = tournament.matches
    
                matches.forEach(match => {
    
        
                    participants.push({id: match.teams.home._id,name: match.teams.home.mediumname})
                    participants.push({id: match.teams.away._id,name: match.teams.away.mediumname}) 
                    
    
                })
    
            })
    
    
    
        })
    
    })
    
    console.dir(util.inspect(participants, { maxArrayLength: null }))
}

test()

