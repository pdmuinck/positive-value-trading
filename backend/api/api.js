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
const captains = {}
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

api.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
})

api.get("/", (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain') 
    res.end('Hello World')
})

api.get("/draws", (req, res) => {
    const players = require("./scripts/wimbledon/players" + req.query.year + ".json")
    const user = req.query.user
    const team = teams[user]
    
    exec("./scripts/wimbledon/wimbledon_draw " + req.query.year, (err, stdout, stderr) => {
        const output = {}
        const maleDraws = require("./draws_" + req.query.year + "_MS.json")
        const femaleDraws = require("./draws_" + req.query.year + "_LS.json")
        const allDraws = [maleDraws, femaleDraws]
        allDraws.forEach(draw => {
            draw.matches.forEach(match => {
                const matchConverted = convertMatch(match, players)
                const round = match.roundCode
                if(output[round]) {
                    output[round].push(matchConverted)
                } else {
                    output[round] = [matchConverted]
                }
            })
        })
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(output))
    })
})

function convertMatch(match, players) {
    const multipliers = {"1": 2, "2": 3, "3": 4, "4": 5, "Q": 6, "S": 7, "F": 7}
    const player1 = players.players.filter(player => player.id === match.team1.idA)[0]
    const player2 = players.players.filter(player => player.id === match.team2.idA)[0]
    const category1 = determineCategory(player1.singles_rank)
    const category2 = determineCategory(player2.singles_rank)
    const setScores = match.scores.sets.map(set => [set[0].score, set[1].score].join("-")).join(", ")
    return {
        matchId: match.match_id,
        round: match.roundCode,
        participants: [createPlayerShort(match.team1, category1), createPlayerShort(match.team2, category2)],
        winner: match.team1.won ? match.team1.idA : match.team2.idA,
        scores: setScores,
        points: [basePoints(category1), basePoints(category2)],
        multiplier: multipliers[match.roundCode]
    }
}

function createPlayerShort(player, category) {
    return {
        id: player.idA,
        name: player.displayNameA,
        category: category
    }
}

api.get("/players", (req, res) => {
    exec("./scripts/wimbledon/players " + req.query.year, (err, stdout, stderr) => {
        const players = require("./scripts/wimbledon/players" + req.query.year + ".json")
        const playersFiltered = players.players.filter(player => player.events_entered.filter(event => event.event_id === "MS" || event.event_id === "LS").length > 0)
        playersFiltered.forEach(player => {
            player["captain"] = []
            player["category"] = determineCategory(player.singles_rank)
        })
        const toReturn = playersFiltered.map(player => { return {id: player.id, category: player.category, name: [player.first_name[0], player.last_name].join(". ")}})
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(toReturn))
        
    })
})

function determineCategory(rank) {
    const rankParsed = parseInt(rank)
    if(rankParsed <= 7) return "A"
    if(rankParsed <= 17 && rankParsed > 7) return "B"
    if(rankParsed <= 33 && rankParsed > 17) return "C"
    if(rankParsed > 33) return "D"
}

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

api.get("/captains", (req, res) => {
    const foundCaptains = captains[req.query.user]
    if(!foundCaptains) {
        res.statusCode = 404
        res.setHeader('Content-Type', 'text/plain')
        res.end("Geen kapiteinen gevonden voor gebruiker: " + req.query.user)
    } else {
        // check auth
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(foundCaptains[req.query.user]))
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

api.post("/competitions/:competition/editions/:edition/captains", async (req, res) => {
    checkAuth(req, res)
    const competition = req.params.competition
    const edition = req.params.edition

    const captains = req.body
    captains[req.query.user] = captains
    res.statusCode = 200
    res.end()
})


