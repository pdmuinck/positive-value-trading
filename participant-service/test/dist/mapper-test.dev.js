"use strict";

var participants = require('./participants.json');

var mapper = require('../services/mapper');

var expect = require('chai').expect;

var assert = require('chai').assert;

describe('mapper merges participants', function () {
  it('should map participants with same name', function () {
    var result = mapper.map(participants);
    expect(result).to.be.an('array');
    var bookMap = result['AJAX'];
    expect(bookMap.kambi).to.equal(1000000051);
    expect(bookMap.sbtech).to.equal('1936');
  });
});