let players
let selectedPlayers = []

function assignPlayerToProno(event) {
    const selectedPlayer = players.filter(player => player.personId === event.id)[0]
    if(selectedPlayers.includes(selectedPlayer)){
        document.getElementById("warning").innerHTML = "<span style=color:blue>Je hebt " + selectedPlayer.person + " al in je selectie."
    } else if(selectedPlayers.filter(player => player.category.code === selectedPlayer.category.code).length === 3) {
        document.getElementById("error").innerHTML = "<span style=color:red>Je hebt al 3 spelers uit de categorie " + selectedPlayer.category.code + " gekozen. Je kan uit je huidige selectie een speler verwijderen en daarna een nieuwe toevoegen."
    } else {
        selectedPlayers.push(selectedPlayer)
        const table = createSelectedPlayersTable()
        document.getElementById("selections").innerHTML = table
    }
}

function createSelectedPlayersTable() {
    var table = "<table><th><td>Player Name</td></th>"
    selectedPlayers.forEach(player => {
        table += "<tr id=" + player.personId + " style=background-color:" + player.category.color + "><td>" + player.person + "</td></tr>"
    })
    table += "</table>"
    return table
    
}

function removePlayerFromProno(selectedPlayers) {

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
    var rankingTable = "<table><th><td>Rank</td><td>Player Name</td><td>Points</td></th>"
    players.forEach(player => {
        const category = determineCategory(player.rank)
        rankingTable += "<tr id=" + player.personId + " style=background-color:" + category.color + ";cursor:pointer onclick='assignPlayerToProno(this)'><td>" + player.rank + "</td><td>" + player.person + "</td><td>" + player.points + "</td></tr>"
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
