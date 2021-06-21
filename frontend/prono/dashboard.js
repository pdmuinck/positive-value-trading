let players = []
let selectedPlayersMen = []
let selectedPlayersWomen = []

let tab = "team"

getPlayers()

//getDashboardData()

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
    const players = await fetch("http://127.0.0.1:3000/players?year=2019").then(response => response.json()).catch(error => console.log(error))
    //console.log(players)
    /*players.forEach(player => {
        const category = determineCategory(parseInt(player.singles_rank))
        player["category"] = category
    })
    /*
    const playersMenCheckboxes = createPlayerCheckboxes(players.filter(player => player.gender === "M"), selectedPlayersMen)
    const playersWomenCheckboxes = createPlayerCheckboxes(players.filter(player => player.gender === "F"), selectedPlayersWomen)
    document.getElementById("playersMen").innerHTML = playersMenCheckboxes
    document.getElementById("playersWomen").innerHTML = playersWomenCheckboxes
    */
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
    const isMenPlayer = id.includes("atp")
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