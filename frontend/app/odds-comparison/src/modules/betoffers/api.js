const axios = require('axios')
const betoffers = require('./betoffers.json')

const api = {}

api.getBetOffers = () => {
    //return axios.get('http://localhost:3004/betoffers').then(res => res.data)
    return betoffers
}

export default api