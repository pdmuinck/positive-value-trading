import React from 'react'
import api from './api'
import useInterval from '../utils/userinterval'
import Prices from './prices'

function BetOffers({event, bookmakers}) {

    const [betOffers, setBetOffers] = React.useState()

    useInterval(() => {
        async function getBetOffers() {
            const betOffers = api.getBetOffers(event, bookmakers)
            setBetOffers(betOffers) 
        }
        getBetOffers()
    }, 60*100)

    return (
        <tr class="event">
            <td > 
                <div class="datetime">{event.start.split('T')[0]}</div>
                <div class="datetime">{event.start.split('T')[1].slice(0,5)}</div>
            </td>
            <td>{event.participants.map(participant => {
                return(
                    <div class="participant" key={participant}>
                        {participant}
                    </div>
                )
                })}
                <div class="participant">Draw</div>
                
            </td>
            
            {betOffers && betOffers.map(betOffer => {
                return(
                    <td>
                        <Prices betOffer={betOffer}></Prices>
                    </td>
                )  
            })}
           
        </tr>
        
    )
}

export default BetOffers