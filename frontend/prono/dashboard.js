let playersMen
let playersWomen
let selectedPlayersMen = []
let selectedPlayersWomen = []

let tab = "team"

function getDashboardData() {
    getAtpRankings()
    getTeam()
    getPlaySchedule()
}

function getTeam() {
    const user = sessionStorage.getItem("user")
    const pass = sessionStorage.getItem("pass")
}

function getPlaySchedule() {
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
    const playerName = document.getElementById("input-player-name").value
    if(playerName) {
        const body = {playerName: playerName, team: allSelectedPlayers}
        await fetch("http://127.0.0.1:3000/submit-prono", {
            method: 'POST',
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
          }).then(async response => {
            const text = await response.text()
            if(response.status === 200) {
                console.log('test')
                document.getElementById("submit-status").innerHTML = "<span style=color:green>Jouw team is opgeslagen. Je kan ze bekijken op...</span>"
            }
            if(response.status === 400) {
                document.getElementById("submit-status").innerHTML = "<span style=color:red>" + text + "</span>"
            }
          })
        
    } else {
        document.getElementById("submit-status").innerHTML = "<span style=color:red>Je hebt geen naam meegegeven.</span>"
    }
}

async function getAtpRankings() {
    const responseMen = await fetch("http://127.0.0.1:3000/atp-rankings")
    const responseWomen = await fetch("http://127.0.0.1:3000/wta-rankings")
    playersMen = await responseMen.json()
    playersWomen = await responseWomen.json()
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
    const playersMenCheckboxes = createPlayerCheckboxes(playersMen)
    const playersWomenCheckboxes = createPlayerCheckboxes(playersWomen)
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

function createPlayerCheckboxes(players) {
    var checkboxes = ""
    const categories = ["A", "B", "C", "D"]
    categories.forEach(category => {
        checkboxes += "<div><h4>Kies 3 spelers uit categorie " + category + "</h4>"
        players.filter(player => player.category === category).forEach(player => {
            checkboxes += "<label id=" + player.personId + " style=cursor:pointer><input type=checkbox onclick=addOrRemoveToSelection(this) id=checkbox_" + player.personId + " style=cursor:pointer>" + player.person + "</label>"
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
        } 
}

function removeFromTeam(players, selectedPlayers, event) {
    const playerToRemove = players.filter(player => player.personId === event.id.split("checkbox_")[1])[0]
    const index = selectedPlayers.indexOf(playerToRemove)
    if (index > -1) {
        selectedPlayers.splice(index, 1)
    }
}