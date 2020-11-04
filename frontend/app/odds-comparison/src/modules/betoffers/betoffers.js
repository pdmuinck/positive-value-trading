import React from 'react'
import api from './api'
import useInterval from '../utils/userinterval'
import Prices from './prices'
import BetOptions from './betoptions'
import Bookmaker from './bookmaker'

function BetOffers({event}) {

    const [kambi, setKambi] = React.useState()
    const [sbtech, setSbtech] = React.useState()
    const [pinnacle, setPinnacle] = React.useState()

    useInterval(() => {
        async function getBetOffers() {
            const betOffers = api.getBetOffers()
            if(event.kambiEvent) {
                setKambi(betOffers.filter(betOffer => betOffer.eventId == event.kambiEvent.id))
            } 
            if(event.sbtechEvent) {
                setSbtech(betOffers.filter(betOffer => betOffer.eventId == event.sbtechEvent.id))
            } 
            if(event.pinnacleEventId) {
                setPinnacle(betOffers.filter(betOffer => betOffer.eventId == event.pinnacleEventId))
            }
        }
        getBetOffers()
    }, 60*100)

    return (
        <div>
            {kambi && kambi.map(betOffer => {
                return(
                    <div>
                        <Bookmaker book={betOffer.book}></Bookmaker>
                        <BetOptions betOffer={betOffer}></BetOptions>
                        <Prices betOffer={betOffer}></Prices>
                    </div>
                )  
            })}
            {sbtech && sbtech.map(betOffer => {
                return(
                    <div>
                        <Bookmaker book={betOffer.book}></Bookmaker>
                        <BetOptions betOffer={betOffer}></BetOptions>
                        <Prices betOffer={betOffer}></Prices>
                    </div>
                )  
            })}
            {pinnacle && pinnacle.map(betOffer => {
                return(
                    <div>
                        <Bookmaker book={betOffer.book}></Bookmaker>
                        <BetOptions betOffer={betOffer}></BetOptions>
                        <Prices betOffer={betOffer}></Prices>
                    </div>
                )  
            })}
        </div>
    )
}

export default BetOffers