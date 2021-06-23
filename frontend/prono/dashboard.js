let players = []
let team = []

let tab = "team"

const currentDate = new Date()
getTeams()
getPlayers()
//getDraws()

async function getPlayers() {
    const response = await fetch("http://127.0.0.1:3000/players?year=2019")
    players = await response.json()
    const playersMenCheckboxes = createPlayerCheckboxes(players.filter(player => player.id.includes("atp")))
    const playersWomenCheckboxes = createPlayerCheckboxes(players.filter(player => player.id.includes("wta")))
    document.getElementById("playersMen").innerHTML = playersMenCheckboxes
    document.getElementById("playersWomen").innerHTML = playersWomenCheckboxes
}

function createPlayerCheckboxes(players) {
    const selectedIds = team.map(player => player.id)
    let checkboxes = ""
    const categories = ["A", "B", "C", "D"]
    categories.forEach(category => {
        checkboxes += "<div><h4>Kies 3 spelers uit categorie " + category + "</h4>"
        players.filter(player => player.category === category).forEach(player => {
            const selected = selectedIds.indexOf(player.id) > -1
            if(selected) {
                checkboxes += "<label id=" + player.id + " style=cursor:pointer><input type=checkbox checked onclick=addOrRemoveToSelection(this) id=checkbox_" + player.id + " style=cursor:pointer>" + player.name + "</label>"
            } else {
                checkboxes += "<label id=" + player.id + " style=cursor:pointer><input type=checkbox onclick=addOrRemoveToSelection(this) id=checkbox_" + player.id + " style=cursor:pointer>" + player.name + "</label>"
            }
            
        })
        checkboxes += "</div>"
    })
    return checkboxes
}

function addOrRemoveToSelection(event) {
    const checked = document.getElementById(event.id).checked
    if(checked) {
        addToTeam(checked, event)
    } else {
        removeFromTeam(event)
    }
    
}

function addToTeam(checked, event) {
    const selectedPlayer = players.filter(player => player.id === event.id.split("checkbox_")[1])[0]
    const male = selectedPlayer.id.includes("atp")
    if((male && team.filter(player => player.category === selectedPlayer.category && player.id.includes("atp")).length === 3)
    || (!male && team.filter(player => player.category === selectedPlayer.category && player.id.includes("wta")).length === 3)) {
        document.getElementById("error").innerHTML = "<span style=color:red>Je hebt al 3 spelers uit de categorie " + selectedPlayer.category + " gekozen. Je kan uit je huidige selectie een speler verwijderen en daarna een nieuwe toevoegen."
        document.getElementById(event.id).checked = !checked
    } else {
        team.push(selectedPlayer)
        saveTeam()
    }
}

function removeFromTeam(event) {
    const index = team.map(player => player.id).indexOf(event.id.split("checkbox_")[1])
    if (index > -1) {
        team.splice(index, 1)
        saveTeam()
    }
}

async function saveTeam() {
    await fetch("http://127.0.0.1:3000/competitions/wimbledon/editions/2019/teams?user=" + sessionStorage.getItem("user") + "&pass=" + sessionStorage.getItem("pass"), {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(team)
        }).then(async response => {
        const text = await response.text()
    })
    //getDraws()
}

async function getTeams() {
    const response = await fetch("http://127.0.0.1:3000/teams?user=" + sessionStorage.getItem("user")).catch(error => console.log(error))
    team = await response.json()
}

function changeTab(event) {
    const id = event.id.split("span_")[1]
    if(tab === id) return
    document.getElementById(tab).style.display='none'
    document.getElementById(id).style.display='block'
    tab = id
}

async function getDraws() {
    const rounds = ["1", "2", "3", "4", "Q", "S", "F"]
    const response = await fetch("http://127.0.0.1:3000/draws?year=2019&user=" + sessionStorage.getItem("user"))
    const team = await response.json()
    const matches = team.map(player => player.draw).flat()
    rounds.forEach(round => {
        createRoundOverview(matches, round, team)
    })
}

function selectCaptain(event) {
    const elementId = event
    const playerId = document.getElementById(elementId).value.split("|")[0]
    const round = document.getElementById(elementId).value.split("|")[1]
    let name 
    if(selectedFemalePlayers.filter(player => player.id === playerId)[0]) {
        const player = selectedFemalePlayers.filter(player => player.id === playerId)[0]
        player.captain.push(round)
        name = player.last_name + player.first_name
    } else {
        const player = selectedMalePlayers.filter(player => player.id === playerId)[0]
        player.captain.push(round)
        name = player.last_name + player.first_name
    }
    saveTeam()
}

function createRoundOverview(matches, round, team) {
    const playerIds = team.map(player => player.id)
    const captain = team.filter(player => player.captain.includes(round))[0]
    const roundMatches = matches.filter(match => match.roundCode === round)
    const playersRound = []
    roundMatches.forEach(match => {
        if(playersRound.indexOf(match.team1.id) === -1) {
            playersRound.push({id: match.team1.idA, name: match.team1.displayNameA})
        }
        if(playersRound.indexOf(match.team2.id) === -1) {
            playersRound.push({id: match.team2.idA, name: match.team2.displayNameA})
        }
    })

    let roundOverview = "<div><h2>Ronde " + round +"</h2>"
    const foundPlayers = []
    if(!captain) {
        roundOverview += "<div id=" + "captain" + round +" >Kies je kapitein: <select id=" + "select-captain-" + round + " onchange='selectCaptain(this.id)'><option></option>" 
        playersRound.forEach(player => {
            if(playerIds.includes(player.id) && !foundPlayers.includes(player.id)) {
                foundPlayers.push(player.id)
                roundOverview += "<option value=" + player.id + "|" + round + " id=" + player.id + " >" + player.name + "</option>"
            }
        })
    } else {
        roundOverview += "<div id='chosen-captain'> Jouw kapitein: " + captain.first_name + " " + captain.last_name  +"</div>"
    }
    
    
    
    roundOverview += "</select><ul>"
    const uniqueMatches = []
    roundMatches.forEach(roundMatch => {
        const idTeam1 = roundMatch.team1.idA
        const idTeam2 = roundMatch.team2.idA
        if(!uniqueMatches.includes(roundMatch.match_id)) {
            uniqueMatches.push(roundMatch.match_id)
            const team1Category = players.filter(player => player.id === idTeam1)[0]?.category
            const team2Category = players.filter(player => player.id === idTeam2)[0]?.category
            roundOverview += "<li><div id=" + roundMatch.match_id + ">" + [roundMatch.team1.displayNameA + " (" + team1Category + ")", roundMatch.team2.displayNameA + " (" + team2Category + ")"].join(" - ") + " " + scoresDisplay(roundMatch) + pointsDisplay(roundMatch) + "</div></li>"
        }

    })
    const totalPoints = roundMatches.map(match => match.points).reduce((a, b) => a + b, 0)
    roundOverview += "</ul></div><div id=" + "round" + round + "_points >Totaal behaalde punten: " + totalPoints + "</div>"
    document.getElementById("round" + round).innerHTML = roundOverview
}

function scoresDisplay(match) {
    const setScores = match.scores.sets.map(set => [set[0].score, set[1].score].join("-"))
    return setScores.join(", ")
}

function pointsDisplay(match) {
    return " => " + match.points + " punten"
}

setInterval(
    function() {
        if(document.getElementById("error")) {
            document.getElementById("error").innerHTML = ""
        }
        if(document.getElementById("error-submit")) {
            document.getElementById("error-submit").innerHTML = ""
        }
    },
    10000
)