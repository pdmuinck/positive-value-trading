const WebSocket = require("ws")
const NodeCache = require('node-cache')
const ttlSeconds = 60 * 1 * 1
const cache = new NodeCache({ stdTTL: ttlSeconds, checkperiod: ttlSeconds * 0.2, useClones: false })

const starWS = new WebSocket("wss://eu-swarm-ws-re.bcapps.net/")

starWS.on('open', function open() {
    console.log('open')
    starWS.send(JSON.stringify({"command":"request_session","params":{"language":"eng","site_id":"385","release_date":"15/09/2020-16:48"},"rid":"16062033821871"}))
})

starWS.on('message', function incoming(data) {
    const bla = JSON.parse(data)
    if(bla.data.data) {
        console.log('received data message')
        const events = bla.data.data.game
        const eventIds = Object.keys(bla.data.data.game)
        Object.entries(events).forEach(entry => {
            console.log('insert event id: ' + entry[0])
            cache.set(entry[0], entry[1])
        })
        cache.set('test', bla.data.data)
    }

})

setInterval(() => {
    starWS.send(JSON.stringify({"command":"get","params":{"source":"betting","what":{"game":["id","show_type","markets_count","start_ts","is_live","is_blocked","is_neutral_venue","team1_id","team2_id","game_number","text_info","is_stat_available","type","info","team1_name","team2_name","tv_info","stats","add_info_name"],"market":["id","col_count","type","name_template","sequence","point_sequence","express_id","cashout","display_key","display_sub_key","group_id","name","group_name","order","extra_info","group_order"],"event":["order","id","type_1","type","type_id","original_order","name","price","nonrunner","ew_allowed","sp_enabled","extra_info","base","home_value","away_value","display_column"]},"where":{"game":{},"sport":{"id":1},"region":{},"competition":{"id":566}},"subscribe":false},"rid":"160621315266616"}))
    
}, 10000)

const event = {}

event.getBySport = async (sport) => {
    return cache.get('test')
}

event.getBetOffersByEventId = async (eventId) => {
    return cache.get(eventId)
}

event.getBetOffersByEventId = async (eventId) => {
    return cache.get(eventId)
}

module.exports = event