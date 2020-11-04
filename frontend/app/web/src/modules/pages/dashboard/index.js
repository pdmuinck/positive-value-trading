import React from 'react';
import Table from '@material-ui/core/Table'
import MainEvent from '../../event/main'
import BookMakerHeader from '../../odds/bookmakerHeader'

export default function DashBoard({events}) {

  const bookmakers = ['UNIBET', 'NAPOLEON GAMES', 'BWIN', 'BETFIRST', 'BET777', 'MERIDIAN', 'BETCENTER', 'GOLDEN_PALACE', 'BETWAY', 'PINNACLE']

  const bookmakerAssets = []

  bookmakers.forEach(bookmaker => {
    bookmakerAssets.push({book: bookmaker, asset: 'assets/' + bookmaker.toLowerCase() + '.png'})
  })

  return (
    
    <div>
        <Table size="small">
          <BookMakerHeader bookmakers={bookmakerAssets}></BookMakerHeader>
          {events.map((event, index) => {
            return(
              <MainEvent key={event.eventKey} event={event} nextEvent={events[index+1]} previousEvent={events[index-1]}></MainEvent>
            )})}
        </Table>
    </div>
  )
}