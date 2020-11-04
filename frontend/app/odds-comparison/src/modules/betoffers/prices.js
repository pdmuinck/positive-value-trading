import React from 'react'

function Prices({betOffer}) {

    return(
        <div>
            {betOffer.data && betOffer.data.map(betOutcome => {
                return (
                    <div>
                        {betOutcome.price}
                    </div>
                )
            })}
        </div>
    )

}

export default Prices