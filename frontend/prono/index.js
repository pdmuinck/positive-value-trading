let players
let selectedPlayers = {}

function assignPlayerToProno(event) {
    const selectedPlayer = players.filter(player => player.personId === event.id)[0]
    const category = determineCategory(selectedPlayer.rank)
    const key = [category.color, category.code].join("|")
    if(selectedPlayers[key]) {
        if(selectedPlayers[key].length === 3) {
            document.getElementById("error").innerHTML = "<span style=color:red>You already selected 3 players from category " + category.code + ". Please remove one first.</span>"
        } else {
            selectedPlayers[key].push(selectedPlayer)
        }
    } else {
        selectedPlayers[key] = [selectedPlayer]
    }
    const table = createSelectedPlayersTable()
    document.getElementById("selections").innerHTML = table
}

function createSelectedPlayersTable() {
    var table = "<table><th><td>Player Name</td></th>"
    Object.keys(selectedPlayers).forEach(key => {
        const category = key.split("|")
        const players = selectedPlayers[key]
        players.forEach(player => {
            table += "<tr id=" + player.personId + " style=background-color:" + category[0] + "><td>" + player.person + "</td></tr>"
        })
        table += "</table>"
    })
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
    const response = await fetch("http://127.0.0.1:3000/atp-rankings")
    players = await response.json()
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

function determineColor(rank) {

}

getAtpRankings()
