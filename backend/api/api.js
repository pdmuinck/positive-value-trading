const express = require('express')
const cors = require("cors")
const exec = require("child_process").exec

const api = express()
api.use(express.json())
api.use(express.urlencoded())
api.use(cors())

const hostname = '127.0.0.1'
const port = 3000;

const scheduleCache = {}
const teams = {}

function populatePlayScheduleCache() {
    const years = [2019, 2021]
    years.forEach(year => {
        scheduleCache[year] = []
        for(let day = 1 ; day < 22 ; day++) {
            exec("./scripts/wimbledon/wimbledon_schedule " + year + " " + day, (err, stdout, stderr) => {
                if(stdout && !stdout.includes("html")) {
                    scheduleCache[year].push(JSON.parse(stdout))
                }
            })
        }
    })
}

populatePlayScheduleCache()

api.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
})

api.get("/", (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain') 
    res.end('Hello World')
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

api.post("/teams", (req, res) => {
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

    //TODO check valid auth
    teams[req.query.user] = req.body.team
    res.statusCode = 200
    res.end()
    
})


api.get("/atp-rankings", (req, res) => {
    exec("./scripts/atp_rankings", (err, stdout, stderr) => {
        if(err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'text/plain')
            console.log(err)
            res.end("Sorry there is an issue at our side.")
        }
        if(stdout) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json')
            res.end(stdout)
        }
    })
})

api.get("/wta-rankings", (req, res) => {
    exec("./scripts/wta_rankings", (err, stdout, stderr) => {
        if(err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'text/plain')
            console.log(err)
            res.end("Sorry there is an issue at our side.")
        }
        if(stdout) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json')
            res.end(stdout)
        }
    })
})

api.get("/play-schedule", (req, res) => {
    const year = req.query.year
    const fromCache = scheduleCache[year]
    if(fromCache) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(fromCache))
    } else {
        populatePlayScheduleCache()
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json')
        res.end(scheduleCache[year])
    }
})


