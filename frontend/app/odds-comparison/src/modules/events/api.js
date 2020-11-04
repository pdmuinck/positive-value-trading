const axios = require('axios')
const events = require('./events.json')

const api = {}

api.getEvents = () => {
    //return axios.get('http://localhost:3003/events').then(res => res.data)
    return events
}

export default api