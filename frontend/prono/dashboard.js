let players = []
let selectedMalePlayers = []
let selectedFemalePlayers = []

let tab = "team"

const currentDate = new Date()
getTeams()
getPlayers()
getDraws()

function changeTab(event) {
    const id = event.id.split("span_")[1]
    if(tab === id) return
    document.getElementById(tab).style.display='none'
    document.getElementById(id).style.display='block'
    tab = id
}

async function getDraws() {
    
}

async function getTeams() {
    const response = await fetch("http://127.0.0.1:3000/teams?user=" + sessionStorage.getItem("user"))
    teams = await response.json()
    selectedMalePlayers = teams.filter(player => player.gender === "M")
    selectedFemalePlayers = teams.filter(player => player.gender === "F")

}

async function saveTeam() {
    const allSelectedPlayers = selectedFemalePlayers.concat(selectedMalePlayers)
    const body = allSelectedPlayers
    await fetch("http://127.0.0.1:3000/competitions/wimbledon/editions/2019/teams?user=" + sessionStorage.getItem("user") + "&pass=" + sessionStorage.getItem("pass"), {
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
    const response = await fetch("http://127.0.0.1:3000/players?year=2019")
    players = await response.json()
    players.forEach(player => {
        const category = determineCategory(parseInt(player.singles_rank))
        player["category"] = category
    })

    const playersMenCheckboxes = createPlayerCheckboxes(players.filter(player => player.gender === "M"), selectedMalePlayers)
    const playersWomenCheckboxes = createPlayerCheckboxes(players.filter(player => player.gender === "F"), selectedFemalePlayers)
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
    const selectedIds = selectedPlayers.map(player => player.id)
    var checkboxes = ""
    const categories = ["A", "B", "C", "D"]
    categories.forEach(category => {
        checkboxes += "<div><h4>Kies 3 spelers uit categorie " + category + "</h4>"
        players.filter(player => player.category === category).forEach(player => {
            const selected = selectedIds.indexOf(player.id) > -1
            if(selected) {
                checkboxes += "<label id=" + player.id + " style=cursor:pointer><input type=checkbox checked onclick=addOrRemoveToSelection(this) id=checkbox_" + player.id + " style=cursor:pointer>" + [player.first_name, player.last_name].join(" ") + "</label>"
            } else {
                checkboxes += "<label id=" + player.id + " style=cursor:pointer><input type=checkbox onclick=addOrRemoveToSelection(this) id=checkbox_" + player.id + " style=cursor:pointer>" + [player.first_name, player.last_name].join(" ") + "</label>"
            }
            
        })
        checkboxes += "</div>"
    })
    return checkboxes
}

function addOrRemoveToSelection(event) {
    const checked = document.getElementById(event.id).checked
    const id = event.id.split("checkbox_")[1]
    const male = id.includes("atp")
    const malePlayers = players.filter(player => player.gender === "M")
    const femalePlayers = players.filter(player => player.gender === "F")
    if(checked){
        if(male) {
            addToTeam(malePlayers, selectedMalePlayers, event, checked)
        } else {
            addToTeam(plafemalePlayersyersWomen, selectedFemalePlayers, event, checked)
        }
        
    } else {
        if(male) {
            removeFromTeam(malePlayers, selectedMalePlayers, event)
        } else {
            removeFromTeam(femalePlayers, selectedFemalePlayers, event)
        }
    }
}

function addToTeam(players, selectedPlayers, event, checked) {
    const selectedPlayer = players.filter(player => player.id === event.id.split("checkbox_")[1])[0]
    if(selectedPlayers.filter(player => player.category === selectedPlayer.category).length === 3) {
        document.getElementById("error").innerHTML = "<span style=color:red>Je hebt al 3 spelers uit de categorie " + selectedPlayer.category + " gekozen. Je kan uit je huidige selectie een speler verwijderen en daarna een nieuwe toevoegen."
        document.getElementById(event.id).checked = !checked
    } else {
        selectedPlayers.push(selectedPlayer)
        saveTeam()
    }
    
}

function removeFromTeam(players, selectedPlayers, event) {
    const selectedIds = selectedPlayers.map(player => player.id)
    const playerToRemove = players.filter(player => player.id === event.id.split("checkbox_")[1])[0]
    const index = selectedIds.indexOf(playerToRemove.id)
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