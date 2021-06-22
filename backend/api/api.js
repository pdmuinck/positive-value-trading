const express = require('express')
const cors = require("cors")
const exec = require("child_process").exec

const api = express()
api.use(express.json({limit: "50mb"}))
api.use(express.urlencoded())
api.use(cors())

const hostname = '127.0.0.1'
const port = 3000;

const teams = {}
const draws = {}

function basePoints(category) {
    if(category === "A") {
        return 10
    }
    if(category === "B") {
        return 20
    }
    if(category === "C") {
        return 30
    }
    if(category === "D") {
        return 40
    }
}

function calculatePoints(team) {
    const multipliers = {"1": 2, "2": 3, "3": 4, "4": 5, "Q": 6, "S": 7, "F": 7}
    team.forEach(player => {
        const category = player.category
        const base = basePoints(category)
        player.draw.forEach(match => {
            const playerOrder = match.team1.idA === player.id ? "1" : "2"
            if(playerOrder === match.winner && player.captain.includes(match.roundCode)) {
                match["points"] = multipliers[match.roundCode] * base
            } else if(playerOrder === match.winner){
                match["points"] = base
            } else {
                match["points"] = 0
            }
        })
    })
}



api.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
})

api.get("/", (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain') 
    res.end('Hello World')
})

api.get("/draws", (req, res) => {
    const user = req.query.user
    const team = teams[user]
    exec("./scripts/wimbledon/wimbledon_draw " + req.query.year, (err, stdout, stderr) => {
        const maleDraws = require("./draws_" + req.query.year + "_MS.json")
        const femaleDraws = require("./draws_" + req.query.year + "_LS.json")
        const matches = maleDraws.matches.concat(femaleDraws.matches)
        if(team) {
            const multipliers = {"1": 2, "2": 3, "3": 4, "4": 5, "Q": 6, "S": 7, "F": 7}
            team.forEach(player => {
                const base = basePoints(player.category)
                const playerMatches = matches.filter(match => player.id === match.team1.idA || player.id === match.team2.idA)
                playerMatches.forEach(match => {
                    const playerOrder = match.team1.idA === player.id ? "1" : "2"
                    if(playerOrder === match.winner && player.captain.includes(match.roundCode)) {
                        match["points"] = multipliers[match.roundCode] * base
                    } else if(playerOrder === match.winner){
                        match["points"] = base
                    }
                })
                player["draw"] = playerMatches
            })
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(team))
        } else {
            res.statusCode = 404
            res.setHeader('Content-Type', 'text/plain')
            res.end("Geen spelers in team")
        } 
    })
})

api.get("/players", (req, res) => {
    exec("./scripts/wimbledon/players " + req.query.year, (err, stdout, stderr) => {
        const players = require("./scripts/wimbledon/players" + req.query.year + ".json")
        const playersFiltered = players.players.filter(player => player.events_entered.filter(event => event.event_id === "MS" || event.event_id === "LS").length > 0)
        playersFiltered.forEach(player => player["captain"] = [])
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(playersFiltered))
        
    })
})

api.get("/teams", (req, res) => {
    const team = teams[req.query.user]
    if(!team) {
        res.statusCode = 404
        res.setHeader('Content-Type', 'text/plain')
        res.end("Geen team gevonden voor gebruiker: " + req.query.user)
    } else {
        // check auth
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(teams[req.query.user]))
    }

})

function checkAuth(req, res) {
    //TODO check valid auth
    if(!req.query.user || !req.query.pass) {
        res.statusCode = 400
        res.setHeader('Content-Type', 'text/plain')
        res.end("Onjuiste gebruikersnaam/wachtwoord.")
    }
    if(!req.body) {
        res.statusCode = 400
        res.setHeader('Content-Type', 'text/plain')
        res.end("Je hebt geen spelers geselecteerd. Selecteer 3 spelers per categorie voor mannen en vrouwen en ga daarna verder.")
    }
}

api.post("/competitions/:competition/editions/:edition/teams", async (req, res) => {
    checkAuth(req, res)
    const competition = req.params.competition
    const edition = req.params.edition

    const team = req.body
    teams[req.query.user] = team
    res.statusCode = 200
    res.end()
})


