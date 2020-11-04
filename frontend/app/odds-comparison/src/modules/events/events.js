import React from 'react'
import useInterval from '../utils/userinterval'
import Api from './api'
import Participants from '../participants/participant'
import BetOffers from '../betoffers/betoffers'
import EventDate from '../events/eventdate'

function Events() {
    const [events, setEvents] = React.useState()

    useInterval(() => {
        async function getEvents() {
            const events = Api.getEvents()
            setEvents(events)
        }

        getEvents()
    }, 60 * 100)

    return(
        <div>{events && events.map(event => {
            return(
                <div>
                    <EventDate start={event.start}></EventDate>
                    <Participants participants={event.participants}></Participants>
                    <BetOffers event={event}></BetOffers>
                </div>
            )
        })}</div>
    )
}

export default Events
