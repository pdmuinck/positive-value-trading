function auth() {
    sessionStorage.setItem("user", document.getElementById("user-name").value)
    sessionStorage.setItem("pass", document.getElementById("pass").value)
    location.href='dashboard.html'
}

async function getPlayers() {
    const response = await fetch("http://127.0.0.1:3000/players?year=2019")
    players = await response.json()
    console.log(players)
    players.forEach(player => {
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

getPlayers()
