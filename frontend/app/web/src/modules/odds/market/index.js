import React from 'react'

import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import MarketLine from '../marketLine'

export default function Market({market, bookmakers}) {

    return(
        <TableBody>
            <TableRow>
                <TableCell colSpan={bookmakers.length}>{market.name}</TableCell>
            </TableRow>
            {market.lines.map(line => {
                return(
                    <MarketLine line={line}></MarketLine>
                )
            })}
        </TableBody>
    )
}