const axios = require('axios')

const headers = {
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json; charset=UTF-8',
    }
}

const payload = {leagueId:117, categoryId:32,sportId:1}

axios.post('https://bet90.be/Sports/SportLeagueGames', payload, headers).then(response => console.log(response.data)).catch(error => console.log(error))


//axios.get('https://bet90.be/Bet/SpecialBetsCustomer?bettypeID=10&gameid=1080404', null, headers).then(response => console.log(response.data)).catch(error => console.log(error))