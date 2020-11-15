const participants = require('./participants.json')
const mapper = require('../services/mapper')
const expect = require('chai').expect

describe('mapper merges participants', () => {
    it('should map participants with same name', () => {
        const result = mapper.map(participants)
        const bookMap = result['AJAX']
        expect(bookMap.kambi).to.equal(1000000051)
        expect(bookMap.sbtech).to.equal('1936')
        expect(bookMap.pinnacle).to.equal('AJAX')
    
    })
})