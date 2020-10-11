const axios = require('axios')
const exec = require('child_process').execSync
const KAMBI_SERVICE = 'kambi-service:latest'
const WORKER_INTERFACE = 'worker-interface:latest'


async function testSo() {

    // build kambi worker
    exec('docker build --tag ' + KAMBI_SERVICE + ' ../../workers/kambi-service/.')

    // build worker interface
    exec('docker build --tag ' + WORKER_INTERFACE + ' ../../workers/worker-interface/.')

    runContainer(3000, KAMBI_SERVICE)

    runContainer(3001, WORKER_INTERFACE)

    const results = await axios.get('http://localhost:3000/bookmakers/UNIBET_BELGIUM/events', {proxy: {host: '127.0.0.1', port: 3000}})
    .then(response => response.data)

    const eventId = results[0].events[0].id
    
    const betoffers = await axios.post('http://localhost:3001/providers/KAMBI/events/' + 1006933058+ '/betoffers', {book: 'UNIBET_BELGIUM'}).then(response => response.data)

    console.log(betoffers)

    const containers = listContainers()

    removeContainers(containers)

}

function removeContainers(containers) {
    containers.forEach(container => {
        if(container !== '') exec('docker container rm -f ' + container)
    })
}

function listContainers() {
    const result = exec('docker container ls -aq')
    return result.toString('utf-8').split('\n')
}

function runContainer(port, service) {
    exec('docker run --network bridge -e NODE_ENV=development --publish <port>:3000 --detach <service>'.replace('<port>', port).replace('<service>', service))
}

testSo()









