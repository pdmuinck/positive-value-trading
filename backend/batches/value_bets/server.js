const http = require('http')
const {exec} = require('child_process')

http.createServer(async function (req, res) {
    let body = '';
    req.on('data', (chunk) => {
        body += chunk;
    })
    req.on('end', () => {
        exec('./find_value_bets \'' + body + '\'',
            (error, stdout, stderr) => {
                console.log(stdout);
                console.log(stderr);
                if (error !== null) {
                    console.log(`exec error: ${error}`);
                }
                res.statusCode = 200
                res.end(stdout)
            })
    })
}).listen(process.env.PORT)

console.log('http server listens to port: ' + process.env.PORT)