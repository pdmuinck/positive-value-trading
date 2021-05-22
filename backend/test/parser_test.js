const {parseAltenarBetOffers} = require("../parser/altenar")
const {parseBetwayBetOffers} = require("../parser/betway")
const assert = require("assert")
const {describe} = require("mocha")

describe("Parsers", function() {
    const books = [{name: "betway", parser: parseBetwayBetOffers}]
    books.forEach(book => {
        it("check " + book, function() {
            const betOffers = require("../test/resources/" + book.name + "/betoffers.json")
            const expected = require("../test/resources/" + book.name + "/expected_betoffers.json")
            const result = book.parser(betOffers)
            result.forEach(result => delete result.margin)
            assert.deepStrictEqual(JSON.stringify(result), JSON.stringify(expected))
        })
    })

})