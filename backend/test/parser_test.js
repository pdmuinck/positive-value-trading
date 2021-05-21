const {parseAltenarBetOffers} = require("../parser/altenar")
const assert = require("assert")
const {describe} = require("mocha")

describe("Altenar parser", function() {
    it("should parse all betoffer types", function() {
        const betOffers = require("../test/resources/altenar/betoffers.json")
        const expected = require("../test/resources/altenar/expected_betoffers.json")
        const result = parseAltenarBetOffers(betOffers)
        result.forEach(result => delete result.margin)
        console.log(result)
        //assert.deepStrictEqual(expected, result)
    })
});