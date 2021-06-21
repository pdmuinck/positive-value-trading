const express = require('express')
const cors = require("cors")
const exec = require("child_process").exec

const api = express()
api.use(express.json())
api.use(express.urlencoded())
api.use(cors())

const hostname = '127.0.0.1'
const port = 3000;

const teams = {}

api.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
})

api.get("/", (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain') 
    res.end('Hello World')
})

api.get("/players", (req, res) => {
    exec("./scripts/wimbledon/players " + req.query.year, (err, stdout, stderr) => {
        if(err) console.log(err)
        if(stderr) console.log(stderr)
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.end(stdout)
        
    })
    /*
    const players = require("./scripts/wimbledon/players" + req.query.year + ".json")
    const playersFiltered = players.players.filter(player => player.events_entered.filter(event => event.event_id === "MS" || event.event_id === "LS").length > 0)
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(playersFiltered))

    */
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
    if(!req.body.team) {
        res.statusCode = 400
        res.setHeader('Content-Type', 'text/plain')
        res.end("Je hebt geen spelers geselecteerd. Selecteer 3 spelers per categorie voor mannen en vrouwen en ga daarna verder.")
    }
}

api.post("/competitions/:competition/editions/:edition/teams", (req, res) => {
    checkAuth(req, res)
    const competition = req.params.competition
    const edition = req.params.edition
    const schedule = scheduleCache[edition]
    schedule.
    teams[req.query.user] = req.body.team
    res.statusCode = 200
    res.end()
    
})


