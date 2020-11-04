import React from 'react'


function Participants({participants}) {



    return(
        <div>{participants.map(participant => {
            return(
                <p>{participant}</p>
            )
        })}</div>
        
    )
}

export default Participants
