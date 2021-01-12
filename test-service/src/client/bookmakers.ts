import {BookMaker} from "../domain/betoffer";
import {ApiResponse} from "./scraper";

const axios = require('axios')

export const bookmakers = {}

bookmakers[BookMaker.PINNACLE] = [
    axios.get(
        'https://guest.api.arcadia.pinnacle.com/0.1/sports/29/markets/straight?primaryOnly=true',
        {
            headers: {
                "X-API-Key": "CmX2KcMrXuFmNg6YFbmTxE0y9CIrOi0R",
                "Referer": "https://www.pinnacle.com/",
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        }
    ).then(response => {return new ApiResponse(BookMaker.PINNACLE, response.data)})
        .catch(error => {return new ApiResponse(BookMaker.PINNACLE, null)})
]

bookmakers[BookMaker.UNIBET_BELGIUM] = [
    axios.get(
        'https://eu-offering.kambicdn.org/offering/v2018/ubbe/betoffer/group/1000093190.json?type=6'
    ).then(response => {return new ApiResponse(BookMaker.UNIBET_BELGIUM, response.data)})
        .catch(error => {return new ApiResponse(BookMaker.UNIBET_BELGIUM, null)}),
    axios.get(
        'https://eu-offering.kambicdn.org/offering/v2018/ubbe/betoffer/group/1000093190.json?type=1'
    ).then(response => {return new ApiResponse(BookMaker.UNIBET_BELGIUM, response.data)})
        .catch(error => {return new ApiResponse(BookMaker.UNIBET_BELGIUM, null)})
]

bookmakers[BookMaker.NAPOLEON_GAMES] = [
    axios.get(
        'https://eu-offering.kambicdn.org/offering/v2018/ngbe/betoffer/group/1000093190.json?type=6'
    ).then(response => {return new ApiResponse(BookMaker.NAPOLEON_GAMES, response.data)})
        .catch(error => {return new ApiResponse(BookMaker.NAPOLEON_GAMES, null)}),
    axios.get(
        'https://eu-offering.kambicdn.org/offering/v2018/ngbe/betoffer/group/1000093190.json?type=1'
    ).then(response => {return new ApiResponse(BookMaker.NAPOLEON_GAMES, response.data)})
        .catch(error => {return new ApiResponse(BookMaker.NAPOLEON_GAMES, null)})
]


