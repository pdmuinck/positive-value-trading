const {parseAltenarBetOffers} = require("../parser/altenar")
const {parseBetwayBetOffers} = require("../parser/betway")
const assert = require("assert")
const {parsePinnacleBetOffers} = require("../parser/pinnacle");
const {parserMeridianBetOffers} = require("../parser/meridian");
const {parseLadbrokesBetOffers} = require("../parser/ladbrokes");
const {parseKambiBetOffers} = require("../parser/kambi");
const {parseCashPointBetOffers} = require("../parser/cashpoint");
const {parseBwinBetOffers} = require("../parser/bwin");
const {parseBingoalBetOffers} = require("../parser/bingoal");
const {describe} = require("mocha")

describe("Parsers", function() {
    const books = []
    //const books = [{name: "pinnacle", parser: parsePinnacleBetOffers}]
    books.forEach(book => {
        it("check " + book, function() {
            const betOffers = require("../test/resources/" + book.name + "/betoffers.json")
            const expected = require("../test/resources/" + book.name + "/expected_betoffers.json")
            const result = book.parser(betOffers)
            result.forEach(result => {
                delete result.margin
                delete result.key
            })
            //assert.deepStrictEqual(JSON.stringify(result), JSON.stringify(expected))
            assert.deepStrictEqual(result, expected)
        })
    })

    it("check pinnacle", function() {
        const betTypes = require("./resources/pinnacle/markets.json")
        const betOffers = require("../test/resources/pinnacle/betoffers.json")
        const expected = require("../test/resources/pinnacle/expected_betoffers.json")
        const result = parsePinnacleBetOffers(betTypes, betOffers.data)
        result.forEach(result => {
            delete result.margin
            delete result.key
        })
        //assert.deepStrictEqual(JSON.stringify(result), JSON.stringify(expected))
        assert.deepStrictEqual(result, expected)
    })

})