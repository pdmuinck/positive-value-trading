import React from 'react'
import {getByEventKey} from '../../odds/api'
import Market from '../../odds/market'
import Table from '@material-ui/core/Table'
import BookMakerHeader from '../../odds/bookmakerHeader'


export default function Event(props) {

    const [event, setEvent] = React.useState()

    React.useEffect(() => {
        async function fetchEvent() {
          const event = await getByEventKey(props.match.params.eventKey)
          setEvent(event.events[0])
        }
        fetchEvent()
      }, [props.match.params.eventKey])


    if(event) {
        const bookmakers = []
        event.books.forEach(book => {
            bookmakers.push({book: book, asset: '/assets/' + book.toLowerCase() + '.png'})
        })
        return (
            <div>
                <Table size="small">
                    <BookMakerHeader bookmakers={bookmakers} eventKey={event.eventKey}></BookMakerHeader>
                    {event.markets.map(market => {
                        return(
                            <Market market={market} bookmakers={bookmakers}></Market>
                        )
                    })}
                </Table>
            </div>
            

        )
    } else {
        return <div></div>
    }

}