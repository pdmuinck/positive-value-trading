import axios from 'axios'

export function getEvents() {
    return axios.get('http://localhost:3003/events').then(res => res.data)
}

export function getBetOffers() {
    return axios.get('http://localhost:3004/betoffers').then(res => res.data)
}