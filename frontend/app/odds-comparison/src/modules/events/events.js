import React from 'react'
import useInterval from '../utils/userinterval'
import Api from './api'
import BetOffers from '../betoffers/betoffers'
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';


function Events() {
    const bookmakers = Api.getBookmakers()
    const tabs = Api.getSports()

    const [events, setEvents] = React.useState()
    const [value, setValue] = React.useState(0)

    const handleChange = (event, newValue) => {
        setValue(newValue)
      }

    async function getEvents() {
        const events = Api.getEvents(tabs[value])
        setEvents(events)
    }

    useInterval(() => {
        getEvents()
    }, 60 * 100)

    React.useEffect(() => {
        getEvents()
    }, [value])

    return(
        <div>
            <Tabs class="tab" value={value} onChange={handleChange} aria-label="sport tabs">
                {tabs.map((tab, index) => {
                    return(
                    <Tab label={tab} />
                    )
                })}
            </Tabs>
            <table>
                <thead>
                    <tr>
                        <th colSpan={2}></th>
                        {bookmakers.map(bookmaker => {
                            return(
                                <th key={bookmaker.id}>
                                    <img src={bookmaker.logo} height={21} alt={bookmaker.alt} width={50}></img>
                                </th>
                            )
                        })}
                    </tr>
                </thead>
                <tbody>
                    {events && events.map(event => {
                        return (
                            <BetOffers event={event} bookmakers={bookmakers}></BetOffers>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default Events
