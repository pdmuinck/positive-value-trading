

function string(t) {
    const crypto = require("crypto")
    const s = "abcdefghijklmnopqrstuvwxyz012345"
    const i = 43
    for (var e = s.length, n = crypto.randomBytes(t), r = [], o = 0; o < t; o++) r.push(s.substr(n[o] % e, 1));
    return r.join("")
}

function number(t) {
    return Math.floor(Math.random() * t)
}

function numberString(t) {
    var e = ("" + (t - 1)).length;
    return (new Array(e + 1).join("0") + number(t)).slice(-e)
}


function getMagicBettingApiUrl() {
    const generatedId = string(8)
    const server = numberString(1e3)
    const url = "wss://magicbetting.be/api/" + server + "/" + generatedId + "/websocket"
    return url
}

console.log(getMagicBettingApiUrl())
