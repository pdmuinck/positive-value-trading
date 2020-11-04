import React from 'react'


export default function EventHeader({league, eventKey}) {

    const home = eventKey.split('-')[2]
    const away = eventKey.split('-')[3]

    return(
        <div>
            <div>{league}</div>
            <div>{home} VS. {away}</div>


        </div>
        
    )

}