import React from 'react'

function Prices({betOffer}) {
    if(betOffer.data) {
        const orderedPrices = []
        orderedPrices.push(betOffer.data.filter(price => price.betOption === "1").map(price => price.price))
        orderedPrices.push(betOffer.data.filter(price => price.betOption === "2").map(price => price.price))
        orderedPrices.push(betOffer.data.filter(price => price.betOption === "X").map(price => price.price))
        return(
            <div class="price">
                {orderedPrices.map(price => {
                    return (
                        <div>
                            {price}
                        </div>
                    )
                })}
            </div>
        )
    } else {
        return(
            <div class="price">
                NA
            </div>
        )
    }
}

export default Prices