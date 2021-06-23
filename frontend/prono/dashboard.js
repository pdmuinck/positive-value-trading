let players = []
let team = []
let captains = []

let tab = "team"

const currentDate = new Date()

async function getAllData() {
    getTeams()
    await getPlayers()
    
    
    await getDraws()
    getCaptains()
}

getAllData()

async function getCaptains() {
    const response = await fetch("http://127.0.0.1:3000/captains?year=2019&user=" + sessionStorage.getItem("user"))
    captains = await response.json()
}


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
    getDraws()
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
    const playerIds = team.map(player => player.id)
    const rounds = ["1", "2", "3", "4", "Q", "S", "F"]
    const response = await fetch("http://127.0.0.1:3000/draws?year=2019&user=" + sessionStorage.getItem("user"))
    const draws = await response.json()
    rounds.forEach((round, index) => {
        const roundMatches = draws[round].filter(match => {
            match["participantInTeam"] = [playerIds.includes(match.participants[0].id), playerIds.includes(match.participants[1].id)]
            return match["participantInTeam"].includes(true)
        })
        //console.log(round)
        createRoundOverview(roundMatches, captains[index])
    })
}

function selectCaptain(event) {
    const rounds = ["1", "2", "3", "4", "Q", "S", "F"]
    const elementId = event
    const playerId = document.getElementById(elementId).value.split("|")[0]
    const round = document.getElementById(elementId).value.split("|")[1]
    const roundIndex = rounds.indexOf(round)
    captains[roundIndex] = playerId
    saveCaptain()
}

async function saveCaptain() {
    await fetch("http://127.0.0.1:3000/competitions/wimbledon/editions/2019/captains?user=" + sessionStorage.getItem("user") + "&pass=" + sessionStorage.getItem("pass"), {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(captains)
        }).then(async response => {
        const text = await response.text()
    })
}

function createRoundOverview(matches, captain) {
    if(matches && matches.length > 0) {
        let round = "<div><h2>Ronde " + matches[0].round +"</h2>"
        let totalPoints = 0
        if(!captain) {
            round += "<div id=" + "captain" + matches[0].round +" >Kies je kapitein: <select id=" + "select-captain-" + matches[0].round + " onchange='selectCaptain(this.id)'><option></option>" 
            matches.forEach(match => {
                if(match.participantInTeam[0]) {
                    round += "<option value=" + match.participants[0].id + "|" + match.round + " id=" + match.participants[0].id + " >" + match.participants[0].name + "</option>"
                }
                if(match.participantInTeam[1]) {
                    round += "<option value=" + match.participants[1].id + "|" + match.round + " id=" + match.participants[1].id + " >" + match.participants[1].name + "</option>"
                }
            })
            round += "</select><ul>"
        } else {
            round += "<div id='chosen-captain'> Jouw kapitein: " + captain   +"</div>"
        }
        matches.map(match => {
            const winnerIndex = match.participants.map(participant => participant.id).indexOf(match.winner)
            const winner = match.participants[winnerIndex]
            const winnerInTeam = match.participantInTeam[winnerIndex]
            const points = winnerInTeam ? match.points[winnerIndex] : 0
            totalPoints += points
            round += "<li><div id=" + match.matchId + ">" + [match.participants[0].name + " (" + match.participants[0].category + ")", match.participants[1].name + " (" + match.participants[1].category + ")"].join(" - ") + " " + match.scores + " => " + points + " punten</div></li>"
        })
        round += "</ul></div><div>Totaal behaalde punten: " + totalPoints + "</div>"
        document.getElementById("round" + matches[0].round).innerHTML = round
    }

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