let players
let selectedPlayers = []

function addOrRemoveToSelection(event) {
    const checkboxId = event.id.includes("checkbox") ? event.id : "checkbox_" + event.id
    const checked = document.getElementById(checkboxId).checked
    if(checked){
        removePlayerFromProno(event)
        document.getElementById("checkbox_" + event.id).checked = !checked
    } else {
        const selectedPlayer = players.filter(player => player.personId === event.id)[0]
        if(selectedPlayers.filter(player => player.category.code === selectedPlayer.category.code).length === 3) {
            document.getElementById("error").innerHTML = "<span style=color:red>Je hebt al 3 spelers uit de categorie " + selectedPlayer.category.code + " gekozen. Je kan uit je huidige selectie een speler verwijderen en daarna een nieuwe toevoegen."
        } else {
            selectedPlayers.push(selectedPlayer)
            document.getElementById("checkbox_" + event.id).checked = !checked
        }

    }
    
}

function removePlayerFromProno(event) {
    const playerToRemove = players.filter(player => player.personId === event.id)[0]
    const index = selectedPlayers.indexOf(playerToRemove)
    if (index > -1) {
        selectedPlayers.splice(index, 1)
    }
}

function determineCategory(rank) {
    const rankParsed = parseInt(rank)
    if(rankParsed <= 7) return {color: "#FFD700", code: "A"}
    if(rankParsed <= 17 && rankParsed > 7) return {color: "#DDDDDD", code: "B"}
    if(rankParsed <= 33 && rankParsed > 17) return {color: "#CD7F32", code: "C"}
    if(rankParsed > 33) return {color: "salmon", code: "D"}
}


async function getAtpRankings() {
    const response = await fetch("http://127.0.0.1:3000/stubs/atp-rankings")
    players = await response.json()
    players.forEach(player => {
        const category = determineCategory(player.rank)
        player["category"] = category
    })
    const rankingTable = createRankingTable(players)
    document.getElementById("players").innerHTML = rankingTable
}

function createRankingTable(players) {
    var rankingTable = "<table>"
    players.forEach(player => {
        const category = determineCategory(player.rank)
        rankingTable += "<tr id=" + player.personId + " style=background-color:" + category.color + ";cursor:pointer onclick='addOrRemoveToSelection(this)'><td style=background-color:white><input type='checkbox' id=checkbox_" + player.personId + " onclick=addOrRemoveToSelection(this)></input></td><td>" + player.person + "</td></tr>"
    })
    rankingTable += "</table>"
    return rankingTable
}

getAtpRankings()

setInterval(
    function() {
        if(document.getElementById("warning")) {
            document.getElementById("warning").innerHTML = ""
        }
        if(document.getElementById("error")) {
            document.getElementById("error").innerHTML = ""
        }
    },
    10000
)
