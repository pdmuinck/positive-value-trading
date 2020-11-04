import React from 'react'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import TableBody from '@material-ui/core/TableBody'
import Typography from '@material-ui/core/Typography'
import {withStyles} from '@material-ui/core/styles'
import MuiTableCell from "@material-ui/core/TableCell"
import LiveBanner from '../livebanner'
import MarketLine from '../../odds/marketLine'
import EventFooter from '../footer'

const MyTableCell = withStyles({
    root: {
      borderBottom: 0
    },
  })(MuiTableCell)

function displayEvent(event) {
    return (
        <TableBody>
            {event.live &&
                <LiveBanner></LiveBanner>
            }
            {event.lines.map((line, index) => {
                const key = line.option + '-' + line.market
                return(
                    <MarketLine key={key} line={line}></MarketLine>
                )
            })}
            <EventFooter event={event}></EventFooter>
            <TableRow >
                <MyTableCell colSpan={3}></MyTableCell>
            </TableRow>
            
        </TableBody>
    )
}

function displayLastEvent(event, nextEvent) {
    return (
        <TableBody>
            {event.live &&
                <LiveBanner></LiveBanner>
            }
            {event.lines.map((line, index) => {
                const key = line.option + '-' + line.market
                return(
                    <MarketLine key={key} line={line}></MarketLine>  
                )  
            })}
            <EventFooter event={event}></EventFooter>
            <TableRow >
                <MyTableCell colSpan={3}></MyTableCell>
            </TableRow>
            <TableRow>
            <TableCell colSpan={3}>
                <Typography variant="h6">{nextEvent.league}</Typography>
            </TableCell>
            </TableRow>
            
        </TableBody>
    )
}


function displayFirstEvent(event) {
    
    return (
        <TableBody>
            <TableRow>
            <MyTableCell>
                <Typography variant="h6">{event.league}</Typography>
            </MyTableCell>
            </TableRow>
            {event.live &&
                <LiveBanner></LiveBanner>
            }
            {event.lines.map((line, index) => {
                const key = line.option + '-' + line.market + '-' + line.participant
                return(
                    <MarketLine key={key} line={line}></MarketLine>
                )
            })}
            <EventFooter event={event}></EventFooter>
            <TableRow >
                <MyTableCell colSpan={3}></MyTableCell>
            </TableRow>
            
        </TableBody>
    )
} 


export default function MainEvent({event, nextEvent, previousEvent}) {

    if(!previousEvent) {
        return displayFirstEvent(event)
    }

    if(nextEvent && event.league !== nextEvent.league) {
        return displayLastEvent(event, nextEvent)
    } else {
        return displayEvent(event)
    }
}