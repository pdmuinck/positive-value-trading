let players
let selectedPlayers = []

function addOrRemoveToSelection(event) {
    const checked = document.getElementById(event.id).checked
    if(checked){
        const selectedPlayer = players.filter(player => player.personId === event.id.split("checkbox_")[1])[0]
        if(selectedPlayers.filter(player => player.category.code === selectedPlayer.category.code).length === 3) {
            document.getElementById("error").innerHTML = "<span style=color:red>Je hebt al 3 spelers uit de categorie " + selectedPlayer.category.code + " gekozen. Je kan uit je huidige selectie een speler verwijderen en daarna een nieuwe toevoegen."
            document.getElementById(event.id).checked = !checked
        } else {
            selectedPlayers.push(selectedPlayer)
        } 
    } else {
        removePlayerFromProno(event)
    }
}

function removePlayerFromProno(event) {
    const playerToRemove = players.filter(player => player.personId === event.id.split("checkbox_")[1])[0]
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
    var checkboxes = ""
    players.forEach(player => {
        checkboxes += "<label id=" + player.personId + " style=background-color:" + player.category.color + ";cursor:pointer><input type=checkbox onclick=addOrRemoveToSelection(this) id=checkbox_" + player.personId + " style=cursor:pointer>" + player.person + "</label>"
    })
    return checkboxes
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
