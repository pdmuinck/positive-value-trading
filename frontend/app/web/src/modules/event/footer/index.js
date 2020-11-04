import React from 'react'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import {Link} from "react-router-dom"

export default function EventFooter({event}) {

    return(
        <TableRow>
            <TableCell>{event.startDate}</TableCell>
            <TableCell colSpan={event.bookmakers.length} align="right">
            
                <Link to={'/event/' + event.eventKey}>See more odds</Link>
            
            </TableCell>
        </TableRow>
    )


}