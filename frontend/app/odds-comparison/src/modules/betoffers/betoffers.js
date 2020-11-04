import React from 'react'
import api from './api'
import useInterval from '../utils/userinterval'
import Prices from './prices'
import BetOptions from './betoptions'

function BetOffers({event}) {

    const [betOffers, setBetOffers] = React.useState()

    useInterval(() => {
        async function getBetOffers() {
            const betOffers = api.getBetOffers().filter(betOffer => betOffer.eventId == event.pinnacleEventId)
            setBetOffers(betOffers)
        }
        getBetOffers()
    }, 60*100)

    return (
        <div>
            {betOffers && betOffers.map(betOffer => {
                return(
                    <div>
                        <BetOptions betOffer={betOffer}></BetOptions>
                        <Prices betOffer={betOffer}></Prices>
                    </div>
                )  
            })}
        </div>
    )
}

export default BetOffers