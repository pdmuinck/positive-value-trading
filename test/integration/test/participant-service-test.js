const axios = require('axios')
const { expect } = require('chai')
const assert = require('chai').expect
const exec = require('child_process').execSync

describe('participant integration test', () => {
    it('should get participants from different services', async () => {
        const stop = exec('docker-compose down --rmi all')

        // build kambi worker and worker interface
        const start = exec('docker-compose up -d')
    
        console.log(start)
    
        console.log('done compose up')
    
        const results = await axios.get('http://localhost:3080/leagues/eredivisie/participants')
        .then(response => response.data).catch(error => console.log(error))
    
        expect(results['AJAX'].kambi).to.equal(1000000051)
        expect(Object.keys(results).length).to.equal(18)
    }).timeout(250000)
})











