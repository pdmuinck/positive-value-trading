const express = require('express')
const cors = require("cors")
const exec = require("child_process").exec

const api = express()
api.use(express.json())
api.use(express.urlencoded())
api.use(cors())

const hostname = '127.0.0.1'
const port = 3000;

api.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
})

api.get("/", (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain') 
    res.end('Hello World')
})

api.post("/submit-prono", (req, res) => {
    if(!req.body.playerName || req.body.playerName.length === 0) {
        res.statusCode = 400
        res.setHeader('Content-Type', 'text/plain')
        res.end("Je hebt je naam niet meegegeven.")
    }
    if(!req.body.team) {
        res.statusCode = 400
        res.setHeader('Content-Type', 'text/plain')
        res.end("Je hebt geen spelers geselecteerd. Selecteer 3 spelers per categorie voor mannen en vrouwen en ga daarna verder.")
    }
    const categories = ["A", "B", "C", "D"]
    const badCategories = categories.filter(category => req.body.team.filter(player => player.category === category).length !== 6)
    if(badCategories.length > 0) {
        res.statusCode = 400
        res.setHeader('Content-Type', 'text/plain')
        res.end("Je hebt niet genoeg of te veel spelers geselecteerd voor categorieën: " + badCategories.join(", "))
    }
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