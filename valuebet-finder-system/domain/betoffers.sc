class BetOffer(val betOfferId: Long,
               val markets: List[Market],
               val eventId: Long,
               val bookmakerId: Int) {
  def publishBetOffer(): BetOfferPublished = {
    new BetOfferPublished(this.betOfferId)
  }
}

class Market(val marketId: Int,
             val marketName: String,
             val marketOptions: List[MarketOption]
            )

class MarketOption(val marketOptionId: Int,
                   val marketOptionName: String,
                   val price: Double
                  )

class BetOfferPublished(val BetOfferId: Long)