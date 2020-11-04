import React from 'react'

function BetOptions({betOffer}) {

    return(
        <div>
            {betOffer.data && betOffer.data.map(betOutcome => {
                return (
                    <div>
                        {betOutcome.betOption}
                    </div>
                )
            })}
        </div>
    )
}

export default BetOptions