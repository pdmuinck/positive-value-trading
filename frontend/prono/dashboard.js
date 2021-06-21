let playersMen
let playersWomen
let selectedPlayersMen = []
let selectedPlayersWomen = []

let tab = "team"

async function getDashboardData() {
    await getTeam()
    await getPlayers()
    await getPlaySchedule()
}

async function getTeam() {
    this.selectedPlayersMen = []
    this.selectedPlayersWomen = []
    const user = sessionStorage.getItem("user")
    const pass = sessionStorage.getItem("pass")
    const response = await fetch("http://127.0.0.1:3000/teams?user=" + user + "&pass=" + pass)
    if(response.status === 404) return
    const team = await response.json()
    team.forEach(player => {
        if(player.gender === "M") {
            selectedPlayersMen.push(player)
        } else {
            selectedPlayersWomen.push(player)
        }
    })
}

async function getPlaySchedule() {
    const selectedPlayers = selectedPlayersWomen.concat(selectedPlayersMen).map(player => player.person)
    const allPlayers = playersMen.concat(playersWomen)
    const allPlayerNames = allPlayers.map(player => player.person)
    const response = await fetch("http://127.0.0.1:3000/play-schedule?year=2019")
    const schedules = await response.json()
    const matches = schedules.map(daySchedule => {
        const dayMatches = daySchedule.courts.map(court => court.matches.filter(match => match.eventCode === "MS" || match.eventCode === "LS")).flat()
        dayMatches.forEach(match => {
            match["date"] = daySchedule.displayDate
        })
        return dayMatches
    }).flat()

    const rounds = ["1", "2", "3", "4", "Q", "S", "F"]
    rounds.forEach(round => {
        const matchesRound = matches.filter(match => match.roundCode === round).sort(match => match.day)
        let overview = "<div id='schedule'><h1>Selecteer je kapitein voor deze ronde</h1><div id='round-header'>" + matchesRound[0].date + "</div><ul>"
        matchesRound.forEach(match => {
            const participants = [match.team1[0].firstNameA + " " + match.team1[0].lastNameA, match.team2[0].firstNameA + " " + match.team2[0].lastNameA]
            if(selectedPlayers.includes(participants[0]) || selectedPlayers.includes(participants[1])) {
                const player1 = findPlayer(allPlayers, allPlayerNames, participants[0])
                const player2 = findPlayer(allPlayers, allPlayerNames, participants[1])
                console.log(player1)
                overview += "<li>" + player1?.rank  + " VS. " + player2?.rank + "</li>"
            }
        }) 
        overview += "</ul></div>"
        document.getElementById("round"+round).innerHTML = overview
    })
}

function findPlayer(allPlayers, allPlayerNames, participant) {
    const index = allPlayerNames.indexOf(participant)
    if(index > -1) {
        return allPlayers[index]
    } 
}

getDashboardData()

function changeTab(event) {
    const id = event.id.split("span_")[1]
    if(tab === id) return
    document.getElementById(tab).style.display='none'
    document.getElementById(id).style.display='block'
    tab = id
}

async function saveTeam() {
    const allSelectedPlayers = selectedPlayersWomen.concat(selectedPlayersMen)
    const body = {team: allSelectedPlayers}
    await fetch("http://127.0.0.1:3000/teams?user=" + sessionStorage.getItem("user") + "&pass=" + sessionStorage.getItem("pass"), {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
        }).then(async response => {
        const text = await response.text()
    })
}

async function getPlayers() {
    const responseMen = await fetch("http://127.0.0.1:3000/atp-rankings")
    const responseWomen = await fetch("http://127.0.0.1:3000/wta-rankings")
    playersMen = await responseMen.json()
    playersWomen = await responseWomen.json()
    console.log(playersMen)
    playersMen.forEach(player => {
        const category = determineCategory(player.rank)
        player["category"] = category
        player["gender"] = "M"
    })
    playersWomen.forEach(player => {
        const category = determineCategory(player.rank)
        player["category"] = category
        player["gender"] = "W"
    })
    const playersMenCheckboxes = createPlayerCheckboxes(playersMen, selectedPlayersMen)
    const playersWomenCheckboxes = createPlayerCheckboxes(playersWomen, selectedPlayersWomen)
    document.getElementById("playersMen").innerHTML = playersMenCheckboxes
    document.getElementById("playersWomen").innerHTML = playersWomenCheckboxes
}

function determineCategory(rank) {
    const rankParsed = parseInt(rank)
    if(rankParsed <= 7) return "A"
    if(rankParsed <= 17 && rankParsed > 7) return "B"
    if(rankParsed <= 33 && rankParsed > 17) return "C"
    if(rankParsed > 33) return "D"
}

function createPlayerCheckboxes(players, selectedPlayers) {
    const selectedIds = selectedPlayers.map(player => player.personId)
    var checkboxes = ""
    const categories = ["A", "B", "C", "D"]
    categories.forEach(category => {
        checkboxes += "<div><h4>Kies 3 spelers uit categorie " + category + "</h4>"
        players.filter(player => player.category === category).forEach(player => {
            const selected = selectedIds.indexOf(player.personId) > -1
            if(selected) {
                checkboxes += "<label id=" + player.personId + " style=cursor:pointer><input type=checkbox checked onclick=addOrRemoveToSelection(this) id=checkbox_" + player.personId + " style=cursor:pointer>" + player.person + "</label>"
            } else {
                checkboxes += "<label id=" + player.personId + " style=cursor:pointer><input type=checkbox onclick=addOrRemoveToSelection(this) id=checkbox_" + player.personId + " style=cursor:pointer>" + player.person + "</label>"
            }
            
        })
        checkboxes += "</div>"
    })
    return checkboxes
}

function addOrRemoveToSelection(event) {
    const checked = document.getElementById(event.id).checked
    personId = event.id.split("checkbox_")[1]
    const isMenPlayer = playersMen.filter(player => player.personId === personId).length > 0
    if(checked){
        if(isMenPlayer) {
            addToTeam(playersMen, selectedPlayersMen, event, checked)
        } else {
            addToTeam(playersWomen, selectedPlayersWomen, event, checked)
        }
        
    } else {
        if(isMenPlayer) {
            removeFromTeam(playersMen, selectedPlayersMen, event)
        } else {
            removeFromTeam(playersWomen, selectedPlayersWomen, event)
        }
    }
}

function addToTeam(players, selectedPlayers, event, checked) {
    const selectedPlayer = players.filter(player => player.personId === event.id.split("checkbox_")[1])[0]
        if(selectedPlayers.filter(player => player.category === selectedPlayer.category).length === 3) {
            document.getElementById("error").innerHTML = "<span style=color:red>Je hebt al 3 spelers uit de categorie " + selectedPlayer.category + " gekozen. Je kan uit je huidige selectie een speler verwijderen en daarna een nieuwe toevoegen."
            document.getElementById(event.id).checked = !checked
        } else {
            selectedPlayers.push(selectedPlayer)
            saveTeam()
        }
    
}

function removeFromTeam(players, selectedPlayers, event) {
    const selectedIds = selectedPlayers.map(player => player.personId)
    const playerToRemove = players.filter(player => player.personId === event.id.split("checkbox_")[1])[0]
    const index = selectedIds.indexOf(playerToRemove.personId)
    if (index > -1) {
        selectedPlayers.splice(index, 1)
        saveTeam()
    }
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