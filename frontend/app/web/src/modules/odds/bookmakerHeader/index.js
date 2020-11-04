import React from 'react';
import TableRow from '@material-ui/core/TableRow'
import TableHead from '@material-ui/core/TableHead'
import {withStyles} from '@material-ui/core/styles'
import Bookmaker from '../bookmaker'
import MuiTableCell from '@material-ui/core/TableCell'

export default function BookMakerHeader({bookmakers, eventKey}) {

    const StickyHeader = withStyles({
        root: {
          backgroundColor: "#fff",
          position: "sticky",
          top: 0
        }
      })(MuiTableCell)


      return(
        <TableHead>
            <TableRow >
            <StickyHeader key={eventKey} width="30%">
                {eventKey}
            </StickyHeader>
            
            {bookmakers.map(bookmaker => {
                return(
                <StickyHeader key={bookmaker.book} align='center' width='25px' margin='10px'>
                    <Bookmaker src={bookmaker.asset}></Bookmaker>
                </StickyHeader>
                )
            })}
            </TableRow>
        
        </TableHead>
      )
}