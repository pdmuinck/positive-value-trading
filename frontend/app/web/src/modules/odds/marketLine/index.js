import React from 'react'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import MuiTableCell from '@material-ui/core/TableCell'
import {withStyles} from '@material-ui/core/styles'

const MyTableCell = withStyles({
    root: {
      borderBottom: 0
    },
  })(MuiTableCell)

export default function MarketLine({line}) {

    let participant = line.participant

    if(!line.participant) participant = line.option

    return(
        <TableRow>
            <TableCell>
                {participant}
            </TableCell>
            {line.prices.map(price => {
                let correctedPrice = 1.0
                if(price.price) correctedPrice = price.price.toFixed(2)
                const key = line.eventKey + '-' + line.market + '-' + line.option + '-' + line.participant + '-' + price.bookmaker
                return(
                    <MyTableCell key={key} align='center'>{correctedPrice}</MyTableCell>
                )
            })}
        </TableRow>
    )
}