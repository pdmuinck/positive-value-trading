import React from 'react'
import TableRow from '@material-ui/core/TableRow'
import {withStyles} from '@material-ui/core/styles'
import MuiTableCell from '@material-ui/core/TableCell'

export default function LiveBanner() {

    const Banner = withStyles({
        root: {
          borderColor: 'red',
          color: 'red'
        },
      })(MuiTableCell)

    return(
        <TableRow>
            <Banner>Live</Banner>
        </TableRow>
    )

}